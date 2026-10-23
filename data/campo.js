/* ==========================================================================

   data/campo.js - datos generales del campo.

   Edita este archivo para actualizar la información que aparece en todo el

   sitio: nombre, ubicación, superficie, clima y cifras principales.

   ========================================================================== */

window.DATOS_CAMPO = {

  nombre: 'Campo El Avellano',

  descripcion: 'Predio avellano-ganadero en la zona sur de Chile, con avellano europeo, ' +

               'ovinos de pastoreo y riego por goteo con captación desde pozo profundo.',

  comuna: 'Curanilahue',

  region: 'Los Lagos',

  provincia: 'Osorno',

  telefono: '+56 9 0000 0000',

  email: 'contacto@ejemplo.cl',

  superficieTotal: 20,      // ha del predio

  superficiePlantada: 16,   // ha con avellanos (4 sectores de 4 ha)

  superficiePotrero: 4,     // ha de potrero para ovinos

  anioPlantacion: 2015,

  acceso: 'Ruta 5, kilómetro 812',

  /* ------------------------------------------------- Cifras de portada --- */

  kpis: [

    { valor: '16', unidad: 'ha', etiqueta: 'Avellanos plantados' },

    { valor: '4', unidad: 'ha', etiqueta: 'Potrero de pastoreo' },

    { valor: '40', unidad: 'cabezas', etiqueta: 'Rebaño ovino' },

    { valor: '2.000', unidad: 'kg/ha', etiqueta: 'Rendimiento medio' }

  ],

  /* ------------------------------------------------------------- Clima ---- */

  /* ETc mensual (mm/día) de avellano adulto en la zona sur; referencial.   */

  /* Lluvia mensual (mm) promedio del último ciclo.                         */

  clima: {

    altitud: 120,

    zona: 'Templado lluvioso con verano seco (Csb)',

    etc: [4.6, 4.2, 3.4, 2.3, 1.5, 1.0, 0.9, 1.2, 2.0, 2.8, 3.5, 4.2],

    lluvia: [40, 45, 60, 90, 150, 180, 210, 170, 110, 80, 55, 45],

    coefLluvia: 0.8,

    heladas: '4 a 7 por año, principalmente entre mayo y agosto',

    viento: 'Predominante del oeste, con rachas sobre 40 km/h en verano'

  },

  /* ------------------------------------------- Cifras de manejo del huerto - */

  manejo: {

    densidad: 500,            // plantas/ha

    marco: '5 m entre filas x 4 m entre plantas',

    vidaUtil: 40,             // años

    inicioProduccion: 4,      // año en que empieza a producción

    sistema: 'Conducción en vaso con eje central'

  },

  /* ------------------------------------------------------- Tareas del año - */

  hitos: [

    { fecha: '2026-01-15', titulo: 'Inicio de cosecha', tipo: 'cosecha' },

    { fecha: '2026-01-20', titulo: 'Revisión de floración y cuajado', tipo: 'manejo' },

    { fecha: '2026-03-05', titulo: 'Poda de formación y limpieza sanitaria', tipo: 'poda' },

    { fecha: '2026-04-10', titulo: 'Aplicación de fungicida en floración', tipo: 'sanidad' },

    { fecha: '2026-05-15', titulo: 'Siembra de cubierta vegetal', tipo: 'manejo' },

    { fecha: '2026-07-20', titulo: 'Cosecha de forraje del potrero', tipo: 'forraje' },

    { fecha: '2026-09-01', titulo: 'Preparación de suelo y fertilización', tipo: 'fertilizacion' },

    { fecha: '2026-10-10', titulo: 'Inicio de floración y polinización', tipo: 'floracion' },

    { fecha: '2026-11-05', titulo: 'Revisión del sistema de riego', tipo: 'riego' }

  ]

};

