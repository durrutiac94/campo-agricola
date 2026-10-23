/* Esquema de los formularios del editor.
   Cada lista define sus campos en el orden en que se piden.
   Tipos: text, textarea, number, date, select, checkbox, color, tags, numeros, file. */
(function () {
  'use strict';

  function C(k, etiqueta, tipo, extra) {
    return Object.assign({ k: k, etiqueta: etiqueta, tipo: tipo || 'text' }, extra || {});
  }
  function N(k, etiqueta, extra) { return C(k, etiqueta, 'number', extra); }
  function T(k, etiqueta, extra) { return C(k, etiqueta, 'textarea', extra); }
  function F(k, etiqueta) { return C(k, etiqueta, 'date'); }
  function S(k, etiqueta, opciones, extra) {
    return C(k, etiqueta, 'select', Object.assign({ opciones: opciones }, extra || {}));
  }

  function opcionesCategorias() {
    var cal = window.DATOS_CALENDARIO || {};
    return (cal.categorias || []).map(function (c) {
      return { valor: c.id, texto: c.nombre };
    });
  }

  function opcionesSectores() {
    var r = window.DATOS_RIEGO || {};
    return [{ valor: '', texto: '(sin sector)' }].concat((r.sectores || []).map(function (s) {
      return { valor: s.nombre, texto: s.nombre };
    }));
  }

  var CATEGORIAS_DOCUMENTOS = ['Avellanos', 'Ovejas', 'Riego', 'Maquinaria', 'General'];

  function opcionesCategoriasDocumentos() {
    return CATEGORIAS_DOCUMENTOS.map(function (c) {
      return { valor: c, texto: c };
    });
  }

  var DOCS = [
    C('titulo', 'Título', 'text', { requerido: true, ancho: 2 }),
    C('archivo', 'Archivo PDF', 'file', { requerido: true, ancho: 2, ayuda: 'Solo PDF, hasta 20 MB. Se guarda en Supabase Storage.' }),
    T('descripcion', 'Descripción'),
    F('fecha', 'Fecha'),
    S('seccion', 'Sección', opcionesCategoriasDocumentos, { requerido: true, defecto: 'General' }),
    C('tags', 'Etiquetas', 'tags', { ayuda: 'Separadas por coma.' })
  ];

  window.CAMPO_CATEGORIAS_DOCUMENTOS = CATEGORIAS_DOCUMENTOS.slice();

  window.CAMPO_ESQUEMA = {
    listas: {
      /* ------------------------------------------------------------- Campo */
      'campo/kpis': {
        titulo: 'Indicadores de portada',
        campos: [C('valor', 'Valor', 'text', { requerido: true }), C('unidad', 'Unidad'), C('etiqueta', 'Etiqueta', 'text', { requerido: true })]
      },
      'campo/hitos': {
        titulo: 'Hitos del año',
        campos: [F('fecha', 'Fecha'), C('titulo', 'Título', 'text', { requerido: true }), C('tipo', 'Tipo')]
      },

      /* --------------------------------------------------------- Avellanos */
      'avellanos/variedades': {
        titulo: 'Variedades',
        campos: [
          C('nombre', 'Variedad', 'text', { requerido: true }),
          N('superficie', 'Superficie (ha)', { paso: 0.1 }),
          C('plantacion', 'Año de plantación'),
          C('polinizador', 'Polinizador'),
          C('floracion', 'Floración'),
          N('rendimiento', 'Rendimiento (kg/ha)'),
          T('nota', 'Notas')
        ]
      },
      'avellanos/fases': {
        titulo: 'Fases fenológicas',
        campos: [C('fase', 'Fase', 'text', { requerido: true }), C('mes', 'Mes'), T('detalle', 'Detalle')]
      },
      'avellanos/labores': {
        titulo: 'Labores del año',
        campos: [C('periodo', 'Periodo'), C('labor', 'Labor', 'text', { requerido: true }), C('momento', 'Momento'), C('responsable', 'Responsable'), T('detalle', 'Detalle')]
      },
      'avellanos/plagas': {
        titulo: 'Plagas y enfermedades',
        campos: [C('nombre', 'Nombre', 'text', { requerido: true }), C('tipo', 'Tipo'), C('gravedad', 'Gravedad'), T('detalle', 'Detalle'), T('control', 'Control')]
      },
      'avellanos/climaRequisitos': {
        titulo: 'Requisitos climáticos',
        campos: [C('parametro', 'Parámetro', 'text', { requerido: true }), C('requerimiento', 'Requerimiento'), C('estado', 'Estado'), T('nota', 'Nota')]
      },
      'avellanos/produccion': {
        titulo: 'Producción por temporada',
        campos: [C('temporada', 'Temporada', 'text', { requerido: true }), N('hectareas', 'Hectáreas'), N('rendimiento', 'Rendimiento (kg/ha)'), N('produccion', 'Producción (kg)'), N('precio', 'Precio ($/kg)'), N('ingreso', 'Ingreso ($)')]
      },
      'avellanos/documentos': { titulo: 'Documentos de avellanos', campos: DOCS },

      /* ------------------------------------------------------------ Ovejas */
      'ovejas/composicion': {
        titulo: 'Composición del rebaño',
        campos: [C('categoria', 'Categoría', 'text', { requerido: true }), N('cantidad', 'Cantidad'), N('peso', 'Peso (kg)'), T('nota', 'Nota')]
      },
      'ovejas/manejoSanitario': {
        titulo: 'Manejo sanitario',
        campos: [C('mes', 'Mes'), C('tarea', 'Tarea', 'text', { requerido: true }), C('producto', 'Producto'), C('dosis', 'Dosis'), C('responsable', 'Responsable')]
      },
      'ovejas/pastoreo': {
        titulo: 'Plan de pastoreo',
        campos: [C('periodo', 'Periodo'), C('destino', 'Destino'), C('carga', 'Carga'), T('nota', 'Nota')]
      },
      'ovejas/produccion': {
        titulo: 'Producción del rebaño',
        campos: [C('temporada', 'Temporada', 'text', { requerido: true }), N('corderos', 'Corderos'), N('tasaNacimiento', 'Tasa de nacimiento', { paso: 0.01 }), N('pesoDestete', 'Peso al destete (kg)'), N('venta', 'Vendidos'), N('precio', 'Precio ($)')]
      },
      'ovejas/indicadores': {
        titulo: 'Indicadores de manejo',
        campos: [C('nombre', 'Indicador', 'text', { requerido: true }), C('valor', 'Valor'), C('meta', 'Meta'), C('estado', 'Estado')]
      },
      'ovejas/documentos': { titulo: 'Documentos de ovejas', campos: DOCS },

      /* ------------------------------------------------------------- Riego */
      'riego/sectores': {
        titulo: 'Sectores de riego',
        campos: [
          C('nombre', 'Sector', 'text', { requerido: true }),
          N('superficie', 'Superficie (ha)', { paso: 0.1 }),
          C('operativo', 'Con riego', 'checkbox'),
          N('lineas', 'Líneas'),
          N('caudal', 'Caudal (m³/h)', { paso: 0.1 }),
          C('programacion', 'Programación'),
          T('notas', 'Notas')
        ]
      },
      'riego/balance': {
        titulo: 'Balance hídrico mensual',
        campos: [C('mes', 'Mes', 'text', { requerido: true }), N('etc', 'ETc (mm)', { paso: 0.1 }), N('lluvia', 'Lluvia (mm)'), N('neto', 'Neto (mm)'), N('volumen', 'Volumen (m³)')]
      },
      'riego/mantenimiento': {
        titulo: 'Mantenimiento programado',
        campos: [C('tarea', 'Tarea', 'text', { requerido: true }), C('frecuencia', 'Frecuencia'), F('ultimo', 'Última ejecución')]
      },
      'riego/registros': {
        titulo: 'Registros de riego',
        campos: [F('fecha', 'Fecha'), S('sector', 'Sector', opcionesSectores), N('horas', 'Horas', { paso: 0.1 }), N('volumen', 'Volumen (m³)'), N('caudal', 'Caudal (m³/h)', { paso: 0.1 }), C('operario', 'Operario')]
      },

      /* --------------------------------------------------------- Maquinaria */
      'maquinaria/implementos': {
        titulo: 'Implementos',
        campos: [C('nombre', 'Nombre', 'text', { requerido: true }), C('marca', 'Marca'), C('modelo', 'Modelo'), C('año', 'Año'), C('estado', 'Estado'), N('horasUso', 'Horas de uso'), C('ubicacion', 'Ubicación'), C('uso', 'Uso'), C('revision', 'Revisión')]
      },
      'maquinaria/herramientas': {
        titulo: 'Herramientas',
        campos: [C('nombre', 'Nombre', 'text', { requerido: true }), N('cantidad', 'Cantidad'), C('estado', 'Estado'), C('uso', 'Uso')]
      },
      'maquinaria/combustible': {
        titulo: 'Consumo de combustible',
        campos: [C('mes', 'Mes', 'text', { requerido: true }), N('litros', 'Litros', { paso: 0.1 }), N('costo', 'Costo ($)'), T('observacion', 'Observación')]
      },
      'maquinaria/mantenimiento': {
        titulo: 'Mantenimiento realizado',
        campos: [F('fecha', 'Fecha'), C('equipo', 'Equipo'), C('tipo', 'Tipo'), T('trabajo', 'Trabajo'), N('costo', 'Costo ($)'), C('responsable', 'Responsable')]
      },
      'maquinaria/documentos': { titulo: 'Documentos de maquinaria', campos: DOCS },

      /* --------------------------------------------------------- Calendario */
      'calendario/eventos': {
        titulo: 'Evento del calendario',
        campos: [
          F('fecha', 'Fecha', { requerido: true }),
          C('titulo', 'Título', 'text', { requerido: true, ancho: 2 }),
          S('categoria', 'Categoría', opcionesCategorias),
          C('tipo', 'Tipo'),
          T('descripcion', 'Descripción', { ancho: 2 }),
          C('responsable', 'Responsable')
        ]
      },
      'calendario/categorias': {
        titulo: 'Categoría',
        campos: [C('id', 'Identificador', 'text', { requerido: true, fijoAlEditar: true, ayuda: 'Sin espacios, por ejemplo: cosecha. No se puede cambiar después de crear la categoría.' }), C('nombre', 'Nombre', 'text', { requerido: true }), C('color', 'Color', 'color')]
      },

      /* ----------------------------------------------------------- Bitácora */
      'bitacora/labores': {
        titulo: 'Labor realizada',
        campos: [F('fecha', 'Fecha', { requerido: true }), C('categoria', 'Categoría'), C('labor', 'Labor', 'text', { requerido: true }), C('sector', 'Sector'), N('hectareas', 'Hectáreas', { paso: 0.1 }), N('horas', 'Horas', { paso: 0.1 }), N('personas', 'Personas'), N('costo', 'Costo ($)'), T('observacion', 'Observación')]
      },
      'bitacora/gastos': {
        titulo: 'Movimiento de gastos',
        campos: [F('fecha', 'Fecha', { requerido: true }), S('tipo', 'Tipo', [{ valor: 'gasto', texto: 'Gasto' }, { valor: 'ingreso', texto: 'Ingreso' }]), C('categoria', 'Categoría'), C('concepto', 'Concepto', 'text', { requerido: true }), N('monto', 'Monto ($)'), C('formaPago', 'Forma de pago'), C('proveedor', 'Proveedor')]
      },

      /* ---------------------------------------------------------- Documentos */
      'documentos/documentos': { titulo: 'Documento', campos: DOCS },

      /* ----------------------------------------------------------- Contactos */
      'contactos/contactos': {
        titulo: 'Contacto',
        campos: [C('categoria', 'Categoría'), C('empresa', 'Empresa', 'text', { requerido: true }), C('nombre', 'Nombre'), C('especialidad', 'Especialidad'), C('telefono', 'Teléfono'), C('email', 'Correo', 'text', { tipoHtml: 'email' }), C('direccion', 'Dirección'), T('notas', 'Notas')]
      }
    },

    /* ---------------------------------------------------------------------
       Bloques escalares (tabla ajustes). k es la ruta dentro del objeto.
       --------------------------------------------------------------------- */
    ajustes: {
      campo: {
        titulo: 'Datos del campo',
        grupos: [
          {
            titulo: 'Identificación',
            campos: [
              C('nombre', 'Nombre', 'text', { requerido: true, ancho: 2 }),
              T('descripcion', 'Descripción', { ancho: 2 }),
              C('comuna', 'Comuna'), C('region', 'Región'), C('provincia', 'Provincia'),
              C('telefono', 'Teléfono'), C('email', 'Correo'), C('acceso', 'Acceso', 'text', { ancho: 2 })
            ]
          },
          {
            titulo: 'Superficies',
            campos: [
              N('superficieTotal', 'Superficie total (ha)'),
              N('superficiePlantada', 'Superficie plantada (ha)'),
              N('superficiePotrero', 'Potrero (ha)'),
              N('anioPlantacion', 'Año de plantación')
            ]
          },
          {
            titulo: 'Clima',
            campos: [
              N('clima.altitud', 'Altitud (m)'), C('clima.zona', 'Zona climática'),
              N('clima.coefLluvia', 'Coeficiente de lluvia', { paso: 0.01 }),
              C('clima.heladas', 'Heladas', 'text', { ancho: 2 }),
              C('clima.viento', 'Viento', 'text', { ancho: 2 }),
              C('clima.etc', 'ETc mensual (mm/día, 12 valores)', 'numeros', { ancho: 2, ayuda: 'Enero a diciembre, separados por coma.' }),
              C('clima.lluvia', 'Lluvia mensual (mm, 12 valores)', 'numeros', { ancho: 2, ayuda: 'Enero a diciembre, separados por coma.' })
            ]
          },
          {
            titulo: 'Manejo del huerto',
            campos: [
              N('manejo.densidad', 'Densidad (plantas/ha)'), C('manejo.marco', 'Marco'),
              N('manejo.vidaUtil', 'Vida útil (años)'), N('manejo.inicioProduccion', 'Inicio de producción (año)'),
              C('manejo.sistema', 'Sistema de conducción', 'text', { ancho: 2 })
            ]
          }
        ]
      },

      avellanos: {
        titulo: 'Ficha de avellanos',
        grupos: [
          {
            titulo: 'General',
            campos: [C('especie', 'Especie'), C('nombreComercial', 'Nombre comercial'), T('introduccion', 'Introducción', { ancho: 2 })]
          },
          {
            titulo: 'Cifras',
            campos: [
              N('cifras.superficie', 'Superficie (ha)'), N('cifras.sectores', 'Sectores de riego'),
              N('cifras.plantasTotales', 'Plantas totales'), N('cifras.densidad', 'Densidad (plantas/ha)'),
              C('cifras.marco', 'Marco de plantación'), N('cifras.vidaProductiva', 'Vida productiva (años)'),
              N('cifras.anioPlantacion', 'Año de plantación'), N('cifras.primerAnoCosecha', 'Primer año de cosecha')
            ]
          }
        ]
      },

      ovejas: {
        titulo: 'Ficha de ovejas',
        grupos: [
          {
            titulo: 'General',
            campos: [C('nombreRebano', 'Nombre del rebaño'), T('introduccion', 'Introducción', { ancho: 2 })]
          },
          {
            titulo: 'Cifras',
            campos: [
              N('cifras.animales', 'Animales'), N('cifras.hembras', 'Hembras'), N('cifras.machos', 'Machos'),
              N('cifras.pesoPromedio', 'Peso promedio (kg)'), N('cifras.edadPromedio', 'Edad promedio (años)', { paso: 0.1 }),
              C('cifras.raza', 'Raza'), N('cifras.UA', 'Unidades animal'), N('cifras.potrero', 'Potrero (ha)'),
              N('cifras.superficieHuertoPastoreable', 'Superficie pastoreable (ha)'),
              N('cifras.disponiblesEnHuerto', 'Disponibles en el huerto')
            ]
          },
          {
            titulo: 'Reproducción',
            campos: [
              C('reproduction.celo', 'Celo'), C('reproduction.monta', 'Monta'),
              C('reproduction.permanecen', 'Permanencia'), C('reproduction.parto', 'Parto'),
              C('reproduction.destete', 'Destete'), C('reproduction.prolificidad', 'Prolificidad'),
              C('reproduction.SUPERVIVENCIA', 'Supervivencia')
            ]
          }
        ]
      },

      riego: {
        titulo: 'Sistema de riego',
        grupos: [
          {
            titulo: 'Instalación',
            campos: [
              C('sistema', 'Sistema', 'text', { ancho: 2 }), C('fuente', 'Fuente de agua', 'text', { ancho: 2 }),
              N('caudalPozo', 'Caudal del pozo (m³/h)', { paso: 0.1 }),
              N('volumenTranque', 'Volumen del tranque (m³)'),
              N('eficiencia', 'Eficiencia (%)'), N('caudalEmisor', 'Caudal del emisor (L/h)', { paso: 0.1 }),
              N('goterosPorPlanta', 'Goteros por planta'), N('horasBombeoDia', 'Horas de bombeo al día', { paso: 0.1 }),
              N('presionOperacion', 'Presión de operación (bar)', { paso: 0.1 }),
              C('filtro', 'Filtro', 'text', { ancho: 2 }),
              N('longitudLinea', 'Longitud de línea (m)'),
              F('ultimaRevision', 'Última revisión'), F('proximaRevision', 'Próxima revisión')
            ]
          }
        ]
      },

      maquinaria: {
        titulo: 'Maquinaria',
        grupos: [
          {
            titulo: 'General',
            campos: [T('introduccion', 'Introducción', { ancho: 2 })]
          },
          {
            titulo: 'Tractor principal',
            campos: [
              C('tractor.marca', 'Marca'), C('tractor.modelo', 'Modelo'), C('tractor.año', 'Año'),
              N('tractor.hp', 'Potencia (HP)'), N('tractor.horas', 'Horas de uso'),
              C('tractor.traccion', 'Tracción'), C('tractor.neumáticos', 'Neumáticos'),
              C('tractor.combustible', 'Combustible'),
              F('tractor.ultimaRevision', 'Última revisión'), F('tractor.proximaRevision', 'Próxima revisión'),
              T('tractor.notas', 'Notas', { ancho: 2 })
            ]
          }
        ]
      },

      calendario: {
        titulo: 'Calendario',
        grupos: [
          {
            titulo: 'General',
            campos: [N('año', 'Año'), T('introduccion', 'Introducción', { ancho: 2 })]
          }
        ]
      }
    }
  };
}());
