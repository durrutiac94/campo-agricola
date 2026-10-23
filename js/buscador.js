/* ==========================================================================

   buscador.js - búsqueda global del sitio (Ctrl+K / "/" ).

   Construye el índice con los datos que haya cargados en la página actual

   (documentos, contactos, calendario, tablas de las secciones del campo).

   ========================================================================== */

(function () {

  'use strict';

  let indice = null;

  function invalidar() { indice = null; }

  function construirIndice() {

    const C = window.Campo;

    const items = [];

    // Documentos

    (window.DATOS_DOCUMENTOS || []).forEach((d) => {

      items.push({

        tipo: 'Documento',

        titulo: d.titulo,

        detalle: [d.seccion, d.categoria, d.descripcion].filter(Boolean).join(' · '),

        url: 'documentos.html#doc-' + normalizarId(d.titulo),

        busqueda: [d.titulo, d.descripcion, d.categoria, d.seccion, (d.tags || []).join(' ')]

          .filter(Boolean).join(' ')

      });

    });

    // Documentos de cada sección (catálogos independientes)

    const secciones = [

      { clave: 'DATOS_AVELLANOS', nombre: 'Avellanos', url: 'avellanos.html' },

      { clave: 'DATOS_OVEJAS', nombre: 'Ovejas', url: 'ovejas.html' },

      { clave: 'DATOS_RIEGO', nombre: 'Riego', url: 'riego.html' },

      { clave: 'DATOS_MAQUINARIA', nombre: 'Maquinaria', url: 'maquinaria.html' }

    ];

    secciones.forEach((s) => {

      const d = window[s.clave];

      if (!d) return;

      (d.documentos || []).forEach((doc) => {

        items.push({

          tipo: 'Documento · ' + s.nombre,

          titulo: doc.titulo,

          detalle: doc.descripcion || '',

          url: s.url + '#doc-' + normalizarId(doc.titulo),

          busqueda: [doc.titulo, doc.descripcion, (doc.tags || []).join(' ')].filter(Boolean).join(' ')

        });

      });

    });

    // Contactos

    (window.DATOS_CONTACTOS || []).forEach((ct) => {

      items.push({

        tipo: 'Contacto',

        titulo: ct.proveedor,

        detalle: [ct.empresa, ct.especialidad, ct.categoria].filter(Boolean).join(' · '),

        url: 'contacto.html',

        busqueda: [ct.proveedor, ct.empresa, ct.especialidad, ct.telefono, ct.email, ct.categoria]

          .filter(Boolean).join(' ')

      });

    });

    // Tareas del calendario

    const cal = window.DATOS_CALENDARIO;

    if (cal && cal.filas) {

      cal.filas.forEach((fila) => {

        Object.keys(fila.tareas || {}).forEach((mes) => {

          (fila.tareas[mes] || []).forEach((tarea) => {

            const texto = typeof tarea === 'string' ? tarea : tarea.texto;

            items.push({

              tipo: 'Calendario · ' + fila.etiqueta,

              titulo: texto,

              detalle: 'Mes ' + (Number(mes) + 1),

              url: 'calendario.html#mes-' + mes,

              busqueda: [texto, fila.etiqueta].join(' ')

            });

          });

        });

      });

    }

    // Tablas de las secciones (búsqueda de celdas)

    secciones.forEach((s) => {

      const d = window[s.clave];

      if (!d || !d.tablas) return;

      d.tablas.forEach((t, i) => {

        (t.filas || []).forEach((fila) => {

          const texto = fila.join(' ');

          items.push({

            tipo: 'Dato · ' + s.nombre,

            titulo: texto,

            detalle: t.titulo || '',

            url: s.url + '#tabla-' + s.clave.toLowerCase().replace('datos_', '') + '-' + i,

            busqueda: texto + ' ' + (t.titulo || '')

          });

        });

      });

    });

    // Labores registradas

    (window.DATOS_LABORES || []).forEach((l) => {

      items.push({

        tipo: 'Bitácora de labores',

        titulo: l.labor,

        detalle: [l.fecha, l.sector, l.responsable].filter(Boolean).join(' · '),

        url: 'bitacora.html#labores',

        busqueda: [l.labor, l.sector, l.responsable, l.observaciones, l.clima].filter(Boolean).join(' ')

      });

    });

    // Gastos

    (window.DATOS_GASTOS || []).forEach((g) => {

      items.push({

        tipo: 'Bitácora de gastos',

        titulo: g.descripcion,

        detalle: [g.fecha, g.categoria].filter(Boolean).join(' · '),

        url: 'bitacora.html#gastos',

        busqueda: [g.descripcion, g.categoria, g.tipo].filter(Boolean).join(' ')

      });

    });

    items.forEach((it) => { it.busqueda = C.norm(it.busqueda); });

    return items;

  }

  function normalizarId(texto) {

    return String(texto || '')

      .normalize('NFD')

      .replace(/[\u0300-\u036f]/g, '')

      .toLowerCase()

      .replace(/[^a-z0-9]+/g, '-')

      .replace(/^-+|-+$/g, '');

  }

  function buscar(termino) {

    if (!indice) indice = construirIndice();

    const C = window.Campo;

    const q = C.norm(termino);

    if (q.length < 2) return [];

    const palabras = q.split(/\s+/).filter(Boolean);

    const resultados = [];

    indice.forEach((it) => {

      const texto = it.busqueda;

      if (!palabras.every((p) => texto.includes(p))) return;

      // Los títulos que empiezan con el término primero

      const puntaje = (it.titulo.toLowerCase().startsWith(q) ? 100 : 0) +

                      (it.titulo.toLowerCase().includes(q) ? 50 : 0) +

                      (texto.startsWith(q) ? 20 : 0) +

                      (palabras.length * 5);

      resultados.push(Object.assign({}, it, { puntaje }));

    });

    return resultados.sort((a, b) => b.puntaje - a.puntaje).slice(0, 40);

  }

  function pintarResultados(contenedor, resultados, termino) {

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (termino.trim().length < 2) {

      contenedor.classList.remove('visible');

      return;

    }

    if (!resultados.length) {

      contenedor.innerHTML = '<div class="vacio">Sin resultados para "' +

        window.Campo.esc(termino) + '</div>';

      contenedor.classList.add('visible');

      return;

    }

    let tipoActual = null;

    resultados.forEach((r) => {

      if (r.tipo !== tipoActual) {

        tipoActual = r.tipo;

        contenedor.appendChild(window.Campo.el('div', 'grupo-titulo', window.Campo.esc(r.tipo)));

      }

      const a = window.Campo.el('a');

      a.href = r.url;

      a.innerHTML = '<span>' + window.Campo.esc(r.titulo) + '</span>' +

        (r.detalle ? '<div class="sub">' + window.Campo.esc(r.detalle) + '</div>' : '');

      contenedor.appendChild(a);

    });

    contenedor.classList.add('visible');

  }

  function iniciar() {

    const input = document.getElementById('busqueda-global');

    const cont = document.getElementById('resultados-busqueda');

    if (!input || !cont) return;

    if (input.dataset.buscadorListo === '1') return;

    input.dataset.buscadorListo = '1';

    let temporizador = null;

    const ejecutar = () => {

      const termino = input.value;

      clearTimeout(temporizador);

      temporizador = setTimeout(() => {

        pintarResultados(cont, buscar(termino), termino);

      }, 120);

    };

    input.addEventListener('input', ejecutar);

    input.addEventListener('focus', () => { if (input.value.trim().length >= 2) ejecutar(); });

    document.addEventListener('click', (e) => {

      if (!e.target.closest('.buscador-global')) {

        const c = document.getElementById('resultados-busqueda');

        if (c) c.classList.remove('visible');

      }

    });

    input.addEventListener('keydown', (e) => {

      if (e.key === 'Escape') { cont.classList.remove('visible'); input.blur(); }

      if (e.key === 'Enter') {

        const primero = cont.querySelector('a');

        if (primero) { e.preventDefault(); window.location.href = primero.getAttribute('href'); }

      }

    });

    document.addEventListener('keydown', (e) => {

      const actual = document.getElementById('busqueda-global');

      if (!actual) return;

      const enCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {

        e.preventDefault();

        actual.focus();

        actual.select();

      } else if (e.key === '/' && !enCampo) {

        e.preventDefault();

        actual.focus();

      }

    });

  }

  window.CampoBuscador = { iniciar, buscar, construirIndice, invalidar };

})();

