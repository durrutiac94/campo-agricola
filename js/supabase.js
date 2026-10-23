/* Cliente mínimo de Supabase por REST.
   Cubre solo lo que usa el sitio: sesión con correo y contraseña, lectura y
   escritura de registros/ajustes y archivos PDF en Storage.
   No requiere librerías externas ni conexión a CDN. */
(function () {
  'use strict';

  var CFG = window.CAMPO_SUPABASE || {};
  var BASE = String(CFG.url || '').replace(/\/$/, '');
  var CLAVE = CFG.clave || '';
  var BUCKET = CFG.bucket || 'documentos';
  var CLAVE_SESION = 'campo.sesion.v1';

  var sesion = leerSesion();
  var oyentes = [];
  var refrescoEnCurso = null;

  function leerSesion() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null');
    } catch (e) {
      return null;
    }
  }

  function guardarSesion(nueva) {
    sesion = nueva || null;
    try {
      if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
      else localStorage.removeItem(CLAVE_SESION);
    } catch (e) { /* almacenamiento lleno o bloqueado */ }
    avisar();
  }

  function avisar() {
    oyentes.forEach(function (cb) {
      try { cb(!!sesion); } catch (e) { /* no romper a los demás */ }
    });
  }

  function mensajeDeError(cuerpo, estado) {
    if (cuerpo && typeof cuerpo === 'object') {
      return cuerpo.message || cuerpo.error_description || cuerpo.msg ||
        cuerpo.error || ('Error ' + estado);
    }
    return 'Error ' + estado;
  }

  function pedir(ruta, opciones) {
    opciones = opciones || {};
    var cabeceras = Object.assign({ apikey: CLAVE }, opciones.cabeceras || {});
    if (opciones.json !== false) cabeceras['Content-Type'] = 'application/json';
    if (opciones.token) cabeceras.Authorization = 'Bearer ' + opciones.token;
    else if (opciones.conSesion !== false && sesion) {
      cabeceras.Authorization = 'Bearer ' + sesion.access_token;
    }
    var init = { method: opciones.metodo || 'GET', headers: cabeceras };
    if (opciones.cuerpo !== undefined) {
      init.body = opciones.json === false ? opciones.cuerpo : JSON.stringify(opciones.cuerpo);
    }
    return fetch(BASE + ruta, init).then(function (r) {
      if (r.status === 204) return null;
      var tipo = r.headers.get('content-type') || '';
      var leer = tipo.indexOf('json') >= 0 ? r.json() : r.text();
      return leer.then(function (cuerpo) {
        if (!r.ok) {
          var err = new Error(mensajeDeError(cuerpo, r.status));
          err.estado = r.status;
          err.codigo = cuerpo && typeof cuerpo === 'object' && cuerpo.statusCode
            ? Number(cuerpo.statusCode) : r.status;
          err.cuerpo = cuerpo;
          throw err;
        }
        return cuerpo;
      });
    });
  }

  function tokenValido() {
    if (!sesion || !sesion.access_token) return Promise.resolve(null);
    var vence = Number(sesion.expires_at || 0);
    if (!vence || vence * 1000 - Date.now() > 60000) {
      return Promise.resolve(sesion.access_token);
    }
    if (!refrescoEnCurso) {
      refrescoEnCurso = pedir('/auth/v1/token?grant_type=refresh_token', {
        metodo: 'POST',
        cuerpo: { refresh_token: sesion.refresh_token },
        conSesion: false
      }).then(function (r) {
        guardarSesion(armarSesion(r));
        return sesion.access_token;
      }).catch(function (e) {
        guardarSesion(null);
        throw e;
      }).then(function (t) {
        refrescoEnCurso = null;
        return t;
      }, function (e) {
        refrescoEnCurso = null;
        throw e;
      });
    }
    return refrescoEnCurso;
  }

  function armarSesion(r) {
    return {
      access_token: r.access_token,
      refresh_token: r.refresh_token,
      expires_at: r.expires_at || Math.floor(Date.now() / 1000) + (r.expires_in || 3600),
      email: (r.user && r.user.email) || '',
      id: (r.user && r.user.id) || ''
    };
  }

  function conToken(fn) {
    return tokenValido().then(function (t) {
      if (!t) throw new Error('Se necesita iniciar sesión para editar.');
      return fn(t);
    });
  }

  function codificarFiltro(valor) {
    return encodeURIComponent(String(valor));
  }

  var API = {
    configurado: !!(BASE && CLAVE),

    sesion: function () { return sesion; },
    autenticado: function () { return !!sesion; },

    alCambiarSesion: function (cb) {
      oyentes.push(cb);
      return function () {
        var i = oyentes.indexOf(cb);
        if (i >= 0) oyentes.splice(i, 1);
      };
    },

    entrar: function (correo, clave) {
      return pedir('/auth/v1/token?grant_type=password', {
        metodo: 'POST',
        cuerpo: { email: correo, password: clave },
        conSesion: false
      }).then(function (r) {
        guardarSesion(armarSesion(r));
        return sesion;
      });
    },

    salir: function () {
      var t = sesion && sesion.access_token;
      guardarSesion(null);
      if (!t) return Promise.resolve();
      return pedir('/auth/v1/logout', {
        metodo: 'POST',
        token: t,
        conSesion: false
      }).catch(function () { /* el token ya no importa */ });
    },

    listarRegistros: function () {
      return pedir('/rest/v1/registros?select=*&order=seccion.asc,lista.asc,orden.asc&limit=2000');
    },

    listarAjustes: function () {
      return pedir('/rest/v1/ajustes?select=*');
    },

    guardarRegistro: function (fila) {
      return conToken(function (t) {
        return pedir('/rest/v1/registros?on_conflict=id', {
          metodo: 'POST',
          token: t,
          cuerpo: fila,
          cabeceras: { Prefer: 'resolution=merge-duplicates,return=representation' }
        });
      });
    },

    borrarRegistro: function (id) {
      return conToken(function (t) {
        return pedir('/rest/v1/registros?id=eq.' + codificarFiltro(id), {
          metodo: 'DELETE',
          token: t,
          cabeceras: { Prefer: 'return=minimal' }
        });
      });
    },

    guardarAjustes: function (seccion, datos) {
      return conToken(function (t) {
        return pedir('/rest/v1/ajustes?on_conflict=seccion', {
          metodo: 'POST',
          token: t,
          cuerpo: { seccion: seccion, datos: datos },
          cabeceras: { Prefer: 'resolution=merge-duplicates,return=representation' }
        });
      });
    },

    subirPDF: function (archivo) {
      return conToken(function (t) {
        var nombre = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) + '.pdf';
        return pedir('/storage/v1/object/' + BUCKET + '/' + nombre, {
          metodo: 'POST',
          token: t,
          json: false,
          cuerpo: archivo,
          cabeceras: {
            'Content-Type': archivo.type || 'application/pdf',
            'x-upsert': 'false'
          }
        }).then(function () {
          return { ruta: nombre, url: API.urlPublica(nombre) };
        });
      });
    },

    borrarPDF: function (ruta) {
      return conToken(function (t) {
        return pedir('/storage/v1/object/' + BUCKET + '/' + ruta, {
          metodo: 'DELETE',
          token: t,
          json: false
        });
      });
    },

    urlPublica: function (ruta) {
      return BASE + '/storage/v1/object/public/' + BUCKET + '/' + ruta;
    }
  };

  window.CampoAPI = API;
}());
