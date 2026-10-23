/* ==========================================================================
   mapa.js - render del diagrama SVG del campo.

   Toma window.DATOS_MAPA (data/mapa.js) y dibuja las parcelas, caminos,
   infraestructura y puntos de agua. Al seleccionar una forma se muestra el
   detalle en el panel lateral.

   ========================================================================== */

(function () {

  'use strict';

  const C = window.Campo;

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(nombre, atributos) {
    const nodo = document.createElementNS(SVG_NS, nombre);
    Object.keys(atributos || {}).forEach((k) => nodo.setAttribute(k, atributos[k]));
    return nodo;
  }

  /** Polígono a partir de una lista de puntos [[x, y], ...]. */
  function puntos(valores) {
    return valores.map((p) => p.join(',')).join(' ');
  }

  /** Centro geométrico de un polígono, para ubicar la etiqueta. */
  function centro(valores) {
    const x = valores.reduce((a, p) => a + p[0], 0) / valores.length;
    const y = valores.reduce((a, p) => a + p[1], 0) / valores.length;
    return { x, y };
  }

  function colorDe(clase) {
    const d = window.DATOS_MAPA;
    const item = (d.leyenda || []).find((l) => l.id === clase);
    return item || { color: '#cccccc', borde: '#999999', nombre: clase };
  }

  function renderDetalle(datos) {
    const cont = document.getElementById('detalle-mapa');
    if (!cont) return;

    cont.innerHTML = '';

    if (!datos) {
      const vacio = C.el('div', 'vacio', 'Selecciona una parcela o un elemento del mapa para ver su detalle.');
      cont.appendChild(vacio);
      return;
    }

    const h = C.el('h3', '', C.esc(datos.etiqueta));
    cont.appendChild(h);

    const filas = C.el('div', 'datos-clave');

    [
      ['Superficie', datos.superficie],
      ['Uso', datos.uso],
      ['Cultivo', datos.cultivo],
      ['Riego', datos.riego],
      ['Estado', datos.estado],
      ['Volumen', datos.volumen],
      ['Caudal', datos.caudal]
    ].forEach((par) => {
      if (!par[1]) return;
      const fila = C.el('div', 'fila');
      fila.appendChild(C.el('span', 'k', C.esc(par[0])));
      fila.appendChild(C.el('span', 'v', C.esc(par[1])));
      filas.appendChild(fila);
    });

    cont.appendChild(filas);

    if (datos.notas) {
      cont.appendChild(C.el('p', 'parrafo-intro', C.esc(datos.notas)));
    }
  }

  function renderLeyenda(contenedor) {
    const d = window.DATOS_MAPA;
    if (!contenedor || !d) return;

    contenedor.innerHTML = '';

    (d.leyenda || []).forEach((l) => {
      const span = C.el('span');
      const i = C.el('i');
      i.style.background = l.color;
      i.style.border = '1px solid ' + l.borde;
      span.appendChild(i);
      span.appendChild(document.createTextNode(l.nombre));
      contenedor.appendChild(span);
    });
  }

  function render(contenedor) {
    const d = window.DATOS_MAPA;
    if (!contenedor || !d) return;

    contenedor.innerHTML = '';

    const vb = d.viewBox || { x: 0, y: 0, width: 900, height: 650 };

    const svg = el('svg', {
      viewBox: [vb.x, vb.y, vb.width, vb.height].join(' '),
      class: 'mapa-svg',
      role: 'img',
      'aria-label': d.titulo
    });

    (d.elementos || []).forEach((item) => {
      if (item.tipo === 'texto') {
        const texto = el('text', {
          x: item.x, y: item.y,
          class: item.id === 'norte' ? 'texto-mapa norte' : 'texto-mapa',
          'text-anchor': 'middle',
          'font-weight': '700'
        });
        texto.textContent = item.texto;
        svg.appendChild(texto);
        return;
      }

      const color = colorDe(item.clase);

      const forma = el('polygon', {
        points: puntos(item.puntos),
        class: 'forma',
        fill: color.color,
        stroke: color.borde,
        'stroke-width': '2',
        'data-id': item.id
      });

      forma.addEventListener('click', () => {
        svg.querySelectorAll('.forma').forEach((f) => f.classList.remove('seleccionada'));
        forma.classList.add('seleccionada');
        renderDetalle(item);
      });

      svg.appendChild(forma);

      // Etiqueta centered sobre la forma
      const c = centro(item.puntos);
      const texto = el('text', {
        x: c.x, y: c.y,
        class: 'texto-mapa',
        'text-anchor': 'middle',
        'pointer-events': 'none'
      });
      texto.textContent = item.etiqueta;
      svg.appendChild(texto);

      if (item.superficie) {
        const sub = el('text', {
          x: c.x, y: c.y + 14,
          class: 'sub-mapa',
          'text-anchor': 'middle',
          'pointer-events': 'none'
        });
        sub.textContent = item.superficie;
        svg.appendChild(sub);
      }
    });

    contenedor.appendChild(svg);

    renderDetalle(null);
  }

  window.CampoMapa = { render, renderLeyenda, renderDetalle };

})();
