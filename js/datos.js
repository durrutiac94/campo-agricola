/* Capa de datos del sitio.
   - Muestra primero lo guardado en el dispositivo (rápido y sin conexión).
   - Luego refresca desde Supabase y vuelve a pintar las páginas.
   - Si no hay nada guardado ni conexión, usa los archivos data/*.js como semilla. */
(function () {
  'use strict';

  var CLAVE_CACHE = 'campo.datos.v1';
  var TIMEOUT_RED = 10000;
  var M = window.CAMPO_MANIFIESTO || {};

  var semillas = {};       // global -> copia profunda de los datos iniciales
  var crudo = { registros: [], ajustes: [] };
  var cache = null;        // { ts, registros, ajustes }
  var hidratado = false;
  var origen = 'semilla';
  var version = 0;
  var oyentes = [];
  var listos = [];
  var enRed = false;

  function clon(valor) {
    return valor == null ? valor : JSON.parse(JSON.stringify(valor));
  }

  function leerCache() {
    try {
      var t = localStorage.getItem(CLAVE_CACHE);
      if (!t) return null;
      var c = JSON.parse(t);
      if (!c || !Array.isArray(c.registros) || !Array.isArray(c.ajustes)) return null;
      return c;
    } catch (e) {
      return null;
    }
  }

  function guardarCache() {
    try {
      localStorage.setItem(CLAVE_CACHE, JSON.stringify({
        ts: Date.now(),
        registros: crudo.registros,
        ajustes: crudo.ajustes
      }));
    } catch (e) { /* sin espacio: seguimos con la red o la semilla */ }
  }

  // Guardar las semillas antes de que se reemplacen los globales.
  (function capturarSemillas() {
    var vistos = {};
    Object.keys(M).forEach(function (sec) {
      var m = M[sec];
      if (m.global && window[m.global] && !vistos[m.global]) {
        semillas[m.global] = clon(window[m.global]);
        vistos[m.global] = true;
      }
      m.listas.forEach(function (l) {
        if (l.global && window[l.global] && !vistos[l.global]) {
          semillas[l.global] = clon(window[l.global]);
          vistos[l.global] = true;
        }
      });
    });
  }());

  function derivarMes(item) {
    if (item && typeof item.fecha === 'string' && /^\d{4}-\d{2}/.test(item.fecha)) {
      item.mes = Number(item.fecha.slice(5, 7)) - 1;
    }
    return item;
  }

  function agrupar() {
    var porSeccion = {};
    crudo.registros.slice().sort(function (a, b) {
      return (a.orden || 0) - (b.orden || 0);
    }).forEach(function (r) {
      if (!porSeccion[r.seccion]) porSeccion[r.seccion] = {};
      if (!porSeccion[r.seccion][r.lista]) porSeccion[r.seccion][r.lista] = [];
      var item = clon(r.datos) || {};
      item._id = r.id;
      item._orden = r.orden;
      if (r.seccion === 'calendario' && r.lista === 'eventos') derivarMes(item);
      porSeccion[r.seccion][r.lista].push(item);
    });

    var ajustes = {};
    crudo.ajustes.forEach(function (a) { ajustes[a.seccion] = a.datos || {}; });

    var gestionadas = {};
    Object.keys(porSeccion).forEach(function (s) { gestionadas[s] = true; });
    Object.keys(ajustes).forEach(function (s) { gestionadas[s] = true; });

    Object.keys(M).forEach(function (sec) {
      var m = M[sec];
      var base = m.global ? clon(semillas[m.global]) : null;
      var ajustesSec = ajustes[sec];

      if (base && ajustesSec) {
        Object.keys(ajustesSec).forEach(function (k) { base[k] = clon(ajustesSec[k]); });
      }

      m.listas.forEach(function (l) {
        var filas = porSeccion[sec] && porSeccion[sec][l.nombre];
        if (!filas) {
          if (!gestionadas[sec]) return;  // aún sin migrar: se queda la semilla
          filas = [];
        }
        if (l.fuente) {
          if (base) base[l.fuente] = filas;
        } else {
          window[l.global] = filas;
        }
      });

      if (base) window[m.global] = base;
    });
  }

  function avisar() {
    version += 1;
    oyentes.forEach(function (cb) {
      try { cb({ origen: origen, version: version }); } catch (e) { /* continuar */ }
    });
  }

  function listo(cb) {
    if (typeof cb !== 'function') return;
    if (hidratado) setTimeout(cb, 0);
    else listos.push(cb);
  }

  function alCambiar(cb) {
    if (typeof cb === 'function') oyentes.push(cb);
  }

  function marcarListo() {
    hidratado = true;
    var pendientes = listos.slice();
    listos = [];
    pendientes.forEach(function (cb) { try { cb(); } catch (e) { /* continuar */ } });
  }

  function conTiempo(promesa) {
    return new Promise(function (resolver, rechazar) {
      var t = setTimeout(function () { rechazar(new Error('Sin respuesta de la red')); }, TIMEOUT_RED);
      promesa.then(function (v) { clearTimeout(t); resolver(v); },
        function (e) { clearTimeout(t); rechazar(e); });
    });
  }

  function descargar() {
    if (!window.CampoAPI || !window.CampoAPI.configurado || enRed) return Promise.resolve(false);
    enRed = true;
    return conTiempo(Promise.all([
      window.CampoAPI.listarRegistros(),
      window.CampoAPI.listarAjustes()
    ])).then(function (r) {
      crudo.registros = Array.isArray(r[0]) ? r[0] : [];
      crudo.ajustes = Array.isArray(r[1]) ? r[1] : [];
      cache = { ts: Date.now(), registros: crudo.registros, ajustes: crudo.ajustes };
      guardarCache();
      origen = 'red';
      agrupar();
      enRed = false;
      if (!hidratado) marcarListo();
      avisar();
      return true;
    }).catch(function () {
      enRed = false;
      return false;
    });
  }

  // 1. Arranque: cache local primero (sincrónico).
  cache = leerCache();
  if (cache) {
    crudo.registros = cache.registros;
    crudo.ajustes = cache.ajustes;
    origen = 'cache';
    agrupar();
  }
  marcarListo();

  // 2. Refresco en segundo plano.
  descargar();

  // 3. Reintentos al recuperar conexión o al iniciar sesión.
  window.addEventListener('online', function () { descargar(); });

  if (window.CampoAPI && window.CampoAPI.alCambiarSesion) {
    window.CampoAPI.alCambiarSesion(function (activo) { if (activo) descargar(); });
  }

  window.CampoDatos = {
    listo: listo,
    pintar: function (cb) { listo(cb); alCambiar(function () { cb(); }); },
    alCambiar: alCambiar,
    recargar: descargar,
    estado: function () {
      return { origen: origen, ts: cache ? cache.ts : 0, version: version };
    },
    filas: function (seccion, lista) {
      var out = [];
      crudo.registros.forEach(function (r) {
        if (r.seccion === seccion && r.lista === lista) out.push(r);
      });
      return out;
    },
    ajustesDe: function (seccion) {
      for (var i = 0; i < crudo.ajustes.length; i += 1) {
        if (crudo.ajustes[i].seccion === seccion) return crudo.ajustes[i].datos || {};
      }
      return {};
    },
    semilla: function (global) { return clon(semillas[global]); }
  };
}());
