/* ==========================================================================
   bitacora.js - bitacora de labores y gastos
   ========================================================================== */

(function () {
  'use strict';

  const C = window.Campo;
  const CATEGORIAS = [
    { id: 'avellanos', nombre: 'Avellanos' },
    { id: 'ovejas', nombre: 'Ovejas' },
    { id: 'riego', nombre: 'Riego' },
    { id: 'maquinaria', nombre: 'Maquinaria' },
    { id: 'otro', nombre: 'Otro' }
  ];

  function categoriaFiltro() {
    const valor = C.norm(new URLSearchParams(window.location.search).get('categoria') || '');
    return CATEGORIAS.some(function (c) { return c.id === valor; }) ? valor : '';
  }

  function etiquetaCategoria(categoria) {
    const clave = C.norm(categoria);
    const encontrada = CATEGORIAS.filter(function (c) { return c.id === clave; })[0];
    if (encontrada) return encontrada.nombre;
    return categoria ? String(categoria) : 'General';
  }

  function urlFiltro(id) {
    return 'bitacora.html' + (id ? '?categoria=' + encodeURIComponent(id) : '') + '#labores';
  }

  function ancla(id) {
    const a = document.createElement('span');
    a.id = id;
    a.className = 'ancla';
    a.setAttribute('aria-hidden', 'true');
    return a;
  }

  function barraFiltros(actual) {
    const barra = document.createElement('div');
    barra.className = 'tabs filtros-categoria';
    barra.setAttribute('aria-label', 'Filtrar labores por categoría');

    [{ id: '', nombre: 'Todas' }].concat(CATEGORIAS).forEach(function (opcion) {
      const enlace = document.createElement('a');
      enlace.className = 'tab' + (opcion.id === actual ? ' activo' : '');
      enlace.href = urlFiltro(opcion.id);
      enlace.textContent = opcion.nombre;
      if (opcion.id === actual) enlace.setAttribute('aria-current', 'page');
      barra.appendChild(enlace);
    });

    return barra;
  }

  function formatCLP(m) {
    try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(m); } catch (e) { return '$ ' + m; }
  }

  function conEditor() {
    return !!(window.CampoEditor && window.CampoEditor.puedeEditar());
  }

  function cabecera(texto, seccion, lista, etiqueta) {
    const cab = document.createElement('div');
    cab.className = 'cab-seccion';
    const h = document.createElement('h2');
    h.textContent = texto;
    cab.appendChild(h);
    if (window.CampoEditor) window.CampoEditor.agregarBoton(seccion, lista, etiqueta, cab);
    return cab;
  }

  function tabla(items, columnas, seccion, lista, celdas, numCols) {
    const env = document.createElement('div');
    env.className = 'tabla-envoltura';
    const t = document.createElement('table');
    t.className = 'tabla responsive';

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    columnas.forEach(function (col) {
      const th = document.createElement('th');
      th.textContent = col;
      trh.appendChild(th);
    });
    if (conEditor()) {
      const thAcc = document.createElement('th');
      thAcc.className = 'col-acciones';
      thAcc.textContent = 'Acciones';
      trh.appendChild(thAcc);
    }
    thead.appendChild(trh);
    t.appendChild(thead);

    const tbody = document.createElement('tbody');
    items.forEach(function (item) {
      const tr = document.createElement('tr');
      celdas(item).forEach(function (val, i) {
        const td = document.createElement('td');
        if (numCols.indexOf(i) >= 0) td.className = 'num';
        if (columnas[i]) td.dataset.label = columnas[i];
        td.textContent = val;
        tr.appendChild(td);
      });
      if (conEditor()) {
        const tdAcc = document.createElement('td');
        tdAcc.className = 'col-acciones';
        tdAcc.dataset.label = 'Acciones';
        const acciones = window.CampoEditor.accionesFila(seccion, lista, item);
        if (acciones) tdAcc.appendChild(acciones);
        tr.appendChild(tdAcc);
      }
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    env.appendChild(t);
    return env;
  }

  function render() {
    const cont = document.getElementById('bitacora');
    if (!cont) return;

    cont.innerHTML = '';

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.innerHTML = '<button class="tab activo" data-tab="labores">Labores</button><button class="tab" data-tab="gastos">Gastos</button>';
    cont.appendChild(tabs);

    const panelLabores = document.createElement('section');
    panelLabores.id = 'panel-labores';
    panelLabores.className = 'seccion';
    panelLabores.appendChild(ancla('labores'));
    cont.appendChild(panelLabores);

    const panelGastos = document.createElement('section');
    panelGastos.id = 'panel-gastos';
    panelGastos.className = 'seccion';
    panelGastos.style.display = 'none';
    panelGastos.appendChild(ancla('gastos'));
    cont.appendChild(panelGastos);

    tabs.querySelectorAll('.tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('activo'); });
        btn.classList.add('activo');
        panelLabores.style.display = btn.dataset.tab === 'labores' ? 'block' : 'none';
        panelGastos.style.display = btn.dataset.tab === 'gastos' ? 'block' : 'none';
      });
    });

    // Labores
    const filtro = categoriaFiltro();
    const todas = (window.DATOS_LABORES || []).slice().sort(function (a, b) {
      return String(b.fecha || '').localeCompare(String(a.fecha || ''));
    });
    const labores = filtro ? todas.filter(function (l) {
      return C.norm(l.categoria) === filtro;
    }) : todas;

    panelLabores.appendChild(cabecera('Labores realizadas', 'bitacora', 'labores', 'Agregar labor'));
    const introL = document.createElement('p');
    introL.className = 'parrafo-intro';
    introL.textContent = 'Registro de las labores efectuadas en el campo.';
    panelLabores.appendChild(introL);
    panelLabores.appendChild(barraFiltros(filtro));

    if (filtro) {
      const aviso = document.createElement('div');
      aviso.className = 'aviso info';
      aviso.innerHTML = 'Mostrando <strong>' + C.esc(labores.length) + '</strong> ' +
        (labores.length === 1 ? 'labor' : 'labores') + ' de <strong>' +
        C.esc(etiquetaCategoria(filtro)) + '</strong>. ' +
        '<a href="' + urlFiltro('') + '">Ver todas</a>';
      panelLabores.appendChild(aviso);
    }

    if (!labores.length) {
      panelLabores.appendChild(C.el('div', 'vacio', filtro
        ? 'No hay labores registradas para esta categoría.'
        : 'Todavía no hay labores registradas.'));
    } else {
      panelLabores.appendChild(tabla(
        labores,
        ['Fecha', 'Categoría', 'Labor', 'Sector', 'Ha', 'Horas', 'Personas', 'Costo', 'Observación'],
        'bitacora', 'labores',
        function (l) {
          return [l.fecha, etiquetaCategoria(l.categoria), l.labor, l.sector, l.hectareas, l.horas, l.personas, formatCLP(l.costo || 0), l.observacion || ''];
        },
        [4, 5, 6, 7]
      ));
    }

    // Gastos
    const gastos = (window.DATOS_GASTOS || []).slice().sort(function (a, b) {
      return a.fecha < b.fecha ? 1 : -1;
    });
    panelGastos.appendChild(cabecera('Gastos e ingresos', 'bitacora', 'gastos', 'Agregar movimiento'));
    const introG = document.createElement('p');
    introG.className = 'parrafo-intro';
    introG.textContent = 'Movimientos registrados por fecha, categoría y proveedor.';
    panelGastos.appendChild(introG);
    panelGastos.appendChild(tabla(
      gastos,
      ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Monto', 'Forma de pago', 'Proveedor'],
      'bitacora', 'gastos',
      function (g) {
        return [g.fecha, g.tipo, g.categoria, g.concepto, formatCLP(g.monto || 0), g.formaPago || '', g.proveedor || ''];
      },
      [4]
    ));

    // Totales
    let total = 0;
    gastos.forEach(function (g) { if (g.tipo === 'gasto') total += (g.monto || 0); });
    const aviso = document.createElement('div');
    aviso.className = 'aviso info';
    aviso.innerHTML = '<strong>Total de gastos registrados:</strong> ' + C.esc(formatCLP(total));
    panelGastos.appendChild(aviso);
  }

  if (window.CampoDatos) {
    window.CampoDatos.pintar(render);
  } else {
    render();
  }
})();
