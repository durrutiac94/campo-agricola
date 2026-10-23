/* ==========================================================================

   data/riego.js - sistema de riego por goteo, sectores y captación.

   ========================================================================== */

window.DATOS_RIEGO = {

  sistema: 'Goteo con cinta de 16 mm, gotero compensado de 4 L/h',

  fuente: 'Pozo profundo con tranque de regulación',

  caudalPozo: 25,            // m3/h nominales

  volumenTranque: 300,       // m3

  eficiencia: 90,            // %

  caudalEmisor: 4,           // L/h por gotero

  goterosPorPlanta: 4,

  horasBombeoDia: 12,        // h de bombeo según programa de riego

  presionOperacion: 1.5,     // bar

  filtro: 'Filtro de arena + malla de disco 120 mesh',

  longitudLinea: 250,        // m por línea de goteo

  ultimaRevision: '2026-03-12',

  proximaRevision: '2026-09-12',

  /* Sectores del huerto */

  sectores: [

    {

      nombre: 'Sector 1',

      superficie: 4,

      operativo: true,

      lineas: 14,

      caudal: 28.8,

      programacion: 'Lunes, miércoles y viernes, 06:00 h',

      notas: 'Capa freática más profunda; sin historial de pérdida de presión.'

    },

    {

      nombre: 'Sector 2',

      superficie: 4,

      operativo: true,

      lineas: 14,

      caudal: 28.8,

      programacion: 'Martes, jueves y sábado, 06:00 h',

      notas: 'Presión de ingreso algo baja en el extremo oriente.'

    },

    {

      nombre: 'Sector 3',

      superficie: 4,

      operativo: false,

      lineas: 0,

      caudal: 0,

      programacion: 'Sin riego',

      notas: 'Riego por goteo sin instalar. Se riega por aplicación al surco en verano.'

    },

    {

      nombre: 'Sector 4',

      superficie: 4,

      operativo: false,

      lineas: 0,

      caudal: 0,

      programacion: 'Sin riego',

      notas: 'Plantado en 2018, con menor desarrollo y sin inversión en riego.'

    }

  ],

  /* Resultados del balance hídrico por mes (mm y m3) */

  balance: [

    { mes: 'Enero',      etc: 143, lluvia: 40,  neto: 111, volumen: 17760 },

    { mes: 'Febrero',    etc: 118, lluvia: 45,  neto: 82,  volumen: 13120 },

    { mes: 'Marzo',      etc: 105, lluvia: 60,  neto: 57,  volumen: 9120 },

    { mes: 'Abril',      etc: 69,  lluvia: 90,  neto: 0,   volumen: 0 },

    { mes: 'Mayo',       etc: 47,  lluvia: 150, neto: 0,   volumen: 0 },

    { mes: 'Junio',      etc: 30,  lluvia: 180, neto: 0,   volumen: 0 },

    { mes: 'Julio',      etc: 28,  lluvia: 210, neto: 0,   volumen: 0 },

    { mes: 'Agosto',     etc: 37,  lluvia: 170, neto: 0,   volumen: 0 },

    { mes: 'Septiembre', etc: 60,  lluvia: 110, neto: 0,   volumen: 0 },

    { mes: 'Octubre',    etc: 87,  lluvia: 80,  neto: 23,  volumen: 3680 },

    { mes: 'Noviembre',  etc: 105, lluvia: 55,  neto: 61,  volumen: 9760 },

    { mes: 'Diciembre',  etc: 130, lluvia: 45,  neto: 94,  volumen: 15040 }

  ],

  /* Mantenimiento programado */

  mantenimiento: [

    { tarea: 'Lavado de filtros de arena', frecuencia: 'Semanal en temporada', ultimo: '2026-03-05' },

    { tarea: 'Revisión de goteros tapados', frecuencia: 'Mensual', ultimo: '2026-02-11' },

    { tarea: 'Aforo de caudal en el pozo', frecuencia: 'Trimestral', ultimo: '2026-01-08' },

    { tarea: 'Limpieza del tranque', frecuencia: 'Anual antes del verano', ultimo: '2025-11-20' },

    { tarea: 'Cambio de filtro de malla', frecuencia: 'Anual', ultimo: '2025-10-30' },

    { tarea: 'Prueba de presión en el sector 2', frecuencia: 'Trimestral', ultimo: '2026-03-12' }

  ],

  /* Bitácora de riego reciente */

  registros: [

    { fecha: '2026-03-12', sector: 'Sector 1', horas: 6.5, volumen: 168, caudal: 25.8, operario: 'C. Rojas' },

    { fecha: '2026-03-05', sector: 'Sector 2', horas: 5.0, volumen: 129, caudal: 25.8, operario: 'C. Rojas' },

    { fecha: '2026-02-11', sector: 'Sector 1', horas: 7.0, volumen: 181, caudal: 25.8, operario: 'M. Soto' },

    { fecha: '2026-02-04', sector: 'Sector 2', horas: 6.0, volumen: 155, caudal: 25.8, operario: 'M. Soto' },

    { fecha: '2026-01-08', sector: 'Sector 1', horas: 8.5, volumen: 220, caudal: 25.8, operario: 'C. Rojas' }

  ]

};

