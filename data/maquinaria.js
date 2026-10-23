/* ==========================================================================

   data/maquinaria.js - maquinaria, implementos y mantención.

   ========================================================================== */

window.DATOS_MAQUINARIA = {

  introduccion: 'Parque de maquinaria reducido, enfocado a las labores del avellano: poda, ' +

                'fertilización, control de malezas, acarreo de cosecha y mantención general.',

  tractor: {

    marca: 'John Deere',

    modelo: '5075M',

    año: 2018,

    hp: 75,

    horas: 3450,

    traccion: '4x4',

    neumáticos: '13.6R24 / 18.4R30',

    ultimaRevision: '2026-03-10',

    proximaRevision: '2026-09-10',

    combustible: 'Diésel',

    notas: 'En buen estado. Revisiones al día con aceite, filtros y transmisión.'

  },

  implementos: [

    { nombre: 'Trituradora de rastrojos', marca: 'Taarup', modelo: 'T5-50', año: 2019,

      estado: 'Operativo', horasUso: 420, ubicacion: 'Galpón 1',

      uso: 'Trituración de chupones y restos de poda.', revision: '2026-02-15' },

    { nombre: 'Pulverizador de barra', marca: 'Hardi', modelo: 'Commander 1000', año: 2020,

      estado: 'Operativo', horasUso: 280, ubicacion: 'Galpón 1',

      uso: 'Aplicación de fungicidas y tratamientos fitosanitarios.', revision: '2026-03-05' },

    { nombre: 'Abonadora centrífuga', marca: 'Vicon', modelo: 'PS 303', año: 2019,

      estado: 'Operativo', horasUso: 190, ubicacion: 'Galpón 1',

      uso: 'Fertilización granulado y orgánica.', revision: '2025-12-20' },

    { nombre: 'Segadora rotativa', marca: 'Krone', modelo: 'AMT 320', año: 2018,

      estado: 'Operativo', horasUso: 350, ubicacion: 'Galpón 2',

      uso: 'Corte de cubierta vegetal y forraje.', revision: '2026-01-12' },

    { nombre: 'Rastra de dientes', marca: 'Kverneland', modelo: 'DX-15', año: 2017,

      estado: 'En reparación', horasUso: 680, ubicacion: 'Taller',

      uso: 'Descompactación y preparación de suelo.', revision: '2026-03-01' },

    { nombre: 'Remolque volquete', marca: 'Zunhammer', modelo: 'C18', año: 2018,

      estado: 'Operativo', horasUso: 260, ubicacion: 'Galpón 2',

      uso: 'Acarreo de poda, compost y cosecha.', revision: '2026-02-28' }

  ],

  herramientas: [

    { nombre: 'Tijeras de poda', cantidad: 6, estado: 'Operativo', uso: 'Poda manual y limpieza de copa' },

    { nombre: 'Sierra de pértiga', cantidad: 2, estado: 'Operativo', uso: 'Ramas altas y poda sanitaria' },

    { nombre: 'Motosierra', cantidad: 2, estado: 'Operativo', uso: 'Cortes gruesos y limpieza de ramas' },

    { nombre: 'Carro de recolección', cantidad: 4, estado: 'Operativo', uso: 'Traslado de frutos en el huerto' },

    { nombre: 'Bins plásticos', cantidad: 40, estado: 'Operativo', uso: 'Acopio y traslado a bodega' },

    { nombre: 'Báscula ganadera', cantidad: 1, estado: 'Operativo', uso: 'Pesaje de ovinos y corderos' }

  ],

  combustible: [

    { mes: 'Enero', litros: 450, costo: 675000, observacion: 'Cosecha y acarreo' },

    { mes: 'Febrero', litros: 380, costo: 570000, observacion: 'Post-cosecha y poda' },

    { mes: 'Marzo', litros: 320, costo: 480000, observacion: 'Fertilización y labranza ligera' },

    { mes: 'Abril', litros: 260, costo: 390000, observacion: 'Preparación y cubierta vegetal' },

    { mes: 'Mayo', litros: 180, costo: 270000, observacion: 'Poda sanitaria' },

    { mes: 'Junio', litros: 140, costo: 210000, observacion: 'Mantenimiento' },

    { mes: 'Julio', litros: 130, costo: 195000, observacion: 'Mantenimiento' },

    { mes: 'Agosto', litros: 150, costo: 225000, observacion: 'Preparación paridera' },

    { mes: 'Septiembre', litros: 200, costo: 300000, observacion: 'Mantenimiento general' },

    { mes: 'Octubre', litros: 230, costo: 345000, observacion: 'Control de malezas' },

    { mes: 'Noviembre', litros: 290, costo: 435000, observacion: 'Riego y labores generales' },

    { mes: 'Diciembre', litros: 360, costo: 540000, observacion: 'Riego y preparación' }

  ],

  mantenimiento: [

    { fecha: '2026-03-10', equipo: 'Tractor 5075M', tipo: 'Revisión general', trabajo: 'Cambio de aceite, filtros y revisión de frenos',

      costo: 185000, responsable: 'Taller propio' },

    { fecha: '2026-03-05', equipo: 'Pulverizador Hardi', tipo: 'Calibración', trabajo: 'Limpieza de boquillas y calibración de caudal',

      costo: 45000, responsable: 'M. Soto' },

    { fecha: '2026-03-01', equipo: 'Rastra de dientes', tipo: 'Reparación', trabajo: 'Reemplazo de muelles y soldadura',

      costo: 95000, responsable: 'Taller externo' },

    { fecha: '2026-02-28', equipo: 'Remolque volquete', tipo: 'Revisión', trabajo: 'Revisión de ejes, luces y neumáticos',

      costo: 38000, responsable: 'Taller propio' },

    { fecha: '2026-02-15', equipo: 'Trituradora de rastrojos', tipo: 'Afilado', trabajo: 'Afilado de martillos y revisión de correas',

      costo: 42000, responsable: 'Taller propio' },

    { fecha: '2026-01-12', equipo: 'Segadora rotativa', tipo: 'Engrase', trabajo: 'Engrase de rodamientos y correas',

      costo: 28000, responsable: 'Taller propio' }

  ],

  documentos: []

};

