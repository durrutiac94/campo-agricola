/* ==========================================================================

   data/documentos.js - índice de documentos PDF del campo.

   Los archivos van en pdfs/{avellanos,ovejas,riego,maquinaria}/

   ========================================================================== */

window.DATOS_DOCUMENTOS = [

  // Avellanos

  { titulo: 'Plan de manejo agronómico 2026', archivo: 'pdfs/avellanos/plan-manejo-2026.pdf',

    descripcion: 'Calendario de labores, dosis de fertilización y protocolo fitosanitario de la temporada.',

    fecha: '2026-01-10', seccion: 'Avellanos', tags: ['plan', '2026', 'agronomía'] },

  { titulo: 'Ficha técnica de variedades', archivo: 'pdfs/avellanos/ficha-variedades.pdf',

    descripcion: 'Comparativo de polinizadores, fechas de floración y rendimiento por variedad.',

    fecha: '2025-11-20', seccion: 'Avellanos', tags: ['variedades', 'polinización'] },

  { titulo: 'Registro de floración y cuajado', archivo: 'pdfs/avellanos/registro-floracion.pdf',

    descripcion: 'Bitácora de floración por variedad y estimación del porcentaje de cuajado.',

    fecha: '2026-09-15', seccion: 'Avellanos', tags: ['floración', 'cuajado'] },

  { titulo: 'Protocolo de control de oidio', archivo: 'pdfs/avellanos/protocolo-oidio.pdf',

    descripcion: 'Protocolo de aplicación y control del oidio y otras enfermedades de la hoja.',

    fecha: '2026-04-02', seccion: 'Avellanos', tags: ['sanidad', 'hongos'] },

  // Ovejas

  { titulo: 'Plan sanitario anual del rebaño', archivo: 'pdfs/ovejas/plan-sanitario.pdf',

    descripcion: 'Calendario de vacunación, desparasitación y control sanitario con fechas y productos.',

    fecha: '2026-02-01', seccion: 'Ovejas', tags: ['sanidad', 'plan'] },

  { titulo: 'Registro de parideras', archivo: 'pdfs/ovejas/registro-parideras.pdf',

    descripcion: 'Parto por parto, peso al nacimiento, supervivencia y causa de pérdida.',

    fecha: '2025-10-15', seccion: 'Ovejas', tags: ['parideras', 'reproducción'] },

  { titulo: 'Ficha de pastoreo y balance forrajero', archivo: 'pdfs/ovejas/ficha-pastoreo.pdf',

    descripcion: 'Carga animal, consumo estimado y calendario de suplementación del rebaño.',

    fecha: '2026-01-05', seccion: 'Ovejas', tags: ['pastoreo', 'forraje'] },

  { titulo: 'Guía de manejo en sistema de pastoreo', archivo: 'pdfs/ovejas/guia-pastoreo.pdf',

    descripcion: 'Rotación de potreros, agua, sombra y manejo del pastoreo bajo avellanos.',

    fecha: '2025-09-12', seccion: 'Ovejas', tags: ['guía', 'pastoreo'] },

  // Riego

  { titulo: 'Plan de riego 2026', archivo: 'pdfs/riego/plan-riego-2026.pdf',

    descripcion: 'Calendario de riego por sector, horas, caudal y observaciones.',

    fecha: '2026-01-08', seccion: 'Riego', tags: ['plan', 'riego'] },

  { titulo: 'Ficha de mantenimiento del sistema de goteo', archivo: 'pdfs/riego/ficha-mantenimiento-goteo.pdf',

    descripcion: 'Lavado de filtros, revisión de goteros, presión y registro de mantenciones.',

    fecha: '2025-11-15', seccion: 'Riego', tags: ['mantención', 'goteo'] },

  { titulo: 'Aforo del pozo profundo', archivo: 'pdfs/riego/aforo-pozo.pdf',

    descripcion: 'Aforos trimestrales, caudal, nivel estático y dinámico del pozo.',

    fecha: '2026-03-12', seccion: 'Riego', tags: ['pozo', 'aforo'] },

  { titulo: 'Esquema del sistema de riego', archivo: 'pdfs/riego/esquema-riego.pdf',

    descripcion: 'Esquema general con sectores, válvulas, filtros y tranque.',

    fecha: '2025-10-20', seccion: 'Riego', tags: ['esquema', 'sector'] },

  // Maquinaria

  { titulo: 'Manual de operación del tractor John Deere 5075M', archivo: 'pdfs/maquinaria/manual-5075m.pdf',

    descripcion: 'Manual de uso, lubricación, tabla de mantenimiento y procedimientos de seguridad.',

    fecha: '2020-06-01', seccion: 'Maquinaria', tags: ['manual', 'tractor'] },

  { titulo: 'Plan de mantenimiento 2026', archivo: 'pdfs/maquinaria/plan-mantenimiento.pdf',

    descripcion: 'Calendario de mantenciones preventivas por equipo, repuestos y horas de servicio.',

    fecha: '2026-01-08', seccion: 'Maquinaria', tags: ['plan', 'mantención'] },

  { titulo: 'Ficha de combustible por mes', archivo: 'pdfs/maquinaria/ficha-combustible.pdf',

    descripcion: 'Consumo de diésel por máquina, litros, costo y observaciones.',

    fecha: '2026-03-05', seccion: 'Maquinaria', tags: ['combustible'] },

  { titulo: 'Hoja de revisión de pulverizador', archivo: 'pdfs/maquinaria/hoja-revision-pulverizador.pdf',

    descripcion: 'Checklist de calibración, boquillas, presión y registro de aplicaciones.',

    fecha: '2026-03-05', seccion: 'Maquinaria', tags: ['pulverizador', 'calibración'] }

];

