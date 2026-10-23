/* ==========================================================================

   data/avellanos.js - plantación de avellano europeo y su manejo.

   ========================================================================== */

window.DATOS_AVELLANOS = {

  especie: 'Corylus avellana (avellano europeo)',

  nombreComercial: 'Avellano europeo',

  introduccion: 'Plantado en 2015 en 16 hectáreas divididas en cuatro sectores de 4 ha. ' +

                'El diseño es en vaso con eje central, con marco de plantación de 5 x 4 m.',

  cifras: {

    superficie: 16,

    sectores: 4,

    plantasTotales: 8000,

    densidad: 500,

    marco: '5 m x 4 m',

    vidaProductiva: 40,

    anioPlantacion: 2015,

    primerAnoCosecha: 2019

  },

  variedades: [

    { nombre: 'Gevuine (Nonpareil)', superficie: 4.5, plantacion: 2015, polinizador: 'Si',

      floracion: 'Temprana (agosto)', rendimiento: 2100,

      nota: 'Polinizador principal. Fruto de buena calidad para industria.' },

    { nombre: 'Nangarra', superficie: 4.0, plantacion: 2015, polinizador: 'No',

      floracion: 'Media (septiembre)', rendimiento: 1950,

      nota: 'Muy productiva, con semilla de calibre grande.' },

    { nombre: 'Tonda Gentile', superficie: 3.5, plantacion: 2016, polinizador: 'No',

      floracion: 'Media (septiembre)', rendimiento: 2200,

      nota: 'Rusticidad alta, adecuada para zonas de inviernos húmedos.' },

    { nombre: 'Frangollo', superficie: 2.5, plantacion: 2016, polinizador: 'No',

      floracion: 'Tardía (octubre)', rendimiento: 1800,

      nota: 'Se usa como polinizador complementario.' },

    { nombre: 'Romano', superficie: 2.0, plantacion: 2018, polinizador: 'No',

      floracion: 'Media (septiembre)', rendimiento: 1500,

      nota: 'Plantación joven, entrando en plena producción.' }

  ],

  fases: [

    { fase: 'Caída de la hoja', mes: 'mayo - junio',

      detalle: 'La hoja cae. Se aprovecha para podar y retirar el material vegetal del huerto.' },

    { fase: 'Reposo de reservas', mes: 'junio - julio',

      detalle: 'La planta repone las reservas del año anterior antes de la floración.' },

    { fase: 'Floración', mes: 'agosto - septiembre',

      detalle: 'La floración femenina y masculina coincidir define el cuajado. Se necesita variedad polinizadora.' },

    { fase: 'Cuajado y crecimiento', mes: 'septiembre - diciembre',

      detalle: 'El fruto se desarrolla y engorda. La demanda de agua y de potasio es máxima.' },

    { fase: 'Madurez y cosecha', mes: 'enero - febrero',

      detalle: 'El fruto cae de forma natural. Se cosecha en verde y se lleva a bodega de secado.' },

    { fase: 'Reposo vegetativo', mes: 'febrero - mayo',

      detalle: 'La planta está dormida. Es el momento de la poda, la fertilización de fondo y la reparación de copas.' }

  ],

  labores: [

    { periodo: 'Febrero - marzo', labor: 'Poda de formación y renovación',

      detalle: 'Eliminar chupones, ramas improductivas y ramas dañadas. Desinfectar herramientas al cambiar de hilera.',

      momento: 'Antes de la floración', responsable: 'C. Rojas' },

    { periodo: 'Marzo', labor: 'Fertilización de fondo',

      detalle: 'Aplicación de compost y fertilizante mineral a 20-30 cm de profundidad.',

      momento: 'En reposo vegetativo', responsable: 'C. Rojas' },

    { periodo: 'Abril - mayo', labor: 'Control de malezas y cubierta vegetal',

      detalle: 'Siembra de cubierta entre hileras para conservar humedad y evitar erosión.',

      momento: 'Antes de las lluvias', responsable: 'M. Soto' },

    { periodo: 'Mayo - junio', labor: 'Poda sanitaria',

      detalle: 'Retirar ramas con muerte apical o daño de conejo. Aplicar pasta cicatrizante en cortes grandes.',

      momento: 'Después de la caída de la hoja', responsable: 'C. Rojas' },

    { periodo: 'Julio - agosto', labor: 'Fertilización nitrogenada',

      detalle: 'Aporte de nitrógeno para el crecimiento vegetativo y la reposición de reservas.',

      momento: 'Antes del llenado del fruto', responsable: 'C. Rojas' },

    { periodo: 'Agosto - septiembre', labor: 'Monitoreo de floración',

      detalle: 'Registro de la fecha de floración por variedad y conteo de flores masculinas.',

      momento: 'Semana de floración', responsable: 'M. Soto' },

    { periodo: 'Octubre - noviembre', labor: 'Fertilización potásica',

      detalle: 'Potasio para el llenado y la calidad de la semilla. Aplicar fraccionado.',

      momento: 'Segundo semestre', responsable: 'C. Rojas' },

    { periodo: 'Diciembre - enero', labor: 'Riego de verano',

      detalle: 'Riego sostenido durante el período de mayor demanda de agua.',

      momento: 'Verano', responsable: 'M. Soto' },

    { periodo: 'Enero - febrero', labor: 'Cosecha',

      detalle: 'Recolección manual, acopio en bins y traslado a bodega de secado.',

      momento: 'Febrero', responsable: 'Todo el equipo' },

    { periodo: 'Febrero', labor: 'Poda de mantención y revisión sanitaria',

      detalle: 'Limpieza de la copa, control de chupones y revisión del estado sanitario de cada planta.',

      momento: 'Después de la cosecha', responsable: 'C. Rojas' }

  ],

  plagas: [

    { nombre: 'Falta de polinización', tipo: 'Abiótica', gravedad: 'Alta',

      detalle: 'Falta de polinizadores o floración desfasada entre variedades. Es la principal causa de bajo cuajado.',

      control: 'Mantener al menos un 20 % de superficie con variedad polinizadora y comparar fechas de floración cada año.' },

    { nombre: 'Chupón', tipo: 'Plaga', gravedad: 'Media',

      detalle: 'Brote adventicio en la base que compite por la savia y retiene humedad.',

      control: 'Poda y destrucción en verano, con sellado de pasta cicatrizante.' },

    { nombre: 'Oidio', tipo: 'Enfermedad', gravedad: 'Alta',

      detalle: 'Polvo blanco que afecta la floración y el cuajado. Favorece la humedad alta.',

      control: 'Fungicida sistémico al inicio de la floración, mayor aireación de la copa y control de la humedad.' },

    { nombre: 'Viruela del avellano', tipo: 'Enfermedad', gravedad: 'Alta',

      detalle: 'Hongo que bloquea los vasos conductores de la madera. Se transmite por insectos y herramientas.',

      control: 'Retirar y destruir el material infectado, desinfectar herramientas y controlar los insectos vectores.' },

    { nombre: 'Manchas foliares', tipo: 'Enfermedad', gravedad: 'Media',

      detalle: 'Defoliación prematura en primavera.',

      control: 'Fungicidas preventivos y poda que favorezca la circulación de aire.' },

    { nombre: 'Conejo y liebre', tipo: 'Plaga', gravedad: 'Media',

      detalle: 'Dañan la corteza de las ramas jóvenes y la plantación nueva.',

      control: 'Cercos de protección, malla individual en plantas nuevas y repelentes.' }

  ],

  climaRequisitos: [

    { parametro: 'Suma térmica', requerimiento: '950 a 1.100 °C', estado: 'Cumple',

      nota: 'La zona sur acumula cerca de 1.000 °C, suficiente para el llenado completo de la semilla.' },

    { parametro: 'Heladas en floración', requerimiento: '4 a 7 heladas suaves al año', estado: 'Vigilar',

      nota: 'El daño por helada durante la floración es la principal causa de bajo cuajado.' },

    { parametro: 'Lluvia anual', requerimiento: '1.000 a 1.400 mm', estado: 'Cumple',

      nota: 'El período seco de verano obliga a suplementar con riego.' },

    { parametro: 'Viento', requerimiento: 'Protección en laderas expuestas', estado: 'Vigilar',

      nota: 'Rachas sobre 40 km/h en verano pueden quebrar ramas y soltar frutos.' }

  ],

  produccion: [

    { temporada: '2022', hectareas: 16, rendimiento: 1750, produccion: 28000, precio: 2350, ingreso: 65800000 },

    { temporada: '2023', hectareas: 16, rendimiento: 1820, produccion: 29120, precio: 2600, ingreso: 75712000 },

    { temporada: '2024', hectareas: 16, rendimiento: 1900, produccion: 30400, precio: 2450, ingreso: 74480000 },

    { temporada: '2025', hectareas: 16, rendimiento: 1980, produccion: 31680, precio: 2700, ingreso: 85536000 },

    { temporada: '2026', hectareas: 16, rendimiento: 2050, produccion: 32800, precio: 2800, ingreso: 91840000 }

  ],

  documentos: [

    { titulo: 'Plan de manejo agronómico 2026', archivo: 'pdfs/avellanos/plan-manejo-2026.pdf',

      descripcion: 'Calendario de labores, dosis de fertilización y protocolo fitosanitario de la temporada.',

      fecha: '2026-01-10', seccion: 'Avellanos', tags: ['plan', '2026'] },

    { titulo: 'Ficha técnica de variedades', archivo: 'pdfs/avellanos/ficha-variedades.pdf',

      descripcion: 'Comparativo de polinizadores, fechas de floración y rendimiento por variedad.',

      fecha: '2025-11-20', seccion: 'Avellanos', tags: ['variedades'] },

    { titulo: 'Registro de floración y cuajado', archivo: 'pdfs/avellanos/registro-floracion.pdf',

      descripcion: 'Bitácora de floración por variedad y estimación del porcentaje de cuajado.',

      fecha: '2026-09-15', seccion: 'Avellanos', tags: ['floración', '2026'] },

    { titulo: 'Protocolo de control de oidio', archivo: 'pdfs/avellanos/protocolo-oidio.pdf',

      descripcion: 'Protocolo de aplicación y control del oidio y otras enfermedades de la hoja.',

      fecha: '2026-04-02', seccion: 'Avellanos', tags: ['sanidad'] }

  ]

};

