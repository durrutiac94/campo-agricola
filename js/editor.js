/* Editor del sitio.
   - Botón de sesión en la cabecera.
   - Formularios para todas las listas (registros) y bloques (ajustes).
   - Acciones de editar y borrar visibles solo con sesión iniciada. */
(function () {
  'use strict';

  var C = window.Campo;
  var API = window.CampoAPI;
  var ESQUEMA = window.CAMPO_ESQUEMA || { listas: {}, ajustes: {} };
  var MANIFIESTO = window.CAMPO_MANIFIESTO || {};
  var contadorCampos = 0;
  var dialogo = null;

  function clon(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'r-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function puedeEditar() { return !!(API && API.autenticado && API.autenticado()); }

  /* --------------------------------------------------------------- Avisos */

  function toast(texto, tipo) {
    var caja = document.getElementById('avisos-editor');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'avisos-editor';
      caja.className = 'avisos-editor';
      document.body.appendChild(caja);
    }
    var aviso = document.createElement('div');
    aviso.className = 'aviso-editor ' + (tipo || 'ok');
    aviso.textContent = texto;
    caja.appendChild(aviso);
    setTimeout(function () { aviso.remove(); }, 4000);
  }

  /* ------------------------------------------------------------- Sesión -- */

  function actualizarEstado() {
    var activo = puedeEditar();
    document.documentElement.classList.toggle('editor-activo', activo);
    var btn = document.getElementById('btn-sesion');
    if (btn) {
      var s = API && API.sesion ? API.sesion() : null;
      btn.textContent = activo ? 'Salir' : 'Entrar';
      btn.title = activo ? ('Sesión iniciada como ' + (s && s.email ? s.email : 'editor')) : 'Entrar para editar';
      btn.classList.toggle('activo', activo);
    }
    var sesion = API && API.sesion ? API.sesion() : null;
    var correo = document.getElementById('sesion-correo');
    if (correo) correo.textContent = sesion && sesion.email ? sesion.email : '';
  }

  function montarSesion() {
    var cont = document.querySelector('.acciones-header');
    if (!cont) return;
    var btn = document.getElementById('btn-sesion');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'btn-sesion';
      btn.className = 'btn secundario pequeno btn-sesion';
      btn.addEventListener('click', function () {
        if (puedeEditar()) salir();
        else abrirLogin();
      });
      var menu = cont.querySelector('.btn-menu');
      if (menu) cont.insertBefore(btn, menu);
      else cont.appendChild(btn);
    }
    actualizarEstado();
  }

  function salir() {
    API.salir().then(function () {
      toast('Sesión cerrada');
      notificar();
    });
  }

  function abrirLogin() {
    var d = nuevoDialogo();
    d.innerHTML =
      '<form class="form-editor" novalidate>' +
        '<div class="cab-dialogo"><h2>Entrar</h2>' +
          '<button type="button" class="cerrar-dialogo" aria-label="Cerrar">&times;</button></div>' +
        '<div class="cuerpo-dialogo">' +
          '<p class="ayuda-dialogo">Acceso para las personas del campo. Los datos se editan en línea.</p>' +
          '<div class="campo-form"><label for="login-correo">Correo</label>' +
            '<input id="login-correo" type="email" autocomplete="username" required></div>' +
          '<div class="campo-form"><label for="login-clave">Contraseña</label>' +
            '<input id="login-clave" type="password" autocomplete="current-password" required></div>' +
          '<p class="error-form" hidden></p>' +
        '</div>' +
        '<div class="pie-dialogo">' +
          '<button type="button" class="btn secundario" data-cerrar>Cancelar</button>' +
          '<button type="submit" class="btn">Entrar</button>' +
        '</div>' +
      '</form>';
    abrir(d);

    var form = d.querySelector('form');
    var error = d.querySelector('.error-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var correo = form.querySelector('#login-correo').value.trim();
      var clave = form.querySelector('#login-clave').value;
      if (!correo || !clave) {
        mostrarError(error, 'Completa correo y contraseña.');
        return;
      }
      var boton = form.querySelector('[type="submit"]');
      boton.disabled = true;
      boton.textContent = 'Entrando...';
      API.entrar(correo, clave).then(function () {
        cerrar();
        toast('Sesión iniciada');
        notificar();
        recargar();
      }).catch(function (err) {
        boton.disabled = false;
        boton.textContent = 'Entrar';
        mostrarError(error, err && err.estado === 400 ? 'Correo o contraseña incorrectos.' : (err.message || 'No se pudo entrar.'));
      });
    });
  }

  /* -------------------------------------------------------------- Diálogo */

  function nuevoDialogo() {
    if (dialogo) dialogo.remove();
    dialogo = document.createElement('dialog');
    dialogo.className = 'dialogo-editor';
    document.body.appendChild(dialogo);
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo) cerrar();
    });
    return dialogo;
  }

  function abrir(d) {
    if (!d.open) d.showModal();
    d.querySelectorAll('[data-cerrar]').forEach(function (b) {
      b.addEventListener('click', cerrar);
    });
    var x = d.querySelector('.cerrar-dialogo');
    if (x) x.addEventListener('click', cerrar);
    var primero = d.querySelector('input, select, textarea, button');
    if (primero) setTimeout(function () { primero.focus(); }, 30);
  }

  function cerrar() {
    if (!dialogo) return;
    if (dialogo.open) dialogo.close();
    dialogo.remove();
    dialogo = null;
  }

  function mostrarError(nodo, texto) {
    if (!nodo) return;
    nodo.textContent = texto;
    nodo.hidden = false;
  }

  /* -------------------------------------------------------------- Campos -- */

  function opciones(def) {
    var o = typeof def.opciones === 'function' ? def.opciones() : (def.opciones || []);
    return o.map(function (x) {
      return '<option value="' + C.esc(x.valor) + '">' + C.esc(x.texto) + '</option>';
    }).join('');
  }

  function valorTexto(def, valor) {
    if (def.tipo === 'tags') return (valor || []).join(', ');
    if (def.tipo === 'numeros') return (valor || []).join(', ');
    if (valor == null) return '';
    return String(valor);
  }

  function control(def, valor) {
    var id = 'campo-' + (contadorCampos += 1);
    var v = valorTexto(def, valor);
    var req = def.requerido ? ' required' : '';
    var tipo = def.tipo || 'text';
    var input;
    if (tipo === 'textarea') {
      input = '<textarea id="' + id + '" name="' + C.esc(def.k) + '" rows="2"' + req + '>' + C.esc(v) + '</textarea>';
    } else if (tipo === 'select') {
      var lista = opciones(def);
      if (v && !new RegExp('value="' + v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(lista)) {
        lista = '<option value="' + C.esc(v) + '">' + C.esc(v) + ' (actual)</option>' + lista;
      }
      input = '<select id="' + id + '" name="' + C.esc(def.k) + '"' + req + '>' +
        (v ? '' : '<option value="">(sin valor)</option>') + lista + '</select>';
    } else if (tipo === 'checkbox') {
      return '<div class="campo-form campo-check">' +
        '<label><input type="checkbox" name="' + C.esc(def.k) + '"' + (valor ? ' checked' : '') + '> ' +
        C.esc(def.etiqueta) + '</label>' + (def.ayuda ? ayuda(def.ayuda) : '') + '</div>';
    } else {
      var t = tipo === 'number' ? 'number' : (tipo === 'date' ? 'date' : (tipo === 'color' ? 'color' : 'text'));
      if (def.tipoHtml) t = def.tipoHtml;
      var extra = '';
      if (def.paso) extra += ' step="' + def.paso + '"';
      input = '<input id="' + id + '" name="' + C.esc(def.k) + '" type="' + t + '" value="' + C.esc(v) + '"' +
        extra + req + '>';
      if (tipo === 'color') input = '<input id="' + id + '" name="' + C.esc(def.k) + '" type="color" value="' + C.esc(v || '#1f4d3a') + '">';
    }
    return '<div class="campo-form' + (def.ancho === 2 ? ' ancho-2' : '') + '">' +
      '<label for="' + id + '">' + C.esc(def.etiqueta) + '</label>' + input +
      (def.ayuda ? ayuda(def.ayuda) : '') + '</div>';
  }

  function ayuda(texto) {
    return '<small class="ayuda-campo">' + C.esc(texto) + '</small>';
  }

  function camposHTML(defs, datos) {
    return defs.map(function (def) {
      return control(def, leerRuta(datos, def.k));
    }).join('');
  }

  function leerRuta(obj, ruta) {
    return String(ruta).split('.').reduce(function (acc, k) {
      return acc == null ? undefined : acc[k];
    }, obj);
  }

  function escribirRuta(obj, ruta, valor) {
    var partes = String(ruta).split('.');
    var actual = obj;
    partes.slice(0, -1).forEach(function (k) {
      if (actual[k] == null || typeof actual[k] !== 'object') actual[k] = {};
      actual = actual[k];
    });
    actual[partes[partes.length - 1]] = valor;
  }

  function leerFormulario(form, defs) {
    var salida = {};
    defs.forEach(function (def) {
      var el = form.querySelector('[name="' + cssEscape(def.k) + '"]');
      if (!el) return;
      var v;
      if (def.tipo === 'checkbox') v = !!el.checked;
      else if (def.tipo === 'number') {
        v = el.value.trim() === '' ? null : Number(String(el.value).replace(',', '.'));
        if (v != null && !isFinite(v)) v = null;
      } else if (def.tipo === 'tags') {
        v = el.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      } else if (def.tipo === 'numeros') {
        v = el.value.split(/[,\s;]+/).filter(Boolean).map(function (x) {
          var n = Number(String(x).replace(',', '.'));
          return isFinite(n) ? n : 0;
        });
      } else {
        v = el.value.trim();
      }
      escribirRuta(salida, def.k, v);
    });
    return salida;
  }

  function cssEscape(texto) {
    return String(texto).replace(/["\\]/g, '\\$&');
  }

  /* -------------------------------------------------------------- Guardar */

  function notificar() {
    if (window.CampoDatos && window.CampoDatos.notificar) window.CampoDatos.notificar();
  }

  function recargar() {
    if (!window.CampoDatos || !window.CampoDatos.recargar) return Promise.resolve();
    return window.CampoDatos.recargar();
  }

  function siguienteOrden(seccion, lista) {
    var max = -1;
    itemsDe(seccion, lista).forEach(function (it) {
      if (typeof it._orden === 'number' && it._orden > max) max = it._orden;
    });
    return max + 1;
  }

  function itemsDe(seccion, lista) {
    var m = MANIFIESTO[seccion];
    if (!m) return [];
    var def = (m.listas || []).filter(function (x) { return x.nombre === lista; })[0];
    if (!def) return [];
    if (def.fuente) {
      var base = window[m.global] || {};
      return base[def.fuente] || [];
    }
    return window[def.global] || [];
  }

  function guardarFila(seccion, lista, item, valores) {
    var datos = Object.assign({}, item ? clon(item) : {}, valores);
    delete datos._id;
    delete datos._orden;
    var fila = {
      id: item && item._id ? item._id : uuid(),
      seccion: seccion,
      lista: lista,
      orden: item && typeof item._orden === 'number' ? item._orden : siguienteOrden(seccion, lista),
      datos: datos
    };
    return API.guardarRegistro(fila);
  }

  /* --------------------------------------------------------- Formularios -- */

  function abrirFormulario(seccion, lista, item) {
    if (!puedeEditar()) { abrirLogin(); return; }
    var def = ESQUEMA.listas[seccion + '/' + lista];
    if (!def) { toast('Esta lista todavía no tiene formulario.', 'error'); return; }

    var base = item ? clon(item) : {};
    var d = nuevoDialogo();
    d.innerHTML =
      '<form class="form-editor" novalidate>' +
        '<div class="cab-dialogo"><h2>' + C.esc(item ? ('Editar ' + def.titulo.toLowerCase()) : ('Nuevo: ' + def.titulo)) + '</h2>' +
          '<button type="button" class="cerrar-dialogo" aria-label="Cerrar">&times;</button></div>' +
        '<div class="cuerpo-dialogo"><div class="grilla-campos">' + camposHTML(def.campos, base) + '</div>' +
          '<p class="error-form" hidden></p></div>' +
        '<div class="pie-dialogo">' +
          '<button type="button" class="btn secundario" data-cerrar>Cancelar</button>' +
          '<button type="submit" class="btn">Guardar</button>' +
        '</div>' +
      '</form>';
    abrir(d);

    var form = d.querySelector('form');
    if (item) {
      def.campos.forEach(function (f) {
        if (!f.fijoAlEditar) return;
        var el = form.querySelector('[name="' + cssEscape(f.k) + '"]');
        if (el) { el.disabled = true; el.title = 'No se puede cambiar al editar'; }
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valores = leerFormulario(form, def.campos);
      var faltan = def.campos.filter(function (f) {
        return f.requerido && !String(leerRuta(valores, f.k) == null ? '' : leerRuta(valores, f.k)).trim();
      });
      if (faltan.length) {
        mostrarError(d.querySelector('.error-form'), 'Falta completar: ' + faltan.map(function (f) { return f.etiqueta; }).join(', ') + '.');
        return;
      }
      var boton = form.querySelector('[type="submit"]');
      boton.disabled = true;
      boton.textContent = 'Guardando...';
      guardarFila(seccion, lista, item, valores).then(function () {
        cerrar();
        toast('Guardado');
        recargar();
      }).catch(function (err) {
        boton.disabled = false;
        boton.textContent = 'Guardar';
        mostrarError(d.querySelector('.error-form'), mensajeGuardado(err));
      });
    });
  }

  function mensajeGuardado(err) {
    if (!err) return 'No se pudo guardar.';
    if (!navigator.onLine) return 'Sin conexión: no se pudo guardar. Revisa la señal e inténtalo de nuevo.';
    if (err.estado === 401) return 'La sesión venció. Vuelve a entrar.';
    return err.message || 'No se pudo guardar.';
  }

  function borrar(seccion, lista, item) {
    if (!puedeEditar() || !item) return;
    if (!item._id) { toast('Este registro inicial no se puede borrar.', 'error'); return; }
    var nombre = item.titulo || item.nombre || item.empresa || item.labor || item.concepto || 'este registro';
    var extra = '';
    if (seccion === 'calendario' && lista === 'categorias') {
      var usos = (window.DATOS_CALENDARIO && window.DATOS_CALENDARIO.eventos ? window.DATOS_CALENDARIO.eventos : []).filter(function (e) { return e.categoria === item.id; }).length;
      if (usos) extra = ' Hay ' + usos + ' evento' + (usos === 1 ? '' : 's') + ' con esta categoría: quedarán sin categoría.';
    }
    if (!window.confirm('¿Borrar ' + nombre + '?' + extra)) return;
    API.borrarRegistro(item._id).then(function () {
      toast('Borrado');
      recargar();
    }).catch(function (err) {
      toast(mensajeGuardado(err), 'error');
    });
  }

  /* -------------------------------------------------------------- Ajustes */

  function datosAjustes(seccion) {
    var m = MANIFIESTO[seccion];
    var base = m ? (window.CampoDatos ? window.CampoDatos.semilla(m.global) : null) : null;
    base = base || (m ? clon(window[m.global]) : {}) || {};
    var guardados = window.CampoDatos ? window.CampoDatos.ajustesDe(seccion) : {};
    Object.keys(guardados || {}).forEach(function (k) { base[k] = clon(guardados[k]); });
    return base;
  }

  function editarAjustes(seccion) {
    if (!puedeEditar()) { abrirLogin(); return; }
    var def = ESQUEMA.ajustes[seccion];
    if (!def) { toast('Esta ficha todavía no tiene formulario.', 'error'); return; }

    var base = datosAjustes(seccion);
    var html = (def.grupos || []).map(function (g) {
      return '<fieldset class="grupo-form"><legend>' + C.esc(g.titulo) + '</legend>' +
        '<div class="grilla-campos">' + camposHTML(g.campos, base) + '</div></fieldset>';
    }).join('');
    var planos = [];
    (def.grupos || []).forEach(function (g) { planos = planos.concat(g.campos); });

    var d = nuevoDialogo();
    d.innerHTML =
      '<form class="form-editor" novalidate>' +
        '<div class="cab-dialogo"><h2>' + C.esc(def.titulo) + '</h2>' +
          '<button type="button" class="cerrar-dialogo" aria-label="Cerrar">&times;</button></div>' +
        '<div class="cuerpo-dialogo">' + html +
          '<p class="error-form" hidden></p></div>' +
        '<div class="pie-dialogo">' +
          '<button type="button" class="btn secundario" data-cerrar>Cancelar</button>' +
          '<button type="submit" class="btn">Guardar</button>' +
        '</div>' +
      '</form>';
    abrir(d);

    var form = d.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valores = leerFormulario(form, planos);
      var nuevo = clon(base);
      planos.forEach(function (f) { escribirRuta(nuevo, f.k, leerRuta(valores, f.k)); });
      var boton = form.querySelector('[type="submit"]');
      boton.disabled = true;
      boton.textContent = 'Guardando...';
      API.guardarAjustes(seccion, nuevo).then(function () {
        cerrar();
        toast('Guardado');
        recargar();
      }).catch(function (err) {
        boton.disabled = false;
        boton.textContent = 'Guardar';
        mostrarError(d.querySelector('.error-form'), mensajeGuardado(err));
      });
    });
  }

  /* ------------------------------------------------------------- Acciones */

  function boton(texto, clase, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = clase || 'btn secundario mini';
    b.textContent = texto;
    b.addEventListener('click', fn);
    return b;
  }

  function accionesFila(seccion, lista, item) {
    if (!puedeEditar()) return null;
    var caja = document.createElement('div');
    caja.className = 'acciones-editor';
    caja.appendChild(boton('Editar', 'btn secundario mini', function () { abrirFormulario(seccion, lista, item); }));
    caja.appendChild(boton('Borrar', 'btn peligro mini', function () { borrar(seccion, lista, item); }));
    return caja;
  }

  function agregarBoton(seccion, lista, texto, contenedor) {
    if (!puedeEditar() || !contenedor) return null;
    var b = boton('+ ' + texto, 'btn pequeno btn-agregar', function () { abrirFormulario(seccion, lista); });
    b.dataset.editorOnly = '1';
    contenedor.appendChild(b);
    return b;
  }

  /* ------------------------------------------------------ Lista genérica - */

  function administrarLista(seccion, lista, titulo) {
    if (!puedeEditar()) { abrirLogin(); return; }
    var def = ESQUEMA.listas[seccion + '/' + lista];
    if (!def) { toast('Esta lista todavía no tiene formulario.', 'error'); return; }

    var d = nuevoDialogo();
    var items = itemsDe(seccion, lista);
    var filas = items.map(function (it) {
      var etiqueta = it.titulo || it.nombre || it.empresa || it.labor || it.mes || it.categoria || it.id || 'Registro';
      var detalle = it.valor || it.fecha || it.descripcion || '';
      return '<div class="fila-admin" data-id="' + C.esc(it._id || '') + '">' +
        '<span>' + C.esc(etiqueta) + (detalle ? ' <small>' + C.esc(detalle) + '</small>' : '') + '</span></div>';
    }).join('');

    d.innerHTML =
      '<div class="cab-dialogo"><h2>' + C.esc(titulo || def.titulo) + '</h2>' +
        '<button type="button" class="cerrar-dialogo" aria-label="Cerrar">&times;</button></div>' +
      '<div class="cuerpo-dialogo"><div class="lista-admin">' +
        (filas || '<p class="ayuda-dialogo">Todavía no hay registros.</p>') +
      '</div></div>' +
      '<div class="pie-dialogo">' +
        '<button type="button" class="btn secundario" data-cerrar>Cerrar</button>' +
        '<button type="button" class="btn" data-nuevo>Agregar</button>' +
      '</div>';
    abrir(d);

    d.querySelectorAll('.fila-admin').forEach(function (fila, i) {
      var item = items[i];
      var acciones = accionesFila(seccion, lista, item);
      if (acciones) fila.appendChild(acciones);
    });
    var nuevo = d.querySelector('[data-nuevo]');
    if (nuevo) nuevo.addEventListener('click', function () {
      cerrar();
      abrirFormulario(seccion, lista);
    });
  }

  /* ------------------------------------------------------------ Arranque - */

  window.CampoEditor = {
    puedeEditar: puedeEditar,
    montarSesion: montarSesion,
    abrirLogin: abrirLogin,
    abrirFormulario: abrirFormulario,
    editarAjustes: editarAjustes,
    accionesFila: accionesFila,
    agregarBoton: agregarBoton,
    administrarLista: administrarLista,
    toast: toast,
    itemsDe: itemsDe
  };

  if (API && API.alCambiarSesion) {
    API.alCambiarSesion(function () {
      actualizarEstado();
      notificar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarSesion);
  } else {
    montarSesion();
  }
}());
