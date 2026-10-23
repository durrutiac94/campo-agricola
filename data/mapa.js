/* ==========================================================================

   data/mapa.js - diagrama SVG del campo.

   Define sectores, potrero, caminos, galpones, tranque, pozo y puntos de interés.

   El mapa se renderiza en mapa.html con js/mapa.js

   ========================================================================== */

window.DATOS_MAPA = {

  titulo: 'Mapa del campo',

  descripcion: 'Distribución de las 20 hectáreas: 16 ha de avellanos (4 sectores de 4 ha), ' +

               '4 ha de potrero, acceso, galpones, tranque y pozo profundo.',

  /* Coordenadas SVG (vista general) */

  viewBox: { x: 0, y: 0, width: 900, height: 650 },

  /* Leyenda */

  leyenda: [

    { id: 'avellano', nombre: 'Avellanos', color: '#2d7f4b', borde: '#1f5f35' },

    { id: 'potrero', nombre: 'Potrero', color: '#8a9b4f', borde: '#6b7a3b' },

    { id: 'riego', nombre: 'Sector de riego', color: '#4a9fd6', borde: '#2a7bbf' },

    { id: 'riego-inactivo', nombre: 'Sin riego', color: '#7fb8df', borde: '#5a8fc0' },

    { id: 'infra', nombre: 'Infraestructura', color: '#9b8a6a', borde: '#7a6a4a' },

    { id: 'acceso', nombre: 'Acceso / camino', color: '#b9a07e', borde: '#9b8060' },

    { id: 'agua', nombre: 'Agua (pozo/tranque)', color: '#4fc3f7', borde: '#29b6f6' }

  ],

  /* Elementos del mapa */

  elementos: [

    /* Acceso */

    { id: 'camino', tipo: 'camino', clase: 'acceso',

      puntos: [[0, 480], [200, 480], [200, 520], [0, 520]],

      etiqueta: 'Acceso principal' },

    /* Sector 1 - operativo con riego */

    { id: 'sector1', tipo: 'parcela', clase: 'riego',

      puntos: [[200, 80], [440, 80], [440, 280], [200, 280]],

      etiqueta: 'Sector 1', superficie: '4,0 ha', cultivo: 'Avellano europeo',

      estado: 'Operativo', riego: 'Goteo', notas: 'Marco 5 x 4 m. Polinizadores presentes.' },

    /* Sector 2 - operativo con riego */

    { id: 'sector2', tipo: 'parcela', clase: 'riego',

      puntos: [[460, 80], [700, 80], [700, 280], [460, 280]],

      etiqueta: 'Sector 2', superficie: '4,0 ha', cultivo: 'Avellano europeo',

      estado: 'Operativo', riego: 'Goteo', notas: 'Presión algo baja en el extremo oriente.' },

    /* Sector 3 - sin riego */

    { id: 'sector3', tipo: 'parcela', clase: 'riego-inactivo',

      puntos: [[200, 300], [440, 300], [440, 500], [200, 500]],

      etiqueta: 'Sector 3', superficie: '4,0 ha', cultivo: 'Avellano europeo',

      estado: 'Sin riego instalado', riego: 'Por surco', notas: 'Menor desarrollo comparado con sectores con riego.' },

    /* Sector 4 - sin riego */

    { id: 'sector4', tipo: 'parcela', clase: 'riego-inactivo',

      puntos: [[460, 300], [700, 300], [700, 500], [460, 500]],

      etiqueta: 'Sector 4', superficie: '4,0 ha', cultivo: 'Avellano europeo',

      estado: 'Sin riego instalado', riego: 'Por surco', notas: 'Plantado en 2018.' },

    /* Potrero */

    { id: 'potrero', tipo: 'parcela', clase: 'potrero',

      puntos: [[720, 80], [880, 80], [880, 300], [720, 300]],

      etiqueta: 'Potrero', superficie: '4,0 ha', cultivo: 'Pradera',

      estado: 'En uso', riego: 'Sin riego', notas: 'Pastoreo rotativo del rebaño ovino.' },

    /* Galpón */

    { id: 'galpon', tipo: 'infraestructura', clase: 'infra',

      puntos: [[60, 180], [160, 180], [160, 260], [60, 260]],

      etiqueta: 'Galpón', uso: 'Maquinaria y herramientas', notas: 'Tractor, implementos, bins y herramientas.' },

    /* Bodega */

    { id: 'bodega', tipo: 'infraestructura', clase: 'infra',

      puntos: [[60, 280], [160, 280], [160, 360], [60, 360]],

      etiqueta: 'Bodega', uso: 'Secado y acopio', notas: 'Frutos secos y almacenamiento.' },

    /* Corral */

    { id: 'corral', tipo: 'infraestructura', clase: 'infra',

      puntos: [[720, 340], [820, 340], [820, 440], [720, 440]],

      etiqueta: 'Corral', uso: 'Ovejas', notas: 'Manejo sanitario, esquila y paridera.' },

    /* Tranque */

    { id: 'tranque', tipo: 'agua', clase: 'agua',

      puntos: [[720, 460], [820, 460], [820, 560], [720, 560]],

      etiqueta: 'Tranque', uso: 'Regulación', volumen: '300 m³', notas: 'Tranque de regulación del sistema de riego.' },

    /* Pozo */

    { id: 'pozo', tipo: 'agua', clase: 'agua',

      puntos: [[840, 460], [880, 460], [880, 500], [840, 500]],

      etiqueta: 'Pozo profundo', uso: 'Captación', caudal: '25 m³/h', notas: 'Fuente de agua para el riego por goteo.' },

    /* Norte */

    { id: 'norte', tipo: 'texto', x: 450, y: 40, texto: 'NORTE' }

  ]

};

