/* ==========================================================================

   data/ovejas.js - rebaño ovino y su manejo.

   ========================================================================== */

window.DATOS_OVEJAS = {

  nombreRebano: 'Rebaño principal',

  introduccion: 'Cuarenta ovejas de raza Romney y cruces, mantidas en el potrero de 4 ha ' +

                'con pastoreo rotativo y suplementación en los meses críticos.',

  cifras: {

    animales: 40,

    hembras: 32,

    machos: 8,

    pesoPromedio: 45,

    edadPromedio: 4.5,

    raza: 'Romney y cruces con Merino',

    UA: 30,

    potrero: 4,

    superficieHuertoPastoreable: 16,

    disponiblesEnHuerto: 36

  },

  composicion: [

    { categoria: 'Hembras adultas en producción', cantidad: 28, peso: 48, nota: 'Base del rebaño. Se ordeñan y crían corderos.' },

    { categoria: 'Hembras de reposición', cantidad: 4, peso: 32, nota: 'Presentadas al celo por primera vez.' },

    { categoria: 'Machos reproductores', cantidad: 3, peso: 62, nota: 'Uno por grupo de 10 hembras.' },

    { categoria: 'Machos castrados', cantidad: 2, peso: 52, nota: 'Destinados a faena.' },

    { categoria: 'Corderos de la temporada', cantidad: 3, peso: 18, nota: 'Nacidos en agosto, destetados en noviembre.' }

  ],

  reproduction: {

    celo: 'Ciclos de 17 días, con sincronización por efecto macho entre el 20 y el 25 de mayo',

    monta: 'Monta natural en grupos de 10 hembras por macho',

    permanecen: 'About 40 días de gestación en el potrero',

    parto: 'Entre el 25 de agosto y el 15 de septiembre',

    destete: 'Entre el 20 de octubre y el 20 de noviembre, a los 70 a 90 días',

    prolificidad: '1,35 corderos por parto',

    SUPERVIVENCIA: '92 % de corderos al destete'

  },

  manejoSanitario: [

    { mes: 'Febrero', tarea: 'Desparasitación interna', producto: 'Albendazol 15 mg/kg', dosis: '1 ml por 10 kg', responsable: 'Veterinario' },

    { mes: 'Marzo', tarea: 'Vacunación contra clavelina y estreptococcia', producto: 'Vacuna polivalente', dosis: '2 ml subcutáneo', responsable: 'Veterinario' },

    { mes: 'Abril', tarea: 'Corte de cascos', producto: 'Tijeras de pezuña', dosis: '-', responsable: 'C. Rojas' },

    { mes: 'Mayo', tarea: 'Sincronización y control de celos', producto: 'Efecto macho y destete estratégico', dosis: '-', responsable: 'C. Rojas' },

    { mes: 'Junio', tarea: 'Desparasitación externa y control de garrapatas', producto: 'Ivermectina 0,2 mg/kg', dosis: '1 ml por 50 kg', responsable: 'Veterinario' },

    { mes: 'Julio', tarea: 'Preparación de la paridera', producto: 'Corrales y cama de paja', dosis: '-', responsable: 'M. Soto' },

    { mes: 'Agosto', tarea: 'Partos y supervisión de corderos', producto: 'Calostro y sellado de ombligo', dosis: '-', responsable: 'Todo el equipo' },

    { mes: 'Septiembre', tarea: 'Destete y castración de machos', producto: 'Pinza de castración', dosis: '-', responsable: 'Veterinario' },

    { mes: 'Octubre', tarea: 'Pesaje y control de crecimiento', producto: 'Báscula', dosis: '-', responsable: 'C. Rojas' },

    { mes: 'Noviembre', tarea: 'Selección de hembras de reposición', producto: '-', dosis: '-', responsable: 'C. Rojas' },

    { mes: 'Diciembre', tarea: 'Revisión del estado corporal y control de garrapatas', producto: 'Condición corporal 2,5 a 3,0', dosis: '-', responsable: 'C. Rojas' }

  ],

  /* Pastoreo: cifras de referencia. El plan detallado se calcula con la

     calculadora de carga animal. */

  pastoreo: [

    { periodo: 'Septiembre - noviembre', destino: 'Potrero', carga: 'Media', nota: 'Rebaño en crecimiento. Se evita el huerto por el riesgo de daño a las plantas jóvenes.' },

    { periodo: 'Diciembre - febrero', destino: 'Potrero y huerto', carga: 'Baja a media', nota: 'Pastoreo controlado en el huerto solo en los sectores con copas ya formadas.' },

    { periodo: 'Marzo - agosto', destino: 'Potrero', carga: 'Media', nota: 'Periodo de crecimiento de pasto. Se suplementa con heno cuando el forraje escasea.' }

  ],

  produccion: [

    { temporada: '2022', corderos: 36, tasaNacimiento: 1.28, pesoDestete: 22, venta: 34, precio: 38000 },

    { temporada: '2023', corderos: 38, tasaNacimiento: 1.35, pesoDestete: 24, venta: 35, precio: 42000 },

    { temporada: '2024', corderos: 35, tasaNacimiento: 1.29, pesoDestete: 23, venta: 33, precio: 45000 },

    { temporada: '2025', corderos: 41, tasaNacimiento: 1.42, pesoDestete: 25, venta: 38, precio: 48000 },

    { temporada: '2026', corderos: 39, tasaNacimiento: 1.38, pesoDestete: 25, venta: 36, precio: 50000 }

  ],

  indicadores: [

    { nombre: 'Corderos viable por partos', valor: '1,38', meta: '1,40', estado: 'ok' },

    { nombre: 'Sobrevivencia al destete', valor: '92 %', meta: '90 %', estado: 'ok' },

    { nombre: 'Peso al destete', valor: '25 kg', meta: '24 kg', estado: 'ok' },

    { nombre: 'Condición corporal media', valor: '2,8', meta: '2,5 a 3,0', estado: 'ok' },

    { nombre: 'Carga animal', valor: '0,75 UA/ha', meta: 'máximo 1,0 UA/ha', estado: 'aviso' }

  ],

  documentos: [

    { titulo: 'Plan sanitario anual del rebaño', archivo: 'pdfs/ovejas/plan-sanitario.pdf',

      descripcion: 'Calendario de vacunación, desparasitación y stocking con fechas y productos.',

      fecha: '2026-02-01', seccion: 'Ovejas', tags: ['sanidad', 'plan'] },

    { titulo: 'Registro de parideras', archivo: 'pdfs/ovejas/registro-parideras.pdf',

      descripcion: 'Parto por parto, peso al nacimiento, supervivencia y causa de pérdida.',

      fecha: '2025-10-15', seccion: 'Ovejas', tags: ['parideras'] },

    { titulo: 'Ficha de pastoreo y balance forrajero', archivo: 'pdfs/ovejas/ficha-pastoreo.pdf',

      descripcion: 'Carga animal, consumo estimado y calendario de suplementación del rebaño.',

      fecha: '2026-01-05', seccion: 'Ovejas', tags: ['pastoreo'] },

    { titulo: 'Guía de manejo en sistema de pastoreo', archivo: 'pdfs/ovejas/guia-pastoreo.pdf',

      descripcion: 'Rotación de potreros, agua, sombra y manejo del pastoreo bajo avellanos.',

      fecha: '2025-09-12', seccion: 'Ovejas', tags: ['guía'] }

  ]

};

