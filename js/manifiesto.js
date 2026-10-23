/* Mapa entre las secciones del sitio y las tablas de Supabase.
   - ajustes: claves del objeto de sección que se guardan como bloque (tabla ajustes).
   - listas: cada lista se guarda como filas independientes (tabla registros).
     fuente: clave dentro del objeto de la sección.
     global: variable de window que contiene la lista (si la sección es solo una lista). */
(function () {
  'use strict';

  function listas(global, nombres) {
    return nombres.map(function (n) {
      return { nombre: n, fuente: n, global: global };
    });
  }

  window.CAMPO_MANIFIESTO = {
    campo: {
      titulo: 'Campo',
      global: 'DATOS_CAMPO',
      ajustes: ['nombre', 'descripcion', 'comuna', 'region', 'provincia', 'telefono',
        'email', 'superficieTotal', 'superficiePlantada', 'superficiePotrero',
        'anioPlantacion', 'acceso', 'clima', 'manejo'],
      listas: listas('DATOS_CAMPO', ['kpis', 'hitos'])
    },

    avellanos: {
      titulo: 'Avellanos',
      global: 'DATOS_AVELLANOS',
      ajustes: ['especie', 'nombreComercial', 'introduccion', 'cifras'],
      listas: listas('DATOS_AVELLANOS', ['variedades', 'fases', 'labores', 'plagas',
        'climaRequisitos', 'produccion', 'documentos'])
    },

    ovejas: {
      titulo: 'Ovejas',
      global: 'DATOS_OVEJAS',
      ajustes: ['nombreRebano', 'introduccion', 'cifras', 'reproduction'],
      listas: listas('DATOS_OVEJAS', ['composicion', 'manejoSanitario', 'pastoreo',
        'produccion', 'indicadores', 'documentos'])
    },

    riego: {
      titulo: 'Riego',
      global: 'DATOS_RIEGO',
      ajustes: ['sistema', 'fuente', 'caudalPozo', 'volumenTranque', 'eficiencia',
        'caudalEmisor', 'goterosPorPlanta', 'horasBombeoDia', 'presionOperacion',
        'filtro', 'longitudLinea', 'ultimaRevision', 'proximaRevision'],
      listas: listas('DATOS_RIEGO', ['sectores', 'balance', 'mantenimiento', 'registros'])
    },

    maquinaria: {
      titulo: 'Maquinaria',
      global: 'DATOS_MAQUINARIA',
      ajustes: ['introduccion', 'tractor'],
      listas: listas('DATOS_MAQUINARIA', ['implementos', 'herramientas', 'combustible',
        'mantenimiento', 'documentos'])
    },

    calendario: {
      titulo: 'Calendario',
      global: 'DATOS_CALENDARIO',
      ajustes: ['año', 'introduccion'],
      listas: listas('DATOS_CALENDARIO', ['eventos', 'categorias'])
    },

    bitacora: {
      titulo: 'Bitácora',
      global: null,
      ajustes: [],
      listas: [
        { nombre: 'labores', fuente: null, global: 'DATOS_LABORES' },
        { nombre: 'gastos', fuente: null, global: 'DATOS_GASTOS' }
      ]
    },

    documentos: {
      titulo: 'Documentos',
      global: null,
      ajustes: [],
      listas: [
        { nombre: 'documentos', fuente: null, global: 'DATOS_DOCUMENTOS' }
      ]
    },

    contactos: {
      titulo: 'Contactos',
      global: null,
      ajustes: [],
      listas: [
        { nombre: 'contactos', fuente: null, global: 'DATOS_CONTACTOS' }
      ]
    }
  };
}());
