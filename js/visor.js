/* ==========================================================================

   visor.js - render genérico de las secciones del campo y visor de PDF.

   - renderStats / renderTabla / renderTarjetasDocumentos / renderSeccion

   - abrirPDF: visor embebido con descarga y apertura en pestaña nueva

   ========================================================================== */

(function () {

  'use strict';

  const C = window.Campo;

  /* ------------------------------------------------------------ Utilidades */

  function normalizarId(texto) {

    return String(texto || '')

      .normalize('NFD')

      .replace(/[\u0300-\u036f]/g, '')

      .toLowerCase()

      .replace(/[^a-z0-9]+/g, '-')

      .replace(/^-+|-+$/g, '');

  }

  /** Interpreta un texto numaerico con formato chileno (punto miles, coma decimal). */

  function aNumero(texto) {

    let s = String(texto == null ? '' : texto).trim();

    if (!s) return NaN;

    s = s.replace(/[^\d.,]/g, '');

    if (!s) return NaN;

    const coma = s.lastIndexOf(',');

    const punto = s.lastIndexOf('.');

    if (coma > -1 && punto > -1) {

      s = coma > punto ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');

    } else if (coma > -1) {

      s = s.replace(',', '.');

    } else if (punto > -1) {

      s = s.replace(/\./g, '');

    }

    const n = Number(s);

    return isNaN(n) ? NaN : n;

  }

  function extension(archivo) {

    const m = /\.([a-z0-9]+)$/i.exec(archivo || '');

    return m ? m[1].toUpperCase() : 'ARCH';

  }

  /* ---------------------------------------------------------------- Stats */

  function renderStats(contenedor, stats) {

    if (!contenedor || !stats || !stats.length) return;

    const grilla = C.el('div', 'kpis');

    stats.forEach((s) => {

      const k = C.el('div', 'kpi' + (s.estado ? ' ' + s.estado : ''));

      k.innerHTML =

        '<div class="valor">' + C.esc(s.valor) +

        (s.unidad ? '<span class="unidad">' + C.esc(s.unidad) + '</span>' : '') + '</div>' +

        '<div class="etiqueta">' + C.esc(s.etiqueta) + '</div>';

      grilla.appendChild(k);

    });

    contenedor.appendChild(grilla);

  }

  /* --------------------------------------------------------------- Tablas */

  /**

   * @param {object} tabla  { titulo, nota, columnas, filas, pie }

   * @param {object} [op]   { ancla, ordenable, numCols: [] }

   */

  function renderTabla(tabla, op = {}) {

    const envoltura = C.el('div', 'tabla-envoltura');

    const t = C.el('table', 'tabla responsive');

    if (tabla.titulo || op.ancla) {

      const cap = C.el('caption');

      cap.id = op.ancla || null;

      cap.innerHTML = C.esc(tabla.titulo || '') +

        (tabla.nota ? '<span class="nota-caption">' + C.esc(tabla.nota) + '</span>' : '');

      t.appendChild(cap);

    }

    // Encabezado

    const thead = C.el('thead');

    const trh = C.el('tr');

    tabla.columnas.forEach((col, i) => {

      const th = C.el('th', op.ordenable ? 'ordenable' : '');

      th.textContent = col;

      th.dataset.indice = String(i);

      if (op.ordenable) {

        th.innerHTML = C.esc(col) + '<span class="flecha-orden">▲▼</span>';

        th.addEventListener('click', () => ordenarTabla(t, i));

      }

      trh.appendChild(th);

    });

    const ed = window.CampoEditor;

    const conAcciones = !!(ed && ed.puedeEditar && ed.puedeEditar() &&
      op.editor && op.editor.items && op.editor.items.length === tabla.filas.length);

    if (conAcciones) {

      const thAcc = C.el('th', 'col-acciones');

      thAcc.textContent = 'Acciones';

      trh.appendChild(thAcc);

    }

    thead.appendChild(trh);

    t.appendChild(thead);

    // Cuerpo

    const tbody = C.el('tbody');

    tabla.filas.forEach((fila, idx) => {

      const tr = C.el('tr');

      fila.forEach((celda, i) => {

        const td = C.el('td', (op.numCols || []).includes(i) ? 'num' : '');

        td.textContent = celda;

        // Etiqueta visible en la vista apilada (pantallas chicas)
        if (tabla.columnas && tabla.columnas[i]) td.dataset.label = tabla.columnas[i];

        if (op.etiquetas && op.etiquetas[i]) {

          td.textContent = '';

          const et = C.el('span', 'etiqueta ' + (op.etiquetas[i][celda] || ''));

          et.textContent = celda;

          td.appendChild(et);

        }

        tr.appendChild(td);

      });

      if (conAcciones) {

        const tdAcc = C.el('td', 'col-acciones');

        tdAcc.dataset.label = 'Acciones';

        const acciones = ed.accionesFila(op.editor.seccion, op.editor.lista, op.editor.items[idx]);

        if (acciones) tdAcc.appendChild(acciones);

        tr.appendChild(tdAcc);

      }

      tbody.appendChild(tr);

    });

    t.appendChild(tbody);

    // Pie (totales)

    if (tabla.pie && tabla.pie.length) {

      const tfoot = C.el('tfoot');

      const trf = C.el('tr');

      tabla.pie.forEach((celda, i) => {

        const td = C.el('td', (op.numCols || []).includes(i) ? 'num' : '');

        td.textContent = celda;

        trf.appendChild(td);

      });

      if (conAcciones) trf.appendChild(C.el('td', 'col-acciones'));

      tfoot.appendChild(trf);

      t.appendChild(tfoot);

    }

    envoltura.appendChild(t);

    return envoltura;

  }

  function ordenarTabla(tabla, indice) {

    const tbody = tabla.querySelector('tbody');

    const filas = Array.from(tbody.querySelectorAll('tr'));

    const th = tabla.querySelectorAll('thead th')[indice];

    const ascendente = !(th.classList.contains('orden-asc'));

    tabla.querySelectorAll('thead th').forEach((x) => {

      x.classList.remove('orden-asc', 'orden-desc');

    });

    th.classList.add(ascendente ? 'orden-asc' : 'orden-desc');

    const valor = (tr) => {

      const txt = (tr.children[indice].textContent || '').trim();

      const n = aNumero(txt);

      return isNaN(n) ? txt.toLowerCase() : n;

    };

    filas.sort((a, b) => {

      const va = valor(a), vb = valor(b);

      if (typeof va === 'number' && typeof vb === 'number') return ascendente ? va - vb : vb - va;

      return ascendente

        ? String(va).localeCompare(String(vb), 'es')

        : String(vb).localeCompare(String(va), 'es');

    });

    filas.forEach((f) => tbody.appendChild(f));

  }

  /* ----------------------------------------------------------- Documentos */

  function archivoPendiente(doc) {

    return !doc || !doc.archivo || /^pdfs\//.test(doc.archivo);

  }

  function tarjetaDocumento(doc, opciones = {}) {

    const art = C.el('article', 'doc-card');

    const id = 'doc-' + normalizarId(doc.titulo);

    art.id = id;

    const disponible = !archivoPendiente(doc);

    const ext = disponible ? extension(doc.archivo) : 'PDF';

    art.innerHTML = `

      <div class="tipo"><span class="ext">${C.esc(ext)}</span> documento</div>

      <h3>${C.esc(doc.titulo)}</h3>

      <p class="desc">${C.esc(doc.descripcion || '')}</p>`;

    const meta = C.el('div', 'meta');

    if (opciones.mostrarSeccion && doc.seccion) {

      meta.appendChild(C.el('span', 'etiqueta', C.esc(doc.seccion)));

    }

    if (doc.fecha) {

      meta.appendChild(C.el('span', '', C.esc(C.fecha(doc.fecha))));

    }

    (doc.tags || []).forEach((t) => meta.appendChild(C.el('span', 'etiqueta neutra', C.esc(t))));

    art.appendChild(meta);

    const acciones = C.el('div', 'acciones');

    if (disponible) {

      const btnVer = C.el('button', 'btn pequeno', 'Ver en el sitio');

      btnVer.type = 'button';

      btnVer.addEventListener('click', () => abrirPDF(doc.titulo, doc.archivo));

      acciones.appendChild(btnVer);

      const aDesc = C.el('a', 'btn secundario pequeno', 'Descargar');

      aDesc.href = doc.archivo;

      aDesc.setAttribute('download', '');

      acciones.appendChild(aDesc);

      const aNueva = C.el('a', 'btn secundario pequeno', 'Abrir aparte');

      aNueva.href = doc.archivo;

      aNueva.target = '_blank';

      aNueva.rel = 'noopener';

      acciones.appendChild(aNueva);

    } else {

      acciones.appendChild(C.el('span', 'etiqueta neutra', 'Pendiente de subir'));

    }

    if (opciones.origen && window.CampoEditor && window.CampoEditor.puedeEditar()) {

      const ed = window.CampoEditor.accionesFila(opciones.origen.seccion, opciones.origen.lista, doc);

      if (ed) {

        ed.classList.add('acciones-doc');

        acciones.appendChild(ed);

      }

    }

    art.appendChild(acciones);

    return art;

  }

  function renderTarjetasDocumentos(contenedor, docs, opciones = {}) {

    contenedor.innerHTML = '';

    if (!docs || !docs.length) {

      contenedor.appendChild(C.el('div', 'vacio', 'Todavía no hay documentos cargados.'));

      return;

    }

    const grilla = C.el('div', 'doc-grid');

    docs.forEach((d) => grilla.appendChild(tarjetaDocumento(d, opciones)));

    contenedor.appendChild(grilla);

  }

  /* ------------------------------------------------------ Visor de PDF --- */

  let modal = null;

  function crearModal() {

    if (modal) return modal;

    const fondo = C.el('div', 'visor-fondo');

    fondo.id = 'visor-fondo';

    fondo.innerHTML = `

      <div class="visor-caja" role="dialog" aria-modal="true" aria-labelledby="visor-titulo">

        <div class="visor-barra">

          <span class="titulo" id="visor-titulo"></span>

          <div class="acciones">

            <a class="btn secundario pequeno" id="visor-descargar" download>Descargar</a>

            <a class="btn secundario pequeno" id="visor-nueva" target="_blank" rel="noopener">Abrir aparte</a>

            <button type="button" class="btn secundario pequeno" id="visor-cerrar">Cerrar</button>

          </div>

        </div>

        <div class="visor-marco">

          <iframe id="visor-iframe" title="Visor de documento PDF"></iframe>

        </div>

      </div>`;

    document.body.appendChild(fondo);

    const cerrar = () => {

      fondo.classList.remove('visible');

      const iframe = document.getElementById('visor-iframe');

      if (iframe) iframe.src = 'about:blank';

    };

    fondo.querySelector('#visor-cerrar').addEventListener('click', cerrar);

    fondo.addEventListener('click', (e) => { if (e.target === fondo) cerrar(); });

    document.addEventListener('keydown', (e) => {

      if (e.key === 'Escape' && fondo.classList.contains('visible')) cerrar();

    });

    modal = fondo;

    return fondo;

  }

  function abrirPDF(titulo, archivo) {

    if (!archivo) return;

    const fondo = crearModal();

    fondo.querySelector('#visor-titulo').textContent = titulo || archivo;

    const iframe = fondo.querySelector('#visor-iframe');

    iframe.src = archivo + '#view=FitH';

    fondo.querySelector('#visor-descargar').href = archivo;

    fondo.querySelector('#visor-nueva').href = archivo;

    fondo.classList.add('visible');

    document.body.style.overflow = 'hidden';

    fondo.addEventListener('transitionend', () => { document.body.style.overflow = ''; });

    document.body.style.overflow = '';

  }

  /* ------------------------------------------------- Composición completa - */

  /**

   * Renderiza una página de sección a partir de su objeto de datos.

   * @param {HTMLElement} contenedor

   * @param {object} datos  { titulo, resumen, stats, tablas, documentos, avisos }

   */

  function renderSeccion(contenedor, datos) {

    if (!contenedor || !datos) return;

    contenedor.innerHTML = '';

    if (datos.resumen) {

      const p = C.el('p', 'parrafo-intro', C.esc(datos.resumen));

      contenedor.appendChild(p);

    }

    (datos.avisos || []).forEach((a) => {

      const div = C.el('div', 'aviso ' + (a.tipo || 'info'));

      div.innerHTML = (a.titulo ? '<strong>' + C.esc(a.titulo) + '</strong><br>' : '') + C.esc(a.texto);

      contenedor.appendChild(div);

    });

    const ed = window.CampoEditor;

    if (ed && ed.puedeEditar() && datos.editorAjustes) {

      const barra = C.el('div', 'barra-editor');

      const b = C.el('button', 'btn pequeno', 'Editar ficha');

      b.type = 'button';

      b.addEventListener('click', () => ed.editarAjustes(datos.editorAjustes));

      barra.appendChild(b);

      contenedor.appendChild(barra);

    }

    if (datos.stats && datos.stats.length) {

      const sec = C.el('div', 'seccion');

      sec.appendChild(C.el('h2', '', 'Resumen'));

      renderStats(sec, datos.stats);

      contenedor.appendChild(sec);

    }

    (datos.tablas || []).forEach((t, i) => {

      const sec = C.el('div', 'seccion');

      const ancla = 'tabla-' + (datos.clave || 'sec') + '-' + i;

      const cab = C.el('div', 'cab-seccion');

      cab.appendChild(C.el('h2', '', t.titulo || 'Datos'));

      if (ed && ed.puedeEditar() && t.editor) {

        ed.agregarBoton(t.editor.seccion, t.editor.lista, 'Agregar', cab);

      }

      sec.appendChild(cab);

      const cont = C.el('div');

      cont.appendChild(renderTabla(t, {

        ancla,

        ordenable: t.ordenable !== false,

        numCols: t.numCols || [],

        etiquetas: t.etiquetas || null,

        editor: t.editor || null

      }));

      sec.appendChild(cont);

      contenedor.appendChild(sec);

    });

    if ((datos.documentos && datos.documentos.length) || (ed && ed.puedeEditar() && datos.clave)) {

      const sec = C.el('div', 'seccion');

      const cab = C.el('div', 'cab-seccion');

      const h = C.el('h2', '', 'Documentos');

      h.innerHTML = 'Documentos <span class="contador">' + (datos.documentos || []).length + ' archivos</span>';

      cab.appendChild(h);

      if (ed && ed.puedeEditar()) {

        ed.agregarBoton(datos.clave, 'documentos', 'Agregar documento', cab);

      }

      sec.appendChild(cab);

      const cont = C.el('div');

      renderTarjetasDocumentos(cont, datos.documentos || [], { origen: { seccion: datos.clave, lista: 'documentos' } });

      sec.appendChild(cont);

      contenedor.appendChild(sec);

    }

  }

  window.CampoVisor = {

    renderStats,

    renderTabla,

    renderTarjetasDocumentos,

    renderSeccion,

    abrirPDF,

    normalizarId

  };

})();

