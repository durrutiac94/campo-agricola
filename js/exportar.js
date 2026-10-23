/* ==========================================================================
   exportar.js - exportación de tablas a CSV compatible con Excel es-CL.
   Usa punto y coma como separador (Excel en configuración regional chilena
   usa coma decimal, por lo que con "," las columnas se abren corridas) y
   añade BOM UTF-8 para que los acentos se vean bien.
   ========================================================================== */

(function () {

  'use strict';

  const SEP = ';';
  const BOM = '\uFEFF';

  function escapar(valor) {
    if (valor === null || valor === undefined) return '';

    let s = String(valor);

    // Prefijo neutral para valores que Excel interpretaría como fórmula.
    if (/^[=+\-@]/.test(s)) s = "'" + s;

    if (s.includes('"') || s.includes(SEP) || s.includes('\n') || s.includes('\r')) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }

    return s;
  }

  /**
   * Descarga una tabla como CSV.
   * @param {string} nombreArchivo  nombre sin extensión
   * @param {string[]} encabezados  títulos de columnas
   * @param {Array<Array>} filas      datos
   * @param {string[]} [pie]          fila de totales al final
   */
  function descargarCSV(nombreArchivo, encabezados, filas, pie) {
    const lineas = [];

    lineas.push(encabezados.map(escapar).join(SEP));
    filas.forEach((f) => lineas.push(f.map(escapar).join(SEP)));
    if (pie && pie.length) lineas.push(pie.map(escapar).join(SEP));

    const csv = BOM + lineas.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo.endsWith('.csv') ? nombreArchivo : nombreArchivo + '.csv';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Exporta una tabla <table> visible en pantalla.
   * @param {string} nombreArchivo
   * @param {string} [selector]  selector CSS de la tabla; por defecto busca la tabla más cercana al botón
   * @param {HTMLButtonElement} [botón]
   */
  function descargarTabla(nombreArchivo, selector, botón) {
    const tabla = selector
      ? document.querySelector(selector)
      : (botón ? botón.closest('.seccion, .tarjeta, .panel-mes')?.querySelector('table.tabla') : null);

    if (!tabla) {
      alert('No se encontró la tabla para exportar.');
      return;
    }

    const encabezados = Array.from(tabla.querySelectorAll('thead th')).map((th) => th.textContent.trim());

    const filas = Array.from(tabla.querySelectorAll('tbody tr')).map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.trim())
    );

    const filaPie = tabla.querySelector('tfoot tr');
    const pie = filaPie
      ? Array.from(filaPie.children).map((td) => td.textContent.trim())
      : null;

    descargarCSV(nombreArchivo, encabezados, filas, pie);
  }

  /**
   * Convierte un objeto de datos en código JS listo para pegar en un
   * archivo de data/. Se usa en la bitácora para volcar las entradas
   * capturadas en el terreno.
   */
  function aCodigoJS(nombreVariable, datos) {
    const cuerpo = JSON.stringify(datos, null, 2)
      .split('\n')
      .map((l) => '  ' + l)
      .join('\n');

    return 'window.' + nombreVariable + ' = ' + cuerpo + ';\n';
  }

  window.CampoExportar = { descargarCSV, descargarTabla, aCodigoJS, escapar };

})();
