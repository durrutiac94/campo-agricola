(function () {
  'use strict';

  const C = window.Campo;

  function n(valor, decimales) {
    if (decimales === undefined) decimales = 0;
    if (valor === null || valor === undefined || valor === '') return '-';
    if (typeof valor === 'string') return valor;
    return C.num(valor, decimales);
  }

  function tabla(titulo, columnas, filas, numCols) {
    if (!numCols) numCols = [];
    return { titulo: titulo, columnas: columnas, filas: filas, numCols: numCols, nota: '' };
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
      { valor: c.marco, etiqueta: 'Marco de plantacion' },
      { valor: n(c.vidaProductiva), unidad: 'anos', etiqueta: 'Vida productiva' }
    ];
    const tablas = [
      tabla('Variedades plantadas', ['Variedad', 'Superficie (ha)', 'Plantacion', 'Floracion', 'Polinizador', 'Rendimiento (kg/ha)', 'Notas'],
        (d.variedades || []).map(function(v){ return [v.nombre, n(v.superficie,1), v.plantacion, v.floracion, v.polinizador, n(v.rendimiento), v.nota]; }),
        [1,2,5]),
      tabla('Fases fenologicas', ['Fase', 'Mes', 'Detalle'], (d.fases || []).map(function(f){ return [f.fase, f.mes, f.detalle]; })),
      tabla('Labores del ano', ['Periodo', 'Labor', 'Momento', 'Responsable', 'Detalle'], (d.labores || []).map(function(l){ return [l.periodo, l.labor, l.momento, l.responsable, l.detalle]; })),
      tabla('Plagas y enfermedades', ['Nombre', 'Tipo', 'Gravedad', 'Detalle', 'Control'], (d.plagas || []).map(function(p){ return [p.nombre, p.tipo, p.gravedad, p.detalle, p.control]; })),
      tabla('Requisitos climaticos', ['Parametro', 'Requerimiento', 'Estado', 'Nota'], (d.climaRequisitos || []).map(function(r){ return [r.parametro, r.requerimiento, r.estado, r.nota]; })),
      tabla('Produccion por temporada', ['Temporada', 'Hectareas', 'Rendimiento (kg/ha)', 'Produccion (kg)', 'Precio ($/kg)', 'Ingreso ($)'],
        (d.produccion || []).map(function(p){ return [p.temporada, n(p.hectareas), n(p.rendimiento), n(p.produccion), n(p.precio), n(p.ingreso)]; }),
        [1,2,3,4,5])
    ];
    d.tablas = tablas;
    return { clave: 'avellanos', titulo: 'Avellanos', resumen: d.introduccion, stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [] };
  }

  function ovejas() {
    const d = window.DATOS_OVEJAS;
    if (!d) return null;
    const c = d.cifras || {};
    const stats = [
      { valor: n(c.animales), unidad: 'ovejas', etiqueta: 'Animales totales' },
      { valor: n(c.hembras), etiqueta: 'Hembras' },
      { valor: n(c.machos), etiqueta: 'Machos' },
      { valor: n(c.pesoPromedio), unidad: 'kg', etiqueta: 'Peso promedio' },
      { valor: n(c.UA), unidad: 'UA', etiqueta: 'Unidades animal' },
      { valor: n(c.potrero), unidad: 'ha', etiqueta: 'Potrero' }
    ];
    const tablas = [
      tabla('Composicion del rebano', ['Categoria', 'Cantidad', 'Peso (kg)', 'Nota'], (d.composicion || []).map(function(x){ return [x.categoria, n(x.cantidad), n(x.peso), x.nota]; }), [1,2]),
      tabla('Calendario reproductivo', ['Etapa', 'Detalle'], [
        ['Celo', (d.reproduction||{}).celo], ['Monta', (d.reproduction||{}).monta], ['Gestacion', (d.reproduction||{}).permanecen],
        ['Parto', (d.reproduction||{}).parto], ['Destete', (d.reproduction||{}).destete], ['Prolificidad', (d.reproduction||{}).prolificidad], ['Supervivencia', (d.reproduction||{}).SUPERVIVENCIA || (d.reproduction||{}).supervivencia]
      ]),
      tabla('Manejo sanitario', ['Mes', 'Tarea', 'Producto', 'Dosis', 'Responsable'], (d.manejoSanitario || []).map(function(m){ return [m.mes, m.tarea, m.producto, m.dosis, m.responsable]; })),
      tabla('Plan de pastoreo', ['Periodo', 'Destino', 'Carga', 'Nota'], (d.pastoreo || []).map(function(p){ return [p.periodo, p.destino, p.carga, p.nota]; })),
      tabla('Produccion del rebano', ['Temporada', 'Corderos', 'Tasa de nacimiento', 'Peso al destete (kg)', 'Vendidos', 'Precio ($)'],
        (d.produccion || []).map(function(p){ return [p.temporada, n(p.corderos), n(p.tasaNacimiento,2), n(p.pesoDestete), n(p.venta), n(p.precio)]; }), [1,2,3,4,5]),
      tabla('Indicadores de manejo', ['Indicador', 'Valor', 'Meta', 'Estado'], (d.indicadores || []).map(function(i){ return [i.nombre, i.valor, i.meta, i.estado]; }))
    ];
    d.tablas = tablas;
    return { clave: 'ovejas', titulo: 'Ovejas', resumen: d.introduccion, stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [] };
  }

  function riego() {
    const d = window.DATOS_RIEGO;
    if (!d) return null;
    const operativos = (d.sectores||[]).filter(function(s){ return s.operativo; }).length;
    const stats = [
      { valor: n(d.caudalPozo), unidad: 'm3/h', etiqueta: 'Caudal del pozo' },
      { valor: n(d.volumenTranque), unidad: 'm3', etiqueta: 'Volumen del tranque' },
      { valor: n(d.eficiencia), unidad: '%', etiqueta: 'Eficiencia' },
      { valor: n(d.caudalEmisor), unidad: 'L/h', etiqueta: 'Caudal por gotero' },
      { valor: n(d.horasBombeoDia), unidad: 'h', etiqueta: 'Bombeo diario' },
      { valor: n(operativos), unidad: 'de ' + (d.sectores||[]).length, etiqueta: 'Sectores con goteo' }
    ];
    const tablas = [
      tabla('Parametros del sistema', ['Parametro', 'Valor'], [
        ['Sistema', d.sistema], ['Fuente de agua', d.fuente], ['Caudal del pozo', n(d.caudalPozo)+' m3/h'], ['Volumen del tranque', n(d.volumenTranque)+' m3'],
        ['Eficiencia', n(d.eficiencia)+' %'], ['Caudal del emisor', n(d.caudalEmisor)+' L/h'], ['Goteros por planta', n(d.goterosPorPlanta)],
        ['Horas de bombeo al dia', n(d.horasBombeoDia)+' h'], ['Presion de operacion', n(d.presionOperacion,1)+' bar'], ['Filtro', d.filtro],
        ['Longitud de linea', n(d.longitudLinea)+' m'], ['Ultima revision', d.ultimaRevision], ['Proxima revision', d.proximaRevision]
      ]),
      tabla('Sectores de riego', ['Sector', 'Superficie (ha)', 'Estado', 'Lineas', 'Caudal (m3/h)', 'Programacion', 'Notas'],
        (d.sectores||[]).map(function(s){ return [s.nombre, n(s.superficie), s.operativo?'Operativo':'Sin riego', n(s.lineas), n(s.caudal,1), s.programacion, s.notas]; }), [1,3,4]),
      tabla('Balance hidrico mensual', ['Mes', 'ETc (mm)', 'Lluvia (mm)', 'Neto (mm)', 'Volumen (m3)'], (d.balance||[]).map(function(b){ return [b.mes, n(b.etc), n(b.lluvia), n(b.neto), n(b.volumen)]; }), [1,2,3,4]),
      tabla('Mantenimiento programado', ['Tarea', 'Frecuencia', 'Ultima ejecucion'], (d.mantenimiento||[]).map(function(m){ return [m.tarea, m.frecuencia, m.ultimo]; })),
      tabla('Registros de riego', ['Fecha', 'Sector', 'Horas', 'Volumen (m3)', 'Caudal (m3/h)', 'Operario'], (d.registros||[]).map(function(r){ return [r.fecha, r.sector, n(r.horas,1), n(r.volumen), n(r.caudal,1), r.operario]; }), [2,3,4])
    ];
    d.tablas = tablas;
    return { clave: 'riego', titulo: 'Riego', resumen: d.sistema + '. ' + d.fuente + '.', stats: stats, tablas: tablas, documentos: [], avisos: [] };
  }

  function maquinaria() {
    const d = window.DATOS_MAQUINARIA;
    if (!d) return null;
    const t = d.tractor || {};
    const litros = (d.combustible||[]).reduce(function(a,b){ return a + (b.litros||0); }, 0);
    const costo = (d.combustible||[]).reduce(function(a,b){ return a + (b.costo||0); }, 0);
    const stats = [
      { valor: (t.marca||'') + ' ' + (t.modelo||''), etiqueta: 'Tractor principal' },
      { valor: n(t.hp), unidad: 'HP', etiqueta: 'Potencia' },
      { valor: n(t.horas), unidad: 'h', etiqueta: 'Horas de uso' },
      { valor: n((d.implementos||[]).length), etiqueta: 'Implementos' },
      { valor: n((d.herramientas||[]).length), etiqueta: 'Herramientas' },
      { valor: n(litros), unidad: 'L', etiqueta: 'Diesel por ano' },
      { valor: '$ ' + n(costo), etiqueta: 'Costo anual de combustible' }
    ];
    const tablas = [
      tabla('Tractor principal', ['Caracteristica', 'Valor'], [
        ['Marca', t.marca], ['Modelo', t.modelo], ['Ano', n(t.ano)], ['Potencia', n(t.hp)+' HP'], ['Horas', n(t.horas)+' h'], ['Traccion', t.traccion],
        ['Neumaticos', t.neumaticos], ['Combustible', t.combustible], ['Ultima revision', t.ultimaRevision], ['Proxima revision', t.proximaRevision], ['Notas', t.notas]
      ]),
      tabla('Implementos', ['Nombre', 'Marca', 'Modelo', 'Ano', 'Estado', 'Horas', 'Ubicacion', 'Uso', 'Revision'],
        (d.implementos||[]).map(function(i){ return [i.nombre, i.marca, i.modelo, n(i.ano), i.estado, n(i.horasUso), i.ubicacion, i.uso, i.revision]; }), [3,5]),
      tabla('Herramientas', ['Nombre', 'Cantidad', 'Estado', 'Uso'], (d.herramientas||[]).map(function(h){ return [h.nombre, n(h.cantidad), h.estado, h.uso]; }), [1]),
      tabla('Consumo de combustible', ['Mes', 'Litros', 'Costo ($)', 'Observacion'], (d.combustible||[]).map(function(c){ return [c.mes, n(c.litros), n(c.costo), c.observacion]; }), [1,2]),
      tabla('Mantenimiento realizado', ['Fecha', 'Equipo', 'Tipo', 'Trabajo', 'Costo ($)', 'Responsable'], (d.mantenimiento||[]).map(function(m){ return [m.fecha, m.equipo, m.tipo, m.trabajo, n(m.costo), m.responsable]; }), [4])
    ];
    d.tablas = tablas;
    return { clave: 'maquinaria', titulo: 'Maquinaria', resumen: d.introduccion, stats: stats, tablas: tablas, documentos: d.documentos || [], avisos: [] };
  }

  window.CampoSecciones = { avellanos: avellanos, ovejas: ovejas, riego: riego, maquinaria: maquinaria };
})();
