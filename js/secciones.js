(function () {
  'use strict';

  const C = window.Campo;

  function n(valor, decimales) {
    if (decimales === undefined) decimales = 0;
    if (valor === null || valor === undefined || valor === '') return '-';
    if (typeof valor === 'string') return valor;
    return C.num(valor, decimales);
  }

  function tabla(titulo, columnas, filas, numCols, editor) {
    if (!numCols) numCols = [];
    return { titulo: titulo, columnas: columnas, filas: filas, numCols: numCols, nota: '', editor: editor || null };
  }

  function meta(seccion, lista, items) {
    return { seccion: seccion, lista: lista, items: items || [] };
  }

  function avellanos() {
    const d = window.DATOS_AVELLANOS;
    if (!d) return null;
    const c = d.cifras || {};
    const stats = [
      { valor: n(c.superficie), unidad: 'ha', etiqueta: 'Superficie plantada' },
      { valor: n(c.sectores), unidad: 'sectores', etiqueta: 'Sectores de riego' },
      { valor: n(c.plantasTotales), unidad: 'plantas', etiqueta: 'Plantas en pie' },
      { valor: n(c.densidad), unidad: 'plantas/ha', etiqueta: 'Densidad' },
      { valor: c.marco, etiqueta: 'Marco de plantación' },
      { valor: n(c.vidaProductiva), unidad: 'años', etiqueta: 'Vida productiva' }
    ];
    const tablas = [
      tabla('Variedades plantadas', ['Variedad', 'Superficie (ha)', 'Plantación', 'Floración', 'Polinizador', 'Rendimiento (kg/ha)', 'Notas'],
        (d.variedades || []).map(function (v) { return [v.nombre, n(v.superficie, 1), v.plantacion, v.floracion, v.polinizador, n(v.rendimiento), v.nota]; }),
        [1, 2, 5], meta('avellanos', 'variedades', d.variedades)),
      tabla('Fases fenológicas', ['Fase', 'Mes', 'Detalle'],
        (d.fases || []).map(function (f) { return [f.fase, f.mes, f.detalle]; }),
        [], meta('avellanos', 'fases', d.fases)),
      tabla('Labores del año', ['Periodo', 'Labor', 'Momento', 'Responsable', 'Detalle'],
        (d.labores || []).map(function (l) { return [l.periodo, l.labor, l.momento, l.responsable, l.detalle]; }),
        [], meta('avellanos', 'labores', d.labores)),
      tabla('Plagas y enfermedades', ['Nombre', 'Tipo', 'Gravedad', 'Detalle', 'Control'],
        (d.plagas || []).map(function (p) { return [p.nombre, p.tipo, p.gravedad, p.detalle, p.control]; }),
        [], meta('avellanos', 'plagas', d.plagas)),
      tabla('Requisitos climáticos', ['Parámetro', 'Requerimiento', 'Estado', 'Nota'],
        (d.climaRequisitos || []).map(function (r) { return [r.parametro, r.requerimiento, r.estado, r.nota]; }),
        [], meta('avellanos', 'climaRequisitos', d.climaRequisitos)),
      tabla('Producción por temporada', ['Temporada', 'Hectáreas', 'Rendimiento (kg/ha)', 'Producción (kg)', 'Precio ($/kg)', 'Ingreso ($)'],
        (d.produccion || []).map(function (p) { return [p.temporada, n(p.hectareas), n(p.rendimiento), n(p.produccion), n(p.precio), n(p.ingreso)]; }),
        [1, 2, 3, 4, 5], meta('avellanos', 'produccion', d.produccion))
    ];
    d.tablas = tablas;
    return {
      clave: 'avellanos', titulo: 'Avellanos', resumen: d.introduccion,
      stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [],
      editorAjustes: 'avellanos'
    };
  }

  function ovejas() {
    const d = window.DATOS_OVEJAS;
    if (!d) return null;
    const c = d.cifras || {};
    const repro = d.reproduction || {};
    const stats = [
      { valor: n(c.animales), unidad: 'ovejas', etiqueta: 'Animales totales' },
      { valor: n(c.hembras), etiqueta: 'Hembras' },
      { valor: n(c.machos), etiqueta: 'Machos' },
      { valor: n(c.pesoPromedio), unidad: 'kg', etiqueta: 'Peso promedio' },
      { valor: n(c.UA), unidad: 'UA', etiqueta: 'Unidades animal' },
      { valor: n(c.potrero), unidad: 'ha', etiqueta: 'Potrero' }
    ];
    const tablas = [
      tabla('Composición del rebaño', ['Categoría', 'Cantidad', 'Peso (kg)', 'Nota'],
        (d.composicion || []).map(function (x) { return [x.categoria, n(x.cantidad), n(x.peso), x.nota]; }),
        [1, 2], meta('ovejas', 'composicion', d.composicion)),
      tabla('Calendario reproductivo', ['Etapa', 'Detalle'], [
        ['Celo', repro.celo], ['Monta', repro.monta], ['Gestación', repro.permanecen],
        ['Parto', repro.parto], ['Destete', repro.destete], ['Prolificidad', repro.prolificidad],
        ['Supervivencia', repro.SUPERVIVENCIA || repro.supervivencia]
      ]),
      tabla('Manejo sanitario', ['Mes', 'Tarea', 'Producto', 'Dosis', 'Responsable'],
        (d.manejoSanitario || []).map(function (m) { return [m.mes, m.tarea, m.producto, m.dosis, m.responsable]; }),
        [], meta('ovejas', 'manejoSanitario', d.manejoSanitario)),
      tabla('Plan de pastoreo', ['Periodo', 'Destino', 'Carga', 'Nota'],
        (d.pastoreo || []).map(function (p) { return [p.periodo, p.destino, p.carga, p.nota]; }),
        [], meta('ovejas', 'pastoreo', d.pastoreo)),
      tabla('Producción del rebaño', ['Temporada', 'Corderos', 'Tasa de nacimiento', 'Peso al destete (kg)', 'Vendidos', 'Precio ($)'],
        (d.produccion || []).map(function (p) { return [p.temporada, n(p.corderos), n(p.tasaNacimiento, 2), n(p.pesoDestete), n(p.venta), n(p.precio)]; }),
        [1, 2, 3, 4, 5], meta('ovejas', 'produccion', d.produccion)),
      tabla('Indicadores de manejo', ['Indicador', 'Valor', 'Meta', 'Estado'],
        (d.indicadores || []).map(function (i) { return [i.nombre, i.valor, i.meta, i.estado]; }),
        [], meta('ovejas', 'indicadores', d.indicadores))
    ];
    d.tablas = tablas;
    return {
      clave: 'ovejas', titulo: 'Ovejas', resumen: d.introduccion,
      stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [],
      editorAjustes: 'ovejas'
    };
  }

  function riego() {
    const d = window.DATOS_RIEGO;
    if (!d) return null;
    const operativos = (d.sectores || []).filter(function (s) { return s.operativo; }).length;
    const stats = [
      { valor: n(d.caudalPozo), unidad: 'm³/h', etiqueta: 'Caudal del pozo' },
      { valor: n(d.volumenTranque), unidad: 'm³', etiqueta: 'Volumen del tranque' },
      { valor: n(d.eficiencia), unidad: '%', etiqueta: 'Eficiencia' },
      { valor: n(d.caudalEmisor), unidad: 'L/h', etiqueta: 'Caudal por gotero' },
      { valor: n(d.horasBombeoDia), unidad: 'h', etiqueta: 'Bombeo diario' },
      { valor: n(operativos), unidad: 'de ' + (d.sectores || []).length, etiqueta: 'Sectores con goteo' }
    ];
    const tablas = [
      tabla('Parámetros del sistema', ['Parámetro', 'Valor'], [
        ['Sistema', d.sistema], ['Fuente de agua', d.fuente], ['Caudal del pozo', n(d.caudalPozo) + ' m³/h'],
        ['Volumen del tranque', n(d.volumenTranque) + ' m³'], ['Eficiencia', n(d.eficiencia) + ' %'],
        ['Caudal del emisor', n(d.caudalEmisor) + ' L/h'], ['Goteros por planta', n(d.goterosPorPlanta)],
        ['Horas de bombeo al día', n(d.horasBombeoDia) + ' h'], ['Presión de operación', n(d.presionOperacion, 1) + ' bar'],
        ['Filtro', d.filtro], ['Longitud de línea', n(d.longitudLinea) + ' m'],
        ['Última revisión', d.ultimaRevision], ['Próxima revisión', d.proximaRevision]
      ]),
      tabla('Sectores de riego', ['Sector', 'Superficie (ha)', 'Estado', 'Líneas', 'Caudal (m³/h)', 'Programación', 'Notas'],
        (d.sectores || []).map(function (s) { return [s.nombre, n(s.superficie), s.operativo ? 'Operativo' : 'Sin riego', n(s.lineas), n(s.caudal, 1), s.programacion, s.notas]; }),
        [1, 3, 4], meta('riego', 'sectores', d.sectores)),
      tabla('Balance hídrico mensual', ['Mes', 'ETc (mm)', 'Lluvia (mm)', 'Neto (mm)', 'Volumen (m³)'],
        (d.balance || []).map(function (b) { return [b.mes, n(b.etc), n(b.lluvia), n(b.neto), n(b.volumen)]; }),
        [1, 2, 3, 4], meta('riego', 'balance', d.balance)),
      tabla('Mantenimiento programado', ['Tarea', 'Frecuencia', 'Última ejecución'],
        (d.mantenimiento || []).map(function (m) { return [m.tarea, m.frecuencia, m.ultimo]; }),
        [], meta('riego', 'mantenimiento', d.mantenimiento)),
      tabla('Registros de riego', ['Fecha', 'Sector', 'Horas', 'Volumen (m³)', 'Caudal (m³/h)', 'Operario'],
        (d.registros || []).map(function (r) { return [r.fecha, r.sector, n(r.horas, 1), n(r.volumen), n(r.caudal, 1), r.operario]; }),
        [2, 3, 4], meta('riego', 'registros', d.registros))
    ];
    d.tablas = tablas;
    return {
      clave: 'riego', titulo: 'Riego', resumen: d.sistema + '. ' + d.fuente + '.',
      stats: stats, tablas: tablas, documentos: [], avisos: [],
      editorAjustes: 'riego'
    };
  }

  function maquinaria() {
    const d = window.DATOS_MAQUINARIA;
    if (!d) return null;
    const t = d.tractor || {};
    const litros = (d.combustible || []).reduce(function (a, b) { return a + (b.litros || 0); }, 0);
    const costo = (d.combustible || []).reduce(function (a, b) { return a + (b.costo || 0); }, 0);
    const stats = [
      { valor: (t.marca || '') + ' ' + (t.modelo || ''), etiqueta: 'Tractor principal' },
      { valor: n(t.hp), unidad: 'HP', etiqueta: 'Potencia' },
      { valor: n(t.horas), unidad: 'h', etiqueta: 'Horas de uso' },
      { valor: n((d.implementos || []).length), etiqueta: 'Implementos' },
      { valor: n((d.herramientas || []).length), etiqueta: 'Herramientas' },
      { valor: n(litros), unidad: 'L', etiqueta: 'Diésel al año' },
      { valor: '$ ' + n(costo), etiqueta: 'Costo anual de combustible' }
    ];
    const tablas = [
      tabla('Tractor principal', ['Característica', 'Valor'], [
        ['Marca', t.marca], ['Modelo', t.modelo], ['Año', n(t['año'])], ['Potencia', n(t.hp) + ' HP'],
        ['Horas', n(t.horas) + ' h'], ['Tracción', t.traccion], ['Neumáticos', t['neumáticos']],
        ['Combustible', t.combustible], ['Última revisión', t.ultimaRevision],
        ['Próxima revisión', t.proximaRevision], ['Notas', t.notas]
      ]),
      tabla('Implementos', ['Nombre', 'Marca', 'Modelo', 'Año', 'Estado', 'Horas', 'Ubicación', 'Uso', 'Revisión'],
        (d.implementos || []).map(function (i) { return [i.nombre, i.marca, i.modelo, n(i['año']), i.estado, n(i.horasUso), i.ubicacion, i.uso, i.revision]; }),
        [3, 5], meta('maquinaria', 'implementos', d.implementos)),
      tabla('Herramientas', ['Nombre', 'Cantidad', 'Estado', 'Uso'],
        (d.herramientas || []).map(function (h) { return [h.nombre, n(h.cantidad), h.estado, h.uso]; }),
        [1], meta('maquinaria', 'herramientas', d.herramientas)),
      tabla('Consumo de combustible', ['Mes', 'Litros', 'Costo ($)', 'Observación'],
        (d.combustible || []).map(function (c) { return [c.mes, n(c.litros), n(c.costo), c.observacion]; }),
        [1, 2], meta('maquinaria', 'combustible', d.combustible)),
      tabla('Mantenimiento realizado', ['Fecha', 'Equipo', 'Tipo', 'Trabajo', 'Costo ($)', 'Responsable'],
        (d.mantenimiento || []).map(function (m) { return [m.fecha, m.equipo, m.tipo, m.trabajo, n(m.costo), m.responsable]; }),
        [4], meta('maquinaria', 'mantenimiento', d.mantenimiento))
    ];
    d.tablas = tablas;
    return {
      clave: 'maquinaria', titulo: 'Maquinaria', resumen: d.introduccion,
      stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [],
      editorAjustes: 'maquinaria'
    };
  }

  window.CampoSecciones = { avellanos: avellanos, ovejas: ovejas, riego: riego, maquinaria: maquinaria };
})();
