/* ==========================================================================
   app.js - base común del sitio.
   Genera la barra de navegación y el pie, maneja el menú móvil, el modo
   campo, la impresion y el registro del service worker.
   Debe cargarse antes que el resto de los modulos.
   ========================================================================== */

(function () {

  'use strict';

  /* ------------------------------------------------------------ Utilidades */

  const Campo = {

    /** Quita tildes y pasa a minúsculas, para búsquedas tolerantes. */
    norm(texto) {
      return String(texto == null ? '' : texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    },

    /** Número con separador de miles chileno (punto) y decimal (coma). */
    num(valor, decimales = 0) {
      const n = Number(valor);
      if (!isFinite(n)) return '-';
      return n.toLocaleString('es-CL', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
      });
    },

    /** Formato compacto: 12.345 -> "12.345", 1.250.000 -> "1,25 M". */
    compacto(valor) {
      const n = Number(valor) || 0;
      const abs = Math.abs(n);
      if (abs >= 1e6) return Campo.num(n / 1e6, 2) + ' M';
      if (abs >= 1e4) return Campo.num(n / 1e3, 1) + ' mil';
      return Campo.num(n, 0);
    },

    /** Formatea una fecha ISO (YYYY-MM-DD) como "14 mar 2026". */
    fecha(iso, conAnio = true) {
      if (!iso) return '-';
      const d = new Date(iso + 'T12:00:00');
      if (isNaN(d)) return iso;
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                     'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      return d.getDate() + ' ' + meses[d.getMonth()] + (conAnio ? ' ' + d.getFullYear() : '');
    },

    /** Crea un elemento con clase y contenido. */
    el(tag, clase, html) {
      const n = document.createElement(tag);
      if (clase) n.className = clase;
      if (html != null) n.innerHTML = html;
      return n;
    },

    /** Escapa texto para insertarlo como HTML. */
    esc(texto) {
      return String(texto == null ? '' : texto)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    /** Lee una propiedad anidada de window sin fallar si no existe. */
    dato(obj, ruta, porDefecto = null) {
      return ruta.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj) ?? porDefecto;
    }

  };

  window.Campo = Campo;

  /* --------------------------------------------------------------- Iconos */

  const ICONO = {
    flecha: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 10l5 5 5-5z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
    cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6 16.9 4.3z"/></svg>',
    sol: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0-6h0v3h0zm0 19h0v3h0zM1 12h3v0H1zm19 0h3v0h-3zM4.2 4.2l2.1 2.1-2.1-2.1zm13.5 13.5l2.1 2.1-2.1-2.1zM4.2 19.8l2.1-2.1-2.1 2.1zm13.5-13.5l2.1-2.1-2.1 2.1z"/></svg>',
    imprimir: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3h10v4H7V3zm-2 6h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zm4 8h6v4H9v-4z"/></svg>',
    avellano: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2c3 0 6 2.2 6 6.6C18 12.8 15.4 16 12 16S6 12.8 6 8.6C6 4.2 9 2 12 2zm-7 19h14v1H5z"/></svg>'
  };

  /* ------------------------------------------------------- Estructura nav -- */

  const NAV = [
    { href: 'index.html', label: 'Inicio' },
    {
      grupo: 'Campo',
      items: [
        { href: 'avellanos.html', label: 'Avellanos' },
        { href: 'ovejas.html', label: 'Ovejas' },
        { href: 'riego.html', label: 'Riego' },
        { href: 'maquinaria.html', label: 'Maquinaria' },
        { href: 'mapa.html', label: 'Mapa del campo' }
      ]
    },
    {
      grupo: 'Herramientas',
      items: [
        { href: 'calendario.html', label: 'Calendario anual' },
        { href: 'calculadoras.html', label: 'Calculadoras' },
        { href: 'bitacora.html', label: 'Bitácoras' }
      ]
    },
    { href: 'documentos.html', label: 'Documentos' },
    { href: 'contacto.html', label: 'Contactos' }
  ];

  const ENLACES_FOOTER = [
    {
      titulo: 'El campo',
      items: [
        { href: 'avellanos.html', label: 'Avellanos' },
        { href: 'ovejas.html', label: 'Ovejas' },
        { href: 'riego.html', label: 'Riego' },
        { href: 'maquinaria.html', label: 'Maquinaria' },
        { href: 'mapa.html', label: 'Mapa del campo' }
      ]
    },
    {
      titulo: 'Herramientas',
      items: [
        { href: 'calendario.html', label: 'Calendario anual' },
        { href: 'calculadoras.html', label: 'Calculadoras' },
        { href: 'bitacora.html', label: 'Bitácoras' },
        { href: 'documentos.html', label: 'Documentos' }
      ]
    },
    {
      titulo: 'Sitio',
      items: [
        { href: 'index.html', label: 'Inicio' },
        { href: 'contacto.html', label: 'Contactos' },
        { href: 'sitemap.xml', label: 'Mapa del sitio' }
      ]
    }
  ];

  const NOMBRE_POR_DEFECTO = 'Campo Agrícola';

  /* ---------------------------------------------------------- Render header */

  function pintarHeader() {
    const cont = document.getElementById('barra-header');
    if (!cont) return;

    const datos = window.DATOS_CAMPO || {};
    const pagina = document.body.dataset.pagina || '';
    const nombre = datos.nombre || NOMBRE_POR_DEFECTO;

    const items = NAV.map((item) => {
      if (item.href) {
        const activo = pagina === item.href ? ' activo' : '';
        return `<li><a href="${item.href}"${activo}>${Campo.esc(item.label)}</a></li>`;
      }

      const hijos = item.items.map((sub) => {
        const activo = pagina === sub.href ? ' activo' : '';
        return `<li><a href="${sub.href}"${activo}>${Campo.esc(sub.label)}</a></li>`;
      }).join('');

      const abierto = item.items.some((s) => s.href === pagina) ? ' abierto' : '';

      return `
        <li class="nav-grupo${abierto}">
          <button type="button" aria-haspopup="true" aria-expanded="${abierto ? 'true' : 'false'}">
            ${Campo.esc(item.grupo)} <span class="flecha">${ICONO.flecha}</span>
          </button>
          <ul class="nav-submenu">${hijos}</ul>
        </li>`;
    }).join('');

    cont.innerHTML = `
      <a class="marca" href="index.html">
        <span class="logo" aria-hidden="true">${ICONO.avellano}</span>
        <span>${Campo.esc(nombre)}<small>Gestión del campo</small></span>
      </a>

      <nav class="nav-principal" id="nav-principal" aria-label="Navegación principal">
        <ul class="nav-lista">${items}</ul>
      </nav>

      <div class="acciones-header">
        <div class="buscador-global">
          <input type="search" id="busqueda-global" placeholder="Buscar en el sitio (Ctrl+K)"
                 aria-label="Buscar en el sitio" autocomplete="off">
          <div class="resultados-busqueda" id="resultados-busqueda" role="listbox"></div>
        </div>

        <button type="button" class="btn-icono" id="btn-modo-campo"
                title="Modo campo (letra grande, alto contraste)"
                aria-label="Activar modo campo" aria-pressed="false">${ICONO.sol}</button>

        <button type="button" class="btn-icono" id="btn-imprimir"
                title="Imprimir esta página" aria-label="Imprimir">${ICONO.imprimir}</button>

        <button type="button" class="btn-icono btn-menu" id="btn-menu"
                aria-label="Abrir menú" aria-expanded="false">${ICONO.menu}</button>
      </div>`;
  }

  function pintarFooter() {
    const cont = document.getElementById('pie-footer');
    if (!cont) return;

    const datos = window.DATOS_CAMPO || {};
    const nombre = datos.nombre || NOMBRE_POR_DEFECTO;

    const cols = ENLACES_FOOTER.map((col) => `
      <div>
        <h4>${Campo.esc(col.titulo)}</h4>
        <ul>${col.items.map((i) => `<li><a href="${i.href}">${Campo.esc(i.label)}</a></li>`).join('')}</ul>
      </div>`).join('');

    const contacto = [];
    if (datos.comuna || datos.region) {
      contacto.push(`<li>${Campo.esc([datos.comuna, datos.region].filter(Boolean).join(', '))}</li>`);
    }
    if (datos.telefono) {
      contacto.push(`<li><a href="tel:${Campo.esc(datos.telefono.replace(/\s/g, ''))}">${Campo.esc(datos.telefono)}</a></li>`);
    }
    if (datos.email) {
      contacto.push(`<li><a href="mailto:${Campo.esc(datos.email)}">${Campo.esc(datos.email)}</a></li>`);
    }

    cont.innerHTML = `
      <div class="cols">
        ${cols}
        <div>
          <h4>${Campo.esc(nombre)}</h4>
          ${contacto.length ? `<ul>${contacto.join('')}</ul>` : '<ul><li>Datos de contacto por definir</li></ul>'}
          ${datos.superficieTotal ? `<ul><li>${Campo.num(datos.superficieTotal, 0)} ha en total</li></ul>` : ''}
        </div>
      </div>

      <div class="legal">
        <span>&copy; <span id="anio">2026</span> ${Campo.esc(nombre)}. Sitio de uso interno.</span>
        <span>Publicado con GitHub Pages &middot; Documentos en PDF con visor integrado</span>
      </div>`;

    const anio = document.getElementById('anio');
    if (anio) anio.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------------------------------- Comportamiento */

  function activarMenuMovil() {
    const btn = document.getElementById('btn-menu');
    const nav = document.getElementById('nav-principal');
    if (!btn || !nav) return;

    const setIcono = (abierto) => {
      btn.innerHTML = abierto ? ICONO.cerrar : ICONO.menu;
      btn.setAttribute('aria-expanded', String(abierto));
      btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    };

    btn.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      setIcono(abierto);
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('abierto');
        setIcono(false);
      }
    });
  }

  function activarDesplegables() {
    document.querySelectorAll('.nav-grupo > button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.parentElement;
        const abierto = li.classList.toggle('abierto');
        btn.setAttribute('aria-expanded', String(abierto));

        // Cierra los demás grupos abiertos
        document.querySelectorAll('.nav-grupo.abierto').forEach((otro) => {
          if (otro !== li) {
            otro.classList.remove('abierto');
            otro.querySelector('button').setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-grupo.abierto').forEach((g) => {
        g.classList.remove('abierto');
        g.querySelector('button').setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-grupo.abierto').forEach((g) => {
          g.classList.remove('abierto');
          g.querySelector('button').setAttribute('aria-expanded', 'false');
        });
        const nav = document.getElementById('nav-principal');
        if (nav) nav.classList.remove('abierto');
      }
    });
  }

  function activarModoCampo() {
    const btn = document.getElementById('btn-modo-campo');
    if (!btn) return;

    const guardarModo = () => {
      try {
        localStorage.setItem('campo:modo',
          document.documentElement.classList.contains('modo-campo') ? '1' : '0');
      } catch (e) { /* almacenamiento no disponible */ }
    };

    try {
      if (localStorage.getItem('campo:modo') === '1') {
        document.documentElement.classList.add('modo-campo');
      }
    } catch (e) { /* sin almacenamiento */ }

    const sincronizar = () => {
      const activo = document.documentElement.classList.contains('modo-campo');
      btn.classList.toggle('activo', activo);
      btn.setAttribute('aria-pressed', String(activo));
      btn.title = activo ? 'Salir del modo campo' : 'Modo campo (letra grande, alto contraste)';
    };

    sincronizar();

    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('modo-campo');
      sincronizar();
      guardarModo();
    });
  }

  function activarImpresion() {
    const btn = document.getElementById('btn-imprimir');
    if (!btn) return;
    btn.addEventListener('click', () => window.print());
  }

  function activarServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' })
        .catch(() => { /* sin service worker: el sitio funciona igual */ });
    });
  }

  /* ------------------------------------------------------------- Arranque -- */

  function iniciar() {
    pintarHeader();
    pintarFooter();
    activarMenuMovil();
    activarDesplegables();
    activarModoCampo();
    activarImpresion();
    activarServiceWorker();
    if (window.CampoBuscador) window.CampoBuscador.iniciar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();
