/* ==========================================================================

   data/calendario.js - calendario anual consolidado del campo.

   ========================================================================== */

window.DATOS_CALENDARIO = {

  año: 2026,

  introduccion: 'Calendario anual que agrupa las principales labores de avellano, ovinos, riego, ' +

                'maquinaria y sanidad. Puedes filtrar por mes y por categoría.',

  eventos: [

    /* Enero */

    { fecha: '2026-01-05', mes: 0, titulo: 'Revisión del sistema de riego', categoria: 'riego', tipo: 'revision',

      descripcion: 'Inspección de filtros, goteros y presión en los sectores 1 y 2.', responsable: 'M. Soto' },

    { fecha: '2026-01-10', mes: 0, titulo: 'Revisión de cosecha en curso', categoria: 'avellanos', tipo: 'cosecha',

      descripcion: 'Seguimiento al acopio, secado y limpieza de frutos.', responsable: 'C. Rojas' },

    { fecha: '2026-01-15', mes: 0, titulo: 'Inicio de cosecha', categoria: 'avellanos', tipo: 'cosecha',

      descripcion: 'Arranque de la cosecha. Verificar bins, carros y transporte.', responsable: 'Todo el equipo' },

    { fecha: '2026-01-20', mes: 0, titulo: 'Revisión de floración y cuajado', categoria: 'avellanos', tipo: 'seguimiento',

      descripcion: 'Análisis del cuajado por variedad y estimación preliminar de rendimiento.', responsable: 'C. Rojas' },

    { fecha: '2026-01-25', mes: 0, titulo: 'Control de riego por alta demanda', categoria: 'riego', tipo: 'riego',

      descripcion: 'Programación de riego en función del clima y del estado de suelo.', responsable: 'M. Soto' },

    /* Febrero */

    { fecha: '2026-02-01', mes: 1, titulo: 'Cosecha en plena faena', categoria: 'avellanos', tipo: 'cosecha',

      descripcion: 'Mantener ritmo de recolección y control de humedad de los frutos.', responsable: 'Todo el equipo' },

    { fecha: '2026-02-05', mes: 1, titulo: 'Revisión sanitaria del rebaño', categoria: 'ovejas', tipo: 'sanidad',

      descripcion: 'Revisión de pezuñas, condición corporal y drenajes.', responsable: 'C. Rojas' },

    { fecha: '2026-02-11', mes: 1, titulo: 'Mantenimiento de pulverizador', categoria: 'maquinaria', tipo: 'mantenimiento',

      descripcion: 'Limpieza, calibración y revisión de bombas.', responsable: 'M. Soto' },

    { fecha: '2026-02-15', mes: 1, titulo: 'Post-cosecha: traslado a bodega', categoria: 'avellanos', tipo: 'cosecha',

      descripcion: 'Limpieza de hileras, retiro de restos y acopio controlado.', responsable: 'M. Soto' },

    { fecha: '2026-02-20', mes: 1, titulo: 'Desparasitación interna del rebaño', categoria: 'ovejas', tipo: 'sanidad',

      descripcion: 'Tratamiento antiparasitario conforme al plan sanitario.', responsable: 'Veterinario' },

    /* Marzo */

    { fecha: '2026-03-01', mes: 2, titulo: 'Poda de formación y renovación', categoria: 'avellanos', tipo: 'poda',

      descripcion: 'Eliminación de chupones, ramas improductivas y mejora de la estructura de copa.', responsable: 'C. Rojas' },

    { fecha: '2026-03-05', mes: 2, titulo: 'Poda sanitaria', categoria: 'avellanos', tipo: 'poda',

      descripcion: 'Retiro de ramas secas o con daño. Desinfección de herramientas entre filas.', responsable: 'C. Rojas' },

    { fecha: '2026-03-10', mes: 2, titulo: 'Revisión general del tractor', categoria: 'maquinaria', tipo: 'mantenimiento',

      descripcion: 'Cambio de aceite, filtros, frenos y luces.', responsable: 'Taller propio' },

    { fecha: '2026-03-12', mes: 2, titulo: 'Aforo de caudal del pozo', categoria: 'riego', tipo: 'revision',

      descripcion: 'Medición de caudal, presión y estado del tranque.', responsable: 'M. Soto' },

    { fecha: '2026-03-15', mes: 2, titulo: 'Fertilización de fondo', categoria: 'avellanos', tipo: 'fertilizacion',

      descripcion: 'Aplicación de compost y fertilizante mineral a 20-30 cm de profundidad.', responsable: 'C. Rojas' },

    /* Abril */

    { fecha: '2026-04-05', mes: 3, titulo: 'Control de malezas y cubierta vegetal', categoria: 'avellanos', tipo: 'manejo',

      descripcion: 'Siembra o mantenimiento de la cubierta entre hileras.', responsable: 'M. Soto' },

    { fecha: '2026-04-10', mes: 3, titulo: 'Aplicación de fungicida en floración', categoria: 'avellanos', tipo: 'sanidad',

      descripcion: 'Tratamiento preventivo contra enfermedades de floración.', responsable: 'M. Soto' },

    { fecha: '2026-04-15', mes: 3, titulo: 'Corte de cascos del rebaño', categoria: 'ovejas', tipo: 'sanidad',

      descripcion: 'Corte de cascos, revisión y tratamiento de heridas si las hay.', responsable: 'C. Rojas' },

    { fecha: '2026-04-20', mes: 3, titulo: 'Mantenimiento de implementos', categoria: 'maquinaria', tipo: 'mantenimiento',

      descripcion: 'Engrase, correas y revisión general de los implementos.', responsable: 'Taller propio' },

    /* Mayo */

    { fecha: '2026-05-05', mes: 4, titulo: 'Vacunación del rebaño', categoria: 'ovejas', tipo: 'sanidad',

      descripcion: 'Vacunación polivalente conforme al plan sanitario.', responsable: 'Veterinario' },

    { fecha: '2026-05-10', mes: 4, titulo: 'Sincronización de celos', categoria: 'ovejas', tipo: 'reproduccion',

      descripcion: 'Aplicación de estrategia de efecto macho para iniciar la monta.', responsable: 'C. Rojas' },

    { fecha: '2026-05-15', mes: 4, titulo: 'Siembra de cubierta vegetal', categoria: 'avellanos', tipo: 'manejo',

      descripcion: 'Establecimiento de mezcla de leguminosas para proteger el suelo.', responsable: 'M. Soto' },

    { fecha: '2026-05-20', mes: 4, titulo: 'Monta natural', categoria: 'ovejas', tipo: 'reproduccion',

      descripcion: 'Se inician las montas con los machos reproductores.', responsable: 'C. Rojas' },

    /* Junio */

    { fecha: '2026-06-05', mes: 5, titulo: 'Poda sanitaria', categoria: 'avellanos', tipo: 'poda',

      descripcion: 'Retiro de madera muerta o dañada después de la caída de la hoja.', responsable: 'C. Rojas' },

    { fecha: '2026-06-10', mes: 5, titulo: 'Desparasitación externa del rebaño', categoria: 'ovejas', tipo: 'sanidad',

      descripcion: 'Control de garrapatas y piojos.', responsable: 'Veterinario' },

    { fecha: '2026-06-15', mes: 5, titulo: 'Revisión del galpón y herramientas', categoria: 'maquinaria', tipo: 'mantenimiento',

      descripcion: 'Inventario, limpieza y revisión de elementos de seguridad.', responsable: 'Todo el equipo' },

    /* Julio */

    { fecha: '2026-07-10', mes: 6, titulo: 'Preparación de la paridera', categoria: 'ovejas', tipo: 'manejo',

      descripcion: 'Limpieza, desinfección y preparación de corrales con cama de paja.', responsable: 'M. Soto' },

    { fecha: '2026-07-15', mes: 6, titulo: 'Fertilización nitrogenada', categoria: 'avellanos', tipo: 'fertilizacion',

      descripcion: 'Aporte de nitrógeno para el crecimiento y reposición de reservas.', responsable: 'C. Rojas' },

    { fecha: '2026-07-20', mes: 6, titulo: 'Cosecha de forraje del potrero', categoria: 'ovejas', tipo: 'forraje',

      descripcion: 'Acopio de heno para la suplementación de invierno.', responsable: 'M. Soto' },

    /* Agosto */

    { fecha: '2026-08-01', mes: 7, titulo: 'Inicio de parideras', categoria: 'ovejas', tipo: 'reproduccion',

      descripcion: 'Supervisión de partos y atención de corderos recién nacidos.', responsable: 'Todo el equipo' },

    { fecha: '2026-08-10', mes: 7, titulo: 'Monitoreo de floración', categoria: 'avellanos', tipo: 'seguimiento',

      descripcion: 'Registro de floración por variedad y comparación entre polinizadores.', responsable: 'C. Rojas' },

    { fecha: '2026-08-15', mes: 7, titulo: 'Revisión del sistema de riego', categoria: 'riego', tipo: 'revision',

      descripcion: 'Preparación para la temporada de riego. Limpieza de filtros.', responsable: 'M. Soto' },

    /* Septiembre */

    { fecha: '2026-09-01', mes: 8, titulo: 'Preparación de suelo y fertilización', categoria: 'avellanos', tipo: 'fertilizacion',

      descripcion: 'Aporte de potasio y micronutrientes para el llenado del fruto.', responsable: 'C. Rojas' },

    { fecha: '2026-09-10', mes: 8, titulo: 'Control de plagas y enfermedades', categoria: 'avellanos', tipo: 'sanidad',

      descripcion: 'Monitoreo y aplicación fitosanitaria según necesidad.', responsable: 'M. Soto' },

    { fecha: '2026-09-12', mes: 8, titulo: 'Revisión del pozo y tranque', categoria: 'riego', tipo: 'revision',

      descripcion: 'Revisión de bomba, tuberías y flotador.', responsable: 'M. Soto' },

    { fecha: '2026-09-15', mes: 8, titulo: 'Destete y castración', categoria: 'ovejas', tipo: 'manejo',

      descripcion: 'Destete de corderos y castración de machos seleccionados para faena.', responsable: 'Veterinario' },

    /* Octubre */

    { fecha: '2026-10-05', mes: 9, titulo: 'Riego de verano', categoria: 'avellanos', tipo: 'riego',

      descripcion: 'Inicio del programa de riego en los sectores operativos.', responsable: 'M. Soto' },

    { fecha: '2026-10-10', mes: 9, titulo: 'Inicio de floración y polinización', categoria: 'avellanos', tipo: 'floracion',

      descripcion: 'Seguimiento de la polinización y protección de la floración.', responsable: 'C. Rojas' },

    { fecha: '2026-10-15', mes: 9, titulo: 'Pesaje y control de crecimiento', categoria: 'ovejas', tipo: 'seguimiento',

      descripcion: 'Pesaje de corderos destetados y evaluación de condición corporal.', responsable: 'C. Rojas' },

    /* Noviembre */

    { fecha: '2026-11-05', mes: 10, titulo: 'Revisión del sistema de riego', categoria: 'riego', tipo: 'revision',

      descripcion: 'Ajuste de programaciones según demanda hídrica del mes.', responsable: 'M. Soto' },

    { fecha: '2026-11-10', mes: 10, titulo: 'Selección de hembras de reposición', categoria: 'ovejas', tipo: 'reproduccion',

      descripcion: 'Selección de reemplazos con base en conformación y condición.', responsable: 'C. Rojas' },

    { fecha: '2026-11-15', mes: 10, titulo: 'Control fitosanitario', categoria: 'avellanos', tipo: 'sanidad',

      descripcion: 'Monitoreo de plagas y enfermedades en el huerto.', responsable: 'M. Soto' },

    /* Diciembre */

    { fecha: '2026-12-05', mes: 11, titulo: 'Control de malezas en hileras', categoria: 'avellanos', tipo: 'manejo',

      descripcion: 'Mantenimiento de calles y control en la línea de plantación.', responsable: 'M. Soto' },

    { fecha: '2026-12-10', mes: 11, titulo: 'Revisión del rebaño', categoria: 'ovejas', tipo: 'seguimiento',

      descripcion: 'Revisión general antes de las fiestas y evaluación de forraje.', responsable: 'C. Rojas' },

    { fecha: '2026-12-15', mes: 11, titulo: 'Inventario anual', categoria: 'general', tipo: 'inventario',

      descripcion: 'Inventario de insumos, herramientas, combustible y maquinarias.', responsable: 'C. Rojas' }

  ],

  categorias: [

    { id: 'avellanos', nombre: 'Avellanos', color: '#1f6f3d' },

    { id: 'ovejas', nombre: 'Ovejas', color: '#8a6a2f' },

    { id: 'riego', nombre: 'Riego', color: '#2a7bbf' },

    { id: 'maquinaria', nombre: 'Maquinaria', color: '#6b6b6b' },

    { id: 'sanidad', nombre: 'Sanidad', color: '#b33a3a' },

    { id: 'general', nombre: 'General', color: '#3a7c6f' }

  ]

};

