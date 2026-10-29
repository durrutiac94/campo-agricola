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
  var MAX_PDF = 20 * 1024 * 1024;
  var BUCKET_DOCUMENTOS = (window.CAMPO_SUPABASE && window.CAMPO_SUPABASE.bucket) || 'documentos';

  function categoriasDocumentos() {
    var base = window.CAMPO_CATEGORIAS_DOCUMENTOS;
    if (!Array.isArray(base) || !base.length) {
      base = ['Avellanos', 'Ovejas', 'Riego', 'Maquinaria', 'General'];
    }
    return base.slice();
  }

  function opcionesCategoriasDoc(seleccionada) {
    return categoriasDocumentos().map(function (c) {
      return '<option value="' + C.esc(c) + '"' + (c === seleccionada ? ' selected' : '') + '>' +
        C.esc(c) + '</option>';
    }).join('');
  }

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
      if (e.target === dialogo && dialogo.dataset.ocupado !== '1') cerrar();
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

  function opciones(def, valor) {
    var o = typeof def.opciones === 'function' ? def.opciones() : (def.opciones || []);
    return o.map(function (x) {
      var activo = valor != null && String(x.valor) === String(valor) ? ' selected' : '';
      return '<option value="' + C.esc(x.valor) + '"' + activo + '>' + C.esc(x.texto) + '</option>';
    }).join('');
  }

  function valorTexto(def, valor) {
    if (def.tipo === 'tags') return (valor || []).join(', ');
    if (def.tipo === 'numeros') return (valor || []).join(', ');
    if (valor == null) return '';
    return String(valor);
  }

  function control(def, valor, datos) {
    var id = 'campo-' + (contadorCampos += 1);
    var v = valorTexto(def, valor);
    if (!v && def.defecto != null) v = String(def.defecto);
    var req = def.requerido ? ' required' : '';
    var tipo = def.tipo || 'text';
    var input;
    if (tipo === 'file') {
      datos = datos || {};
      var actual;
      if (v) {
        actual = /^pdfs\//.test(v)
          ? '<span class="archivo-pendiente">Pendiente de subir</span> ' + C.esc(v)
          : '<a href="' + C.esc(v) + '" target="_blank" rel="noopener">' +
            C.esc(datos.nombreArchivo || 'Ver PDF actual') + '</a>';
      } else {
        actual = '<span class="ayuda-campo">Sin archivo.</span>';
      }
      input =
        '<div class="campo-archivo">' +
          '<div class="archivo-actual">' + actual + '</div>' +
          '<input id="' + id + '" type="file" accept="application/pdf" data-archivo-file>' +
          '<input type="hidden" name="' + C.esc(def.k) + '" value="' + C.esc(v) + '">' +
          '<input type="hidden" name="ruta" value="' + C.esc(datos.ruta || '') + '">' +
          '<input type="hidden" name="nombreArchivo" value="' + C.esc(datos.nombreArchivo || '') + '">' +
          '<input type="hidden" name="tamano" value="' + C.esc(datos.tamano == null ? '' : datos.tamano) + '">' +
          '<div class="archivo-estado" data-archivo-estado></div>' +
        '</div>';
      return '<div class="campo-form' + (def.ancho === 2 ? ' ancho-2' : '') + '">' +
        '<label for="' + id + '">' + C.esc(def.etiqueta) + '</label>' + input +
        (def.ayuda ? ayuda(def.ayuda) : '') + '</div>';
    }
    if (tipo === 'textarea') {
      input = '<textarea id="' + id + '" name="' + C.esc(def.k) + '" rows="2"' + req + '>' + C.esc(v) + '</textarea>';
    } else if (tipo === 'select') {
      var lista = opciones(def, v);
      if (v && !new RegExp('value="' + v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(lista)) {
        lista = '<option value="' + C.esc(v) + '" selected>' + C.esc(v) + ' (actual)</option>' + lista;
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
      return control(def, leerRuta(datos, def.k), datos);
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
    ['ruta', 'nombreArchivo', 'tamano'].forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (!el) return;
      var v = el.value.trim();
      escribirRuta(salida, k, k === 'tamano' && v !== '' ? Number(v) : (v || null));
    });
    return salida;
  }

  function cssEscape(texto) {
    return String(texto).replace(/["\\]/g, '\\$&');
  }

  function archivoDeFormulario(form) {
    var el = form.querySelector('[data-archivo-file]');
    return el && el.files && el.files[0] ? el.files[0] : null;
  }

  function errorArchivo(archivo) {
    if (!archivo) return '';
    if (!/\.pdf$/i.test(archivo.name) || (archivo.type && archivo.type !== 'application/pdf')) {
      return 'Selecciona un archivo PDF.';
    }
    if (archivo.size > MAX_PDF) return 'El PDF no puede superar los 20 MB.';
    return '';
  }

  function tamanoLegible(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function estadoArchivo(nodo, archivo) {
    if (!nodo) return;
    var error = errorArchivo(archivo);
    nodo.textContent = error || (archivo ? archivo.name + ' · ' + tamanoLegible(archivo.size) : '');
    nodo.classList.toggle('error', !!error);
  }

  function rutaDeArchivo(item) {
    if (!item) return '';
    if (item.ruta) return item.ruta;
    var marca = '/storage/v1/object/public/' + BUCKET_DOCUMENTOS + '/';
    var url = String(item.archivo || '');
    var i = url.indexOf(marca);
    if (i < 0) return '';
    try { return decodeURIComponent(url.slice(i + marca.length)); }
    catch (e) { return url.slice(i + marca.length); }
  }

  function sesionVencida() {
    cerrar();
    API.salir().then(function () {
      toast('La sesión venció. Vuelve a entrar.', 'error');
      abrirLogin();
    });
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

  function guardarFila(seccion, lista, item, valores, orden) {
    var datos = Object.assign({}, item ? clon(item) : {}, valores);
    delete datos._id;
    delete datos._orden;
    var fila = {
      id: item && item._id ? item._id : uuid(),
      seccion: seccion,
      lista: lista,
      orden: item && typeof item._orden === 'number'
        ? item._orden
        : (typeof orden === 'number' ? orden : siguienteOrden(seccion, lista)),
      datos: datos
    };
    return API.guardarRegistro(fila).then(function (respuesta) {
      return { id: fila.id, fila: fila, respuesta: respuesta };
    });
  }

  /* -------------------------------------------------- Gasto desde labor -- */

  function gastosDeLabor(laborId) {
    return (window.DATOS_GASTOS || []).filter(function (g) {
      return g && g.origen === 'labor' && g.origenId === laborId;
    });
  }

  function datosGastoDeLabor(laborId, valores) {
    var fecha = String(valores.fecha || '');
    var mes = /^\d{4}-\d{2}/.test(fecha) ? Number(fecha.slice(5, 7)) - 1 : 0;
    return {
      fecha: fecha,
      mes: mes,
      tipo: 'gasto',
      categoria: valores.categoria || 'otro',
      concepto: valores.labor || 'Labor',
      monto: Number(valores.costo) || 0,
      formaPago: '',
      proveedor: '',
      origen: 'labor',
      origenId: laborId
    };
  }

  function sincronizarGastoLabor(item, valores, laborId) {
    var vinculados = gastosDeLabor(laborId);
    var monto = Number(valores.costo) || 0;
    var datos = datosGastoDeLabor(laborId, valores);

    if (!monto) {
      return Promise.all(vinculados.map(function (g) {
        return API.borrarRegistro(g._id);
      }));
    }

    if (vinculados.length) {
      var actual = vinculados[0];
      var actualizados = Object.assign({}, clon(actual), datos);
      delete actualizados._id;
      delete actualizados._orden;
      var tareas = [API.guardarRegistro({
        id: actual._id,
        seccion: 'bitacora',
        lista: 'gastos',
        orden: typeof actual._orden === 'number' ? actual._orden : siguienteOrden('bitacora', 'gastos'),
        datos: actualizados
      })];
      vinculados.slice(1).forEach(function (extra) {
        tareas.push(API.borrarRegistro(extra._id));
      });
      return Promise.all(tareas);
    }

    return API.guardarRegistro({
      id: uuid(),
      seccion: 'bitacora',
      lista: 'gastos',
      orden: siguienteOrden('bitacora', 'gastos'),
      datos: datos
    });
  }

  /* --------------------------------------------------------- Formularios -- */

  function abrirFormulario(seccion, lista, item, valoresIniciales) {
    if (!puedeEditar()) { abrirLogin(); return; }
    var def = ESQUEMA.listas[seccion + '/' + lista];
    if (!def) { toast('Esta lista todavía no tiene formulario.', 'error'); return; }

    var base = item ? clon(item) : clon(valoresIniciales || {});
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
    var entradaArchivo = form.querySelector('[data-archivo-file]');
    if (entradaArchivo) {
      entradaArchivo.addEventListener('change', function () {
        var archivo = archivoDeFormulario(form);
        estadoArchivo(form.querySelector('[data-archivo-estado]'), archivo);
        if (archivo && errorArchivo(archivo)) entradaArchivo.value = '';
        var error = d.querySelector('.error-form');
        if (error) error.hidden = true;
      });
    }
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
      var esLabor = seccion === 'bitacora' && lista === 'labores';
      if (esLabor && !item) valores.sincronizaGasto = true;
      var archivo = archivoDeFormulario(form);
      var error = d.querySelector('.error-form');
      var problemaArchivo = errorArchivo(archivo);
      if (problemaArchivo) {
        mostrarError(error, problemaArchivo);
        return;
      }
      var faltan = def.campos.filter(function (f) {
        if (f.tipo === 'file') return false;
        return f.requerido && !String(leerRuta(valores, f.k) == null ? '' : leerRuta(valores, f.k)).trim();
      });
      if (faltan.length) {
        mostrarError(error, 'Falta completar: ' + faltan.map(function (f) { return f.etiqueta; }).join(', ') + '.');
        return;
      }
      var requiereArchivo = def.campos.some(function (f) { return f.tipo === 'file' && f.requerido; });
      if (requiereArchivo && !String(valores.archivo || '').trim() && !archivo) {
        mostrarError(error, 'Selecciona un PDF.');
        return;
      }
      var boton = form.querySelector('[type="submit"]');
      var rutaAnterior = rutaDeArchivo(item) || valores.ruta || '';
      var subida = null;
      var avisoGasto = '';
      boton.disabled = true;
      boton.textContent = archivo ? 'Subiendo PDF...' : 'Guardando...';
      var tarea = Promise.resolve();
      if (archivo) {
        tarea = API.subirPDF(archivo).then(function (res) {
          subida = res;
          valores.archivo = res.url;
          valores.ruta = res.ruta;
          valores.nombreArchivo = archivo.name;
          valores.tamano = archivo.size;
          boton.textContent = 'Guardando...';
        });
      }
      tarea.then(function () {
        return guardarFila(seccion, lista, item, valores);
      }).then(function (resultado) {
        if (esLabor && (!item || item.sincronizaGasto)) {
          return sincronizarGastoLabor(item, valores, resultado.id).catch(function (err) {
            if (esErrorSesion(err)) throw err;
            avisoGasto = 'Labor guardada, pero no se pudo actualizar Gastos.';
          });
        }
      }).then(function () {
        if (subida && rutaAnterior && rutaAnterior !== subida.ruta) {
          API.borrarPDF(rutaAnterior).catch(function () {
            toast('Guardado, pero no se pudo borrar el PDF anterior.', 'error');
          });
        }
        cerrar();
        toast(avisoGasto || 'Guardado', avisoGasto ? 'error' : 'ok');
        recargar();
      }).catch(function (err) {
        if (subida) API.borrarPDF(subida.ruta).catch(function () {});
        if (esErrorSesion(err)) { sesionVencida(); return; }
        boton.disabled = false;
        boton.textContent = 'Guardar';
        mostrarError(error, mensajeGuardado(err));
      });
    });
  }

  function abrirCargaDocumentos(seccion, lista) {
    if (!puedeEditar()) { abrirLogin(); return; }
    if (!ESQUEMA.listas[seccion + '/' + lista]) {
      toast('Esta lista todavía no tiene formulario.', 'error');
      return;
    }

    var d = nuevoDialogo();
    var categoriaLote = 'General';
    var archivos = [];
    var enviando = false;

    d.innerHTML =
      '<form class="form-editor" novalidate>' +
        '<div class="cab-dialogo"><h2>Subir varios PDFs</h2>' +
          '<button type="button" class="cerrar-dialogo" aria-label="Cerrar">&times;</button></div>' +
        '<div class="cuerpo-dialogo">' +
          '<div class="campo-form">' +
            '<label for="lote-archivos">Archivos PDF</label>' +
            '<input id="lote-archivos" type="file" accept="application/pdf" multiple data-lote-archivos>' +
            '<small class="ayuda-campo">Hasta 20 PDFs, máximo 20 MB por archivo.</small>' +
          '</div>' +
          '<div class="grilla-campos">' +
            '<div class="campo-form"><label for="lote-categoria">Categoría del lote</label>' +
              '<select id="lote-categoria" data-lote-categoria>' + opcionesCategoriasDoc(categoriaLote) + '</select></div>' +
            '<div class="campo-form"><label for="lote-fecha">Fecha</label>' +
              '<input id="lote-fecha" type="date" data-lote-fecha></div>' +
            '<div class="campo-form ancho-2"><label for="lote-tags">Etiquetas</label>' +
              '<input id="lote-tags" type="text" placeholder="Separadas por coma" data-lote-tags>' +
              '<small class="ayuda-campo">Se aplican a todos los PDFs del lote.</small></div>' +
          '</div>' +
          '<div class="lote-lista" data-lote-lista></div>' +
          '<p class="ayuda-campo" data-lote-resumen></p>' +
          '<p class="error-form" hidden></p>' +
        '</div>' +
        '<div class="pie-dialogo">' +
          '<button type="button" class="btn secundario" data-cerrar>Cancelar</button>' +
          '<button type="submit" class="btn">Subir y guardar</button>' +
        '</div>' +
      '</form>';
    abrir(d);
    d.addEventListener('cancel', function (e) {
      if (enviando) e.preventDefault();
    });

    var form = d.querySelector('form');
    var entrada = form.querySelector('[data-lote-archivos]');
    var selCategoria = form.querySelector('[data-lote-categoria]');
    var fecha = form.querySelector('[data-lote-fecha]');
    var tags = form.querySelector('[data-lote-tags]');
    var listaNodos = form.querySelector('[data-lote-lista]');
    var resumen = form.querySelector('[data-lote-resumen]');
    var error = form.querySelector('.error-form');
    var boton = form.querySelector('[type="submit"]');

    function parseTags(texto) {
      return String(texto || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    }

    function tituloDesde(file) {
      var nombre = String(file.name || '').replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim();
      return nombre || 'Documento';
    }

    function nuevoArchivo(file) {
      return {
        file: file,
        titulo: tituloDesde(file),
        categoria: categoriaLote,
        categoriaPropia: false,
        estado: '',
        error: '',
        nodo: null
      };
    }

    function problemaArchivo(a) {
      return errorArchivo(a.file) ||
        (!String(a.titulo || '').trim() ? 'Falta el título.' : '') ||
        (!a.categoria ? 'Falta la categoría.' : '');
    }

    function limpiarErrorEditable(a) {
      if (a.estado !== 'error' || errorArchivo(a.file)) return;
      a.estado = '';
      a.error = '';
      actualizarEstado(a);
      actualizarResumen();
    }

    function estadoTexto(a) {
      if (a.estado === 'ok') return 'Guardado';
      if (a.estado === 'subiendo') return 'Subiendo...';
      if (a.estado === 'error') return a.error || 'Error';
      return 'Pendiente';
    }

    function actualizarEstado(a) {
      if (!a.nodo) return;
      var estado = a.nodo.querySelector('[data-lote-estado]');
      if (estado) {
        estado.textContent = estadoTexto(a);
        estado.className = 'lote-estado' + (a.estado ? ' ' + a.estado : '');
      }
      a.nodo.classList.toggle('ok', a.estado === 'ok');
      a.nodo.classList.toggle('error', a.estado === 'error');
      var bloquear = enviando || a.estado === 'ok';
      a.nodo.querySelectorAll('input, select, button').forEach(function (el) {
        el.disabled = bloquear;
      });
    }

    function actualizarResumen() {
      var validos = archivos.filter(function (a) { return !errorArchivo(a.file); }).length;
      var ok = archivos.filter(function (a) { return a.estado === 'ok'; }).length;
      var errores = archivos.filter(function (a) { return a.estado === 'error'; }).length;
      var partes = [];
      if (!archivos.length) {
        partes.push('Selecciona uno o más PDFs.');
      } else {
        partes.push(archivos.length + ' archivo' + (archivos.length === 1 ? '' : 's'));
        if (validos !== archivos.length) partes.push((archivos.length - validos) + ' con error');
        if (ok) partes.push(ok + ' guardado' + (ok === 1 ? '' : 's'));
        if (errores) partes.push(errores + ' con error de subida');
      }
      resumen.textContent = partes.join(' · ');
    }

    function filaHTML(a, i) {
      return '<div class="lote-fila" data-lote-fila="' + i + '">' +
        '<div class="lote-datos">' +
          '<div class="campo-form"><label>Título</label>' +
            '<input type="text" data-lote-titulo value="' + C.esc(a.titulo) + '"></div>' +
          '<div class="campo-form"><label>Categoría</label>' +
            '<select data-lote-cat>' + opcionesCategoriasDoc(a.categoria) + '</select></div>' +
          '<div class="lote-archivo">' + C.esc(a.file.name) + ' · ' + tamanoLegible(a.file.size) + '</div>' +
        '</div>' +
        '<div class="lote-acciones">' +
          '<span class="lote-estado" data-lote-estado>' + C.esc(estadoTexto(a)) + '</span>' +
          '<button type="button" class="btn peligro mini" data-lote-quitar>Quitar</button>' +
        '</div>' +
      '</div>';
    }

    function pintar() {
      listaNodos.innerHTML = archivos.map(filaHTML).join('');
      archivos.forEach(function (a, i) {
        a.nodo = listaNodos.querySelector('[data-lote-fila="' + i + '"]');
        if (!a.nodo) return;
        a.nodo.querySelector('[data-lote-titulo]').addEventListener('input', function (e) {
          a.titulo = e.target.value;
          limpiarErrorEditable(a);
        });
        a.nodo.querySelector('[data-lote-cat]').addEventListener('change', function (e) {
          a.categoria = e.target.value;
          a.categoriaPropia = true;
          limpiarErrorEditable(a);
        });
        a.nodo.querySelector('[data-lote-quitar]').addEventListener('click', function () {
          if (enviando) return;
          archivos.splice(i, 1);
          pintar();
        });
        actualizarEstado(a);
      });
      actualizarResumen();
    }

    function bloquearControles(bloquear) {
      entrada.disabled = bloquear;
      selCategoria.disabled = bloquear;
      fecha.disabled = bloquear;
      tags.disabled = bloquear;
      form.querySelectorAll('[data-cerrar], .cerrar-dialogo').forEach(function (b) {
        b.disabled = bloquear;
      });
    }

    actualizarResumen();

    entrada.addEventListener('change', function () {
      if (enviando) return;
      var seleccionados = Array.prototype.slice.call(entrada.files || []);
      error.hidden = true;
      if (seleccionados.length > 20) {
        entrada.value = '';
        mostrarError(error, 'Puedes subir hasta 20 PDFs por lote.');
        return;
      }
      archivos = seleccionados.map(function (file) {
        var a = nuevoArchivo(file);
        var problema = errorArchivo(file);
        if (problema) {
          a.estado = 'error';
          a.error = problema;
        }
        return a;
      });
      pintar();
    });

    selCategoria.addEventListener('change', function () {
      categoriaLote = selCategoria.value;
      archivos.forEach(function (a) {
        if (!a.categoriaPropia && a.estado !== 'ok') a.categoria = categoriaLote;
      });
      pintar();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (enviando) return;
      if (!archivos.length) {
        mostrarError(error, 'Selecciona al menos un PDF.');
        return;
      }
      var pendientes = archivos.filter(function (a) { return a.estado !== 'ok'; });
      if (!pendientes.length) {
        cerrar();
        return;
      }
      var validos = [];
      pendientes.forEach(function (a) {
        var problema = problemaArchivo(a);
        if (problema) {
          a.estado = 'error';
          a.error = problema;
          actualizarEstado(a);
        } else {
          validos.push(a);
        }
      });
      actualizarResumen();
      if (!validos.length) {
        mostrarError(error, 'Corrige o quita los archivos marcados antes de subir.');
        return;
      }

      error.hidden = true;
      enviando = true;
      d.dataset.ocupado = '1';
      boton.disabled = true;
      boton.textContent = 'Subiendo...';
      bloquearControles(true);
      archivos.forEach(actualizarEstado);

      var fechaValor = fecha.value || '';
      var tagsValor = parseTags(tags.value);
      var ordenBase = siguienteOrden(seccion, lista);
      var i = 0;

      function siguiente() {
        while (i < archivos.length) {
          var actual = archivos[i];
          if (actual.estado === 'ok') { i += 1; continue; }
          var problema = problemaArchivo(actual);
          if (problema) {
            actual.estado = 'error';
            actual.error = problema;
            actualizarEstado(actual);
            actualizarResumen();
            i += 1;
            continue;
          }
          break;
        }
        if (i >= archivos.length) return Promise.resolve();
        var a = archivos[i];
        var posicion = i;
        a.estado = 'subiendo';
        a.error = '';
        actualizarEstado(a);
        actualizarResumen();
        boton.textContent = 'Subiendo ' + (i + 1) + ' de ' + archivos.length + '...';

        return API.subirPDF(a.file).then(function (res) {
          var valores = {
            titulo: String(a.titulo || '').trim(),
            archivo: res.url,
            ruta: res.ruta,
            nombreArchivo: a.file.name,
            tamano: a.file.size,
            seccion: a.categoria,
            fecha: fechaValor,
            tags: tagsValor,
            descripcion: ''
          };
          return guardarFila(seccion, lista, null, valores, ordenBase + posicion).then(function () {
            a.estado = 'ok';
            actualizarEstado(a);
            actualizarResumen();
          }, function (err) {
            return API.borrarPDF(res.ruta).catch(function () {}).then(function () { throw err; });
          });
        }).then(function () {
          i += 1;
          return siguiente();
        }, function (err) {
          if (esErrorSesion(err)) {
            a.estado = 'error';
            a.error = 'La sesión venció.';
            actualizarEstado(a);
            actualizarResumen();
            throw err;
          }
          a.estado = 'error';
          a.error = mensajeGuardado(err);
          actualizarEstado(a);
          actualizarResumen();
          i += 1;
          return siguiente();
        });
      }

      siguiente().then(function () {
        enviando = false;
        delete d.dataset.ocupado;
        archivos.forEach(actualizarEstado);
        var errores = archivos.filter(function (a) { return a.estado === 'error'; }).length;
        if (errores) {
          boton.disabled = false;
          boton.textContent = 'Reintentar fallidos';
          bloquearControles(false);
          mostrarError(error, errores + ' archivo' + (errores === 1 ? '' : 's') +
            ' no se ' + (errores === 1 ? 'pudo' : 'pudieron') + ' guardar. Revisa y reintenta.');
          actualizarResumen();
          recargar();
        } else {
          var total = archivos.length;
          cerrar();
          toast(total + ' documento' + (total === 1 ? '' : 's') + ' guardado' + (total === 1 ? '' : 's'));
          recargar();
        }
      }).catch(function (err) {
        enviando = false;
        delete d.dataset.ocupado;
        archivos.forEach(actualizarEstado);
        if (esErrorSesion(err)) { sesionVencida(); return; }
        boton.disabled = false;
        boton.textContent = 'Reintentar fallidos';
        bloquearControles(false);
        mostrarError(error, mensajeGuardado(err));
        actualizarResumen();
        recargar();
      });
    });
  }

  function esErrorSesion(err) {
    if (!err) return false;
    if (err.estado === 401 || err.codigo === 401) return true;
    var cuerpo = err.cuerpo || {};
    var texto = String(cuerpo.message || cuerpo.error || err.message || '');
    return err.codigo === 403 && /jwt|jws|token|unauthorized|sesión|session/i.test(texto);
  }

  function mensajeGuardado(err) {
    if (!err) return 'No se pudo guardar.';
    if (!navigator.onLine) return 'Sin conexión: no se pudo guardar. Revisa la señal e inténtalo de nuevo.';
    if (esErrorSesion(err)) return 'La sesión venció. Vuelve a entrar.';
    return err.message || 'No se pudo guardar.';
  }

  function borrar(seccion, lista, item) {
    if (!puedeEditar() || !item) return;
    if (!item._id) { toast('Este registro inicial no se puede borrar.', 'error'); return; }
    var nombre = item.titulo || item.nombre || item.empresa || item.labor || item.concepto || 'este registro';
    var extra = '';
    var rutaPDF = rutaDeArchivo(item);
    var esLabor = seccion === 'bitacora' && lista === 'labores';
    var gastos = esLabor && item.sincronizaGasto ? gastosDeLabor(item._id) : [];
    if (rutaPDF) extra += ' También se borrará el PDF.';
    if (gastos.length) extra += ' También se borrará el gasto asociado.';
    if (seccion === 'calendario' && lista === 'categorias') {
      var usos = (window.DATOS_CALENDARIO && window.DATOS_CALENDARIO.eventos ? window.DATOS_CALENDARIO.eventos : []).filter(function (e) { return e.categoria === item.id; }).length;
      if (usos) extra = ' Hay ' + usos + ' evento' + (usos === 1 ? '' : 's') + ' con esta categoría: quedarán sin categoría.';
    }
    if (!window.confirm('¿Borrar ' + nombre + '?' + extra)) return;
    API.borrarRegistro(item._id).then(function () {
      var avisos = '';
      var limpieza = rutaPDF
        ? API.borrarPDF(rutaPDF).catch(function () { avisos += ' El PDF no se pudo borrar.'; })
        : Promise.resolve();
      var limpiezaGastos = Promise.all(gastos.map(function (g) {
        return API.borrarRegistro(g._id).catch(function () {
          avisos += ' El gasto asociado no se pudo borrar.';
        });
      }));
      return Promise.all([limpieza, limpiezaGastos]).then(function () {
        toast('Borrado' + avisos, avisos ? 'error' : 'ok');
        return recargar();
      });
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
    if (seccion === 'bitacora' && lista === 'gastos' && item && item.origen === 'labor') {
      var labor = (window.DATOS_LABORES || []).filter(function (l) {
        return l && l._id === item.origenId;
      })[0];
      if (!labor) return null;
      var cajaLabor = document.createElement('div');
      cajaLabor.className = 'acciones-editor';
      cajaLabor.appendChild(boton('Editar labor', 'btn secundario mini', function () {
        abrirFormulario('bitacora', 'labores', labor);
      }));
      return cajaLabor;
    }
    var caja = document.createElement('div');
    caja.className = 'acciones-editor';
    caja.appendChild(boton('Editar', 'btn secundario mini', function () { abrirFormulario(seccion, lista, item); }));
    caja.appendChild(boton('Borrar', 'btn peligro mini', function () { borrar(seccion, lista, item); }));
    return caja;
  }

  function agregarBoton(seccion, lista, texto, contenedor, valoresIniciales) {
    if (!puedeEditar() || !contenedor) return null;
    var b = boton('+ ' + texto, 'btn pequeno btn-agregar', function () {
      abrirFormulario(seccion, lista, null, valoresIniciales);
    });
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
    abrirCargaDocumentos: abrirCargaDocumentos,
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
