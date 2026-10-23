/* ==========================================================================

   calculo.js - las cuatro calculadoras del sitio.

   Riego y balance hídrico - Costo por kg - Cosecha - Carga animal.

   Cada calculadora se declara con una configuración (campos + función de

   cálculo) y un renderizador genérico arma el formulario y los resultados.

   ========================================================================== */

(function () {

  'use strict';

  const C = window.Campo;

  /* ====================================================================== */

  /*  1. RIEGO Y BALANCE HÍDRICO                                            */

  /* ====================================================================== */

  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',

                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function clima() {

    const c = (window.DATOS_CAMPO && window.DATOS_CAMPO.clima) || {};

    return {

      etc: c.etc || [4.6, 4.2, 3.4, 2.3, 1.5, 1.0, 0.9, 1.2, 2.0, 2.8, 3.5, 4.2],

      lluvia: c.lluvia || [40, 45, 60, 90, 150, 180, 210, 170, 110, 80, 55, 45],

      coefLluvia: c.coefLluvia != null ? c.coefLluvia : 0.8

    };

  }

  /** Requerimiento hídrico neto mensual del huerto (mm). */

  function balanceMensual() {

    const c = clima();

    const out = [];

    for (let m = 0; m < 12; m++) {

      const dias = new Date(2026, m + 1, 0).getDate();

      const etc = c.etc[m] * dias;

      const lluviaEf = c.lluvia[m] * c.coefLluvia;

      out.push({

        mes: m,

        dias: dias,

        etc: etc,

        lluvia: c.lluvia[m],

        lluviaEf: lluviaEf,

        neto: Math.max(0, etc - lluviaEf)

      });

    }

    return out;

  }

  const calcRiego = {

    id: 'riego',

    titulo: 'Balance hídrico y capacidad de riego',

    descripcion: 'Calcula el caudal que exige cada sector, las horas de riego necesarias, ' +

                 'el caudal mínimo que debe entregar el pozo y cuántos días de autonomía ' +

                 'permite el tranque. Responde si los cuatro sectores son viables con tu ' +

                 'captación actual.',

    nota: 'Los valores de ETc y lluvia son referenciales para la zona sur de Chile. ' +

          'Ajusta el mes de evaluación y los parámetros de tu instalación.',

    campos: [

      { id: 'mes', etiqueta: 'Mes a evaluar', tipo: 'select', valor: 0,

        opciones: MESES.map((m, i) => ({ valor: i, texto: m })) },

      { id: 'sectores', etiqueta: 'Sectores de riego', tipo: 'sectores' },

      { id: 'plantasHa', etiqueta: 'Densidad de plantación', tipo: 'number', valor: 500,

        sufijo: 'plantas/ha', min: 50, max: 1500, paso: 10 },

      { id: 'goteros', etiqueta: 'Goteros por planta', tipo: 'number', valor: 4,

        sufijo: 'goteros', min: 1, max: 20, paso: 1 },

      { id: 'caudalEmisor', etiqueta: 'Caudal del emisor', tipo: 'number', valor: 4,

        sufijo: 'L/h', min: 1, max: 8, paso: 0.5 },

      { id: 'eficiencia', etiqueta: 'Eficiencia del sistema', tipo: 'number', valor: 90,

        sufijo: '%', min: 50, max: 100, paso: 1 },

      { id: 'caudalPozo', etiqueta: 'Caudal disponible del pozo', tipo: 'number', valor: 25,

        sufijo: 'm3/h', min: 1, max: 200, paso: 1 },

      { id: 'horasBombeo', etiqueta: 'Horas de bombeo al día', tipo: 'number', valor: 12,

        sufijo: 'h/día', min: 1, max: 24, paso: 1 },

      { id: 'horasRiego', etiqueta: 'Horas disponibles para regar', tipo: 'number', valor: 12,

        sufijo: 'h/día', min: 1, max: 24, paso: 1 },

      { id: 'volumenTranque', etiqueta: 'Capacidad del tranque', tipo: 'number', valor: 300,

        sufijo: 'm3', min: 0, max: 20000, paso: 10 },

      { id: 'diasEntreRiegos', etiqueta: 'Días entre riegos', tipo: 'number', valor: 3,

        sufijo: 'días', min: 1, max: 15, paso: 1 }

    ],

    calcular(v) {

      const bal = balanceMensual()[v.mes];

      const activos = v.sectores.filter((s) => s.operativo);

      const lineas = [];

      const porSector = [];

      // --- Caudal de diseño por sector

      const caudalPorHa = (v.plantasHa * v.goteros * v.caudalEmisor) / 1000; // m3/h/ha

      const eficiencia = v.eficiencia / 100;

      // --- Reparto del requerimiento del mes en riegos

      const mmDia = bal.neto / bal.dias;                            // mm/día a reponer

      const intervalo = Math.min(Math.max(1, v.diasEntreRiegos), bal.dias);

      const mmEvento = mmDia * intervalo;                            // mm por aplicación

      activos.forEach((s) => {

        const q = caudalPorHa * s.ha;                       // m3/h del sector

        const volumen = mmEvento * s.ha * 10;              // m3 (1 mm/ha = 10 m3)

        const horasRiego = volumen / (q * eficiencia);      // horas de riego del sector

        const caudalEfectivo = q * eficiencia;

        const demandaDiaria = (mmDia * s.ha * 10);

        porSector.push({

          nombre: s.nombre, ha: s.ha, q: q, caudalEfectivo: caudalEfectivo,

          volumen: volumen, horasRiego: horasRiego,

          demandaDiaria: demandaDiaria, caudalPorHa: caudalPorHa

        });

      });

      const totalHa = activos.reduce((a, s) => a + s.ha, 0);

      const superficieTotal = v.sectores.reduce((a, s) => a + s.ha, 0);

      const superficieOperativa = totalHa;

      // --- Demanda y tiempos

      const demandaCiclo = mmEvento * totalHa * 10;              // m3 por ronda de riego

      const demandaDiariaTotal = mmDia * totalHa * 10;           // m3/día que necesita el cultivo

      const horasRiegoTotales = porSector.reduce((a, s) => a + s.horasRiego, 0); // h por ronda

      const horasRiegoDiarias = horasRiegoTotales / intervalo;

      // Lo que hay que extraer del pozo es mayor que la demanda del cultivo,

      // porque el sistema entrega solo el porcentaje de eficiencia.

      const demandaBombeoDia = demandaDiariaTotal / eficiencia;  // m3/día a bombear

      const bombeoDiario = v.caudalPozo * v.horasBombeo;         // m3/día que entrega el pozo

      const caudalRequerido = demandaBombeoDia / v.horasBombeo;  // m3/h del pozo

      const horasBombeoNecesarias = demandaBombeoDia / v.caudalPozo;

      // --- Balance del tranque

      const flujoNeto = bombeoDiario - demandaBombeoDia;

      const autonomia = flujoNeto > 0 ? v.volumenTranque / flujoNeto : Infinity;

      // --- Cuántos sectores sostiene el pozo (según demanda diaria de cada uno)

      let sectoresSostenibles = 0;

      const haPromedio = activos.length ? totalHa / activos.length : 0;

      const demandaDiariaSector = mmDia * haPromedio * 10;

      if (demandaDiariaSector > 0) {

        const entregaEfectiva = bombeoDiario * eficiencia;

        sectoresSostenibles = Math.floor(entregaEfectiva / demandaDiariaSector);

        sectoresSostenibles = Math.max(0, Math.min(sectoresSostenibles, v.sectores.length));

      }

      // --- Intervalo mínimo para que el riego quepa en las horas disponibles

      const intervaloMinimo = Math.max(1, Math.ceil(horasRiegoTotales / v.horasRiego));

      lineas.push({ etiqueta: 'Requerimiento hídrico del mes', valor: C.num(bal.neto, 1) + ' mm', destacado: true });

      lineas.push({ etiqueta: 'Balance del mes', valor: 'ETc ' + C.num(bal.etc, 0) + ' mm  - lluvia efectivo ' + C.num(bal.lluviaEf, 0) + ' mm' });

      lineas.push({ etiqueta: 'Requerimiento diario', valor: C.num(mmDia, 2) + ' mm/día' });

      lineas.push({ etiqueta: 'Superficie con riego operativo', valor: C.num(superficieOperativa, 1) + ' ha de ' + C.num(superficieTotal, 1) + ' ha' });

      lineas.push({ etiqueta: 'Caudal de diseño por hectárea', valor: C.num(caudalPorHa, 2) + ' m3/h/ha' });

      lineas.push({ etiqueta: 'Caudal requerido por el pozo', valor: C.num(caudalRequerido, 1) + ' m3/h', destacado: true });

      lineas.push({ etiqueta: 'Caudal disponible del pozo', valor: C.num(v.caudalPozo, 0) + ' m3/h' });

      lineas.push({ etiqueta: 'Horas de bombeo necesarias', valor: C.num(horasBombeoNecesarias, 1) + ' h/día', destacado: true });

      lineas.push({ etiqueta: 'Horas de bombeo disponibles', valor: C.num(v.horasBombeo, 0) + ' h/día' });

      lineas.push({ etiqueta: 'Intervalo de riego', valor: intervalo + ' días' });

      lineas.push({ etiqueta: 'Lámina por aplicación', valor: C.num(mmEvento, 1) + ' mm' });

      lineas.push({ etiqueta: 'Volumen por ronda de riego', valor: C.num(demandaCiclo, 0) + ' m3' });

      lineas.push({ etiqueta: 'Demanda diaria del cultivo', valor: C.num(demandaDiariaTotal, 0) + ' m3/día' });

      lineas.push({ etiqueta: 'Horas de riego necesarias', valor: C.num(horasRiegoDiarias, 1) + ' h/día', destacado: true });

      lineas.push({ etiqueta: 'Horas de riego disponibles', valor: C.num(v.horasRiego, 0) + ' h/día' });

      lineas.push({ etiqueta: 'Volumen mensual a bombear', valor: C.num(demandaBombeoDia * bal.dias, 0) + ' m3' });

      lineas.push({ etiqueta: 'Autonomía del tranque', valor: isFinite(autonomia) ? C.num(autonomia, 1) + ' días' : '- sin flujo neto' });

      // --- Veredicto

      let tipo = 'ok', texto = '';

      const problemas = [];

      const soluciones = [];

      if (caudalRequerido > v.caudalPozo) {

        problemas.push('El pozo no alcanza el caudal requerido (' + C.num(caudalRequerido, 1) +

          ' m3/h frente a ' + C.num(v.caudalPozo, 0) + ' m3/h disponibles).');

      }

      if (horasBombeoNecesarias > v.horasBombeo) {

        soluciones.push('bombeando ' + C.num(horasBombeoNecesarias, 1) + ' h/día en vez de ' +

          C.num(v.horasBombeo, 0) + ' h');

      }

      if (horasRiegoDiarias > v.horasRiego) {

        problemas.push('Se necesitan ' + C.num(horasRiegoDiarias, 1) + ' h/día de riego y hay ' +

          C.num(v.horasRiego, 0) + ' h disponibles. Con esta frecuencia el intervalo entre ' +

          'riegos tendría que ser de ' + intervaloMinimo + ' días o más.');

      }

      if (intervaloMinimo > bal.dias) {

        problemas.push('Con las horas de riego disponibles no alcanza para reponer la demanda ' +

          'diaria: el daeficit se acumula aunque se riegue a diario. Habría que aumentar el ' +

          'caudal del pozo, ampliar el número de goteros o reducir la superficie regada.');

      }

      if (flujoNeto <= 0) {

        problemas.push('El bombeo diario no cubre el consumo: el tranque se vacaría y la superficie ' +

          'regada entra en daeficit de agua.');

        if (soluciones.length) {

          problemas[problemas.length - 1] += ' Se cerraría ' + soluciones.join(', ') + '.';

        }

      } else if (autonomia < 3) {

        problemas.push('El tranque ofrece menos de 3 días de margen: una falla de la bomba ' +

          'deja al huerto sin agua. Se recomienda un volumen mayor o bombeo de respaldo.');

      }

      if (sectoresSostenibles < activos.length) {

        problemas.push('Con la captación actual el pozo alcanza para ' + sectoresSostenibles +

          ' de ' + activos.length + ' sectores con riego activo en este mes. ' +

          'Diferir el riego de los sectores restantes entre ciclos.');

      }

      if (!problemas.length) {

        tipo = 'ok';

        texto = 'La operación es viable en ' + MESES[v.mes] + ': el pozo cubre el caudal, ' +

                'las horas de riego alcanzan y el tranque da margen. Puedes habilitar los ' +

                'sectores pendientes.';

      } else {

        tipo = problemas.length > 1 ? 'error' : 'aviso';

        texto = problemas.join(' ');

      }

      // --- Detalle por sector

      const detalle = porSector.map((s) => ({

        nombre: s.nombre,

        ha: s.ha,

        caudal: C.num(s.q, 1) + ' m3/h',

        caudalEfectivo: C.num(s.caudalEfectivo, 1) + ' m3/h',

        volumen: C.num(s.volumen, 0) + ' m3',

        horas: C.num(s.horasRiego, 1) + ' h'

      }));

      return {

        lineas: lineas,

        veredicto: { tipo: tipo, texto: texto },

        detalle: detalle,

        extra: this.renderDetalleRiego(detalle, v, bal)

      };

    },

    renderDetalleRiego(detalle, v, bal) {

      const superficieOperativa = detalle.reduce((a, s) => a + s.ha, 0);

      let html = '<h4>Detalle por sector</h4>';

      html += '<div class="tabla-envoltura"><table class="tabla responsive"><thead><tr>' +

        '<th>Sector</th><th class="num">Superficie</th><th class="num">Caudal diseño</th>' +

        '<th class="num">Caudal efectivo</th><th class="num">Volumen por ciclo</th>' +

        '<th class="num">Horas de riego</th></tr></thead><tbody>';

      detalle.forEach((d) => {

        html += '<tr><td data-label="Sector">' + C.esc(d.nombre) + '</td>' +

          '<td class="num" data-label="Superficie">' + C.esc(d.ha) + ' ha</td>' +

          '<td class="num" data-label="Caudal diseño">' + C.esc(d.caudal) + '</td>' +

          '<td class="num" data-label="Caudal efectivo">' + C.esc(d.caudalEfectivo) + '</td>' +

          '<td class="num" data-label="Volumen por ciclo">' + C.esc(d.volumen) + '</td>' +

          '<td class="num" data-label="Horas de riego">' + C.esc(d.horas) + '</td></tr>';

      });

      html += '</tbody></table></div>';

      html += '<h4 style="margin-top:1rem">Todo el año</h4><div class="tabla-envoltura">' +

        '<table class="tabla responsive"><thead><tr><th>Mes</th><th class="num">ETc (mm)</th>' +

        '<th class="num">Lluvia (mm)</th><th class="num">Req. neto (mm)</th>' +

        '<th class="num">Volumen (m3)</th></tr></thead><tbody>';

      balanceMensual().forEach((b) => {

        html += '<tr><td data-label="Mes">' + MESES[b.mes] + '</td>' +

          '<td class="num" data-label="ETc">' + C.num(b.etc, 0) + '</td>' +

          '<td class="num" data-label="Lluvia">' + C.num(b.lluvia, 0) + '</td>' +

          '<td class="num" data-label="Req. neto"><strong>' + C.num(b.neto, 0) + '</strong></td>' +

          '<td class="num" data-label="Volumen">' + C.num(b.neto * superficieOperativa * 10, 0) + '</td></tr>';

      });

      html += '</tbody><tfoot><tr><td>Total</td><td class="num">-</td><td class="num">-</td>' +

        '<td class="num">' + C.num(balanceMensual().reduce((a, b) => a + b.neto, 0), 0) + '</td>' +

        '<td class="num">' + C.num(balanceMensual().reduce((a, b) => a + b.neto, 0) * superficieOperativa * 10, 0) +

        '</td></tr></tfoot></table></div>';

      return html;

    }

  };

  /* ====================================================================== */

  /*  2. COSTO POR KG                                                      */

  /* ====================================================================== */

  const calcCosto = {

    id: 'costo',

    titulo: 'Costo por kilogramo y margen',

    descripcion: 'Estima el costo total de producir una temporada, el costo por kilo ' +

                 'cosechado y el margen con el precio de venta. Muestra el punto de ' +

                 'equilibrio: el rendimiento mínimo por hectárea para no perder plata.',

    campos: [

      { id: 'superficie', etiqueta: 'Superficie cosechada', tipo: 'number', valor: 16,

        sufijo: 'ha', min: 0.1, max: 500, paso: 0.5 },

      { id: 'rendimiento', etiqueta: 'Rendimiento', tipo: 'number', valor: 2000,

        sufijo: 'kg/ha', min: 100, max: 8000, paso: 50 },

      { id: 'fertilizacion', etiqueta: 'Fertilización', tipo: 'number', valor: 180000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'agroquimicos', etiqueta: 'Agroquímicos y fitosanitarios', tipo: 'number', valor: 220000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'malezas', etiqueta: 'Control de malezas', tipo: 'number', valor: 60000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'riego', etiqueta: 'Riego (energía y mantención)', tipo: 'number', valor: 90000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'jornales', etiqueta: 'Mano de obra', tipo: 'number', valor: 350000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'maquinaria', etiqueta: 'Maquinaria (combustible y mantención)', tipo: 'number', valor: 140000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'cosechaCosto', etiqueta: 'Cosecha', tipo: 'number', valor: 300000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'poscosecha', etiqueta: 'Poscosecha (secado y Storage)', tipo: 'number', valor: 80000,

        sufijo: '$/ha', min: 0, paso: 5000 },

      { id: 'fijos', etiqueta: 'Costos fijos del predio', tipo: 'number', valor: 1500000,

        sufijo: '$ totales', min: 0, paso: 50000 },

      { id: 'precio', etiqueta: 'Precio de venta', tipo: 'number', valor: 2800,

        sufijo: '$/kg', min: 0, paso: 50 }

    ],

    calcular(v) {

      const porHa = v.fertilizacion + v.agroquimicos + v.malezas + v.riego +

                   v.jornales + v.maquinaria + v.cosechaCosto + v.poscosecha;

      const costoTotal = porHa * v.superficie + v.fijos;

      const kgTotales = v.rendimiento * v.superficie;

      const costoPorKg = kgTotales > 0 ? costoTotal / kgTotales : 0;

      const ingresoTotal = kgTotales * v.precio;

      const margen = ingresoTotal - costoTotal;

      const equilibrioHa = v.precio > 0 ? costoTotal / v.precio / v.superficie : 0;

      const lineas = [

        { etiqueta: 'Costo variable por hectárea', valor: '$ ' + C.num(porHa, 0) },

        { etiqueta: 'Costo total de la temporada', valor: '$ ' + C.num(costoTotal, 0), destacado: true },

        { etiqueta: 'Producción estimada', valor: C.num(kgTotales, 0) + ' kg' },

        { etiqueta: 'Costo por kilogramo', valor: '$ ' + C.num(costoPorKg, 0) + '/kg', destacado: true },

        { etiqueta: 'Ingreso bruto estimado', valor: '$ ' + C.num(ingresoTotal, 0) },

        { etiqueta: 'Margen de la temporada', valor: '$ ' + C.num(margen, 0), destacado: true },

        { etiqueta: 'Margen por kilogramo', valor: '$ ' + C.num(v.precio - costoPorKg, 0) + '/kg' },

        { etiqueta: 'Punto de equilibrio', valor: C.num(equilibrioHa, 0) + ' kg/ha', destacado: true }

      ];

      let tipo = 'ok', texto = '';

      if (margen < 0) {

        tipo = 'error';

        texto = 'A este rendimiento y precio la temporada cierra en paerdida. El margen se ' +

                'recupera bajando costos, subiendo el rendimiento a ' + C.num(equilibrioHa, 0) +

                ' kg/ha o negociando el precio de venta.';

      } else if (v.precio - costoPorKg < 300) {

        tipo = 'aviso';

        texto = 'El margen es estrecho: por cada kilo vendido quedan ' +

                C.num(v.precio - costoPorKg, 0) + ' pesos. Cualquier alza de insumos o ' +

                'paerdida de rendimiento lo deja en paerdida.';

      } else {

        texto = 'La temporada es rentable con un margen de ' + C.num(v.precio - costoPorKg, 0) +

                ' pesos por kilo. El equilibrio está en ' + C.num(equilibrioHa, 0) +

                ' kg/ha, así que el rendimiento actual tiene un margen de ' +

                C.num(v.rendimiento - equilibrioHa, 0) + ' kg/ha de holgura.';

      }

      return {

        lineas: lineas,

        veredicto: { tipo: tipo, texto: texto },

        extra: this.renderDesglose(v, porHa, costoTotal, kgTotales, costoPorKg)

      };

    },

    renderDesglose(v, porHa, costoTotal, kgTotales, costoPorKg) {

      const items = [

        ['Fertilización', v.fertilizacion],

        ['Agroquímicos y fitosanitarios', v.agroquimicos],

        ['Control de malezas', v.malezas],

        ['Riego', v.riego],

        ['Mano de obra', v.jornales],

        ['Maquinaria', v.maquinaria],

        ['Cosecha', v.cosechaCosto],

        ['Poscosecha', v.poscosecha]

      ];

      let html = '<h4>Desglose del costo variable</h4>';

      html += '<div class="tabla-envoltura"><table class="tabla responsive"><thead><tr>' +

        '<th>Concepto</th><th class="num">$/ha</th><th class="num">$ totales</th>' +

        '<th class="num">Participación</th></tr></thead><tbody>';

      items.forEach(([nombre, valor]) => {

        const pct = porHa > 0 ? (valor / porHa) * 100 : 0;

        html += '<tr><td data-label="Concepto">' + C.esc(nombre) + '</td>' +

          '<td class="num" data-label="$/ha">' + C.num(valor, 0) + '</td>' +

          '<td class="num" data-label="$ totales">' + C.num(valor * v.superficie, 0) + '</td>' +

          '<td class="num" data-label="Participación">' + C.num(pct, 1) + '%</td></tr>';

      });

      html += '<tr><td data-label="Concepto">Costos fijos</td>' +

        '<td class="num" data-label="$/ha">' + C.num(v.fijos / v.superficie, 0) + '</td>' +

        '<td class="num" data-label="$ totales">' + C.num(v.fijos, 0) + '</td>' +

        '<td class="num" data-label="Participación">-</td></tr>';

      html += '</tbody><tfoot><tr><td>Total</td><td class="num">' + C.num(porHa + v.fijos / v.superficie, 0) +

        '</td><td class="num">' + C.num(costoTotal, 0) + '</td><td class="num">100%</td></tr></tfoot></table></div>';

      return html;

    }

  };

  /* ====================================================================== */

  /*  3. COSECHA                                                            */

  /* ====================================================================== */

  const calcCosecha = {

    id: 'cosecha',

    titulo: 'Planificación de la cosecha',

    descripcion: 'Calcula los kilos a cosechar, las personas-día que exige la cosecha manual, ' +

                 'los días de trabajo y cuánto cuesta por kilo. Compara cosechar con mano de ' +

                 'obra propia contra tercerizar el servicio.',

    campos: [

      { id: 'superficie', etiqueta: 'Superficie', tipo: 'number', valor: 16,

        sufijo: 'ha', min: 0.1, max: 500, paso: 0.5 },

      { id: 'rendimiento', etiqueta: 'Rendimiento', tipo: 'number', valor: 2000,

        sufijo: 'kg/ha', min: 100, max: 8000, paso: 50 },

      { id: 'kgPersona', etiqueta: 'Recolección por persona', tipo: 'number', valor: 120,

        sufijo: 'kg/día', min: 20, max: 500, paso: 10 },

      { id: 'personas', etiqueta: 'Personas disponibles', tipo: 'number', valor: 5,

        sufijo: 'personas', min: 1, max: 100, paso: 1 },

      { id: 'jornal', etiqueta: 'Jornal diario', tipo: 'number', valor: 30000,

        sufijo: '$/día', min: 0, paso: 1000 },

      { id: 'tercero', etiqueta: 'Precio de la cosecha tercerizada', tipo: 'number', valor: 280,

        sufijo: '$/kg', min: 0, paso: 10 },

      { id: 'diasDisponibles', etiqueta: 'Días de cosecha disponibles', tipo: 'number', valor: 45,

        sufijo: 'días', min: 1, max: 120, step: 1 }

    ],

    calcular(v) {

      const kgTotales = v.rendimiento * v.superficie;

      const personasDia = v.kgPersona > 0 ? Math.ceil(kgTotales / v.kgPersona) : 0;

      const diasCosecha = personasDia / v.personas;

      const costoPropio = personasDia * v.jornal;

      const costoPropioKg = kgTotales > 0 ? costoPropio / kgTotales : 0;

      const costoTercero = kgTotales * v.tercero;

      const lineas = [

        { etiqueta: 'Kilos a cosechar', valor: C.num(kgTotales, 0) + ' kg', destacado: true },

        { etiqueta: 'Personas-día necesarias', valor: C.num(personasDia, 0) + ' jornadas', destacado: true },

        { etiqueta: 'Días de cosecha con ' + v.personas + ' personas', valor: C.num(diasCosecha, 1) + ' días' },

        { etiqueta: 'Días disponibles en la ventana', valor: C.num(v.diasDisponibles, 0) + ' días' },

        { etiqueta: 'Costo de cosecha con mano de obra propia', valor: '$ ' + C.num(costoPropio, 0) + ' (' + C.num(costoPropioKg, 0) + ' $/kg)' },

        { etiqueta: 'Costo de cosecha tercerizada', valor: '$ ' + C.num(costoTercero, 0) + ' (' + C.num(v.tercero, 0) + ' $/kg)' },

        { etiqueta: 'Diferencia a favor', valor: '$ ' + C.num(Math.abs(costoTercero - costoPropio), 0) +

            ' (' + (costoPropio < costoTercero ? 'cosecha propia' : 'tercerizar') + ')' }

      ];

      let tipo = 'ok', texto = '';

      const problemas = [];

      if (diasCosecha > v.diasDisponibles) {

        problemas.push('La cosecha no alcanza en la ventana disponible: se necesitan ' +

          C.num(diasCosecha, 0) + ' días y hay ' + C.num(v.diasDisponibles, 0) +

          '. Requiere ' + Math.ceil(personasDia / v.diasDisponibles) + ' personas en lugar de ' +

          v.personas + '.');

      }

      if (costoPropioKg > v.tercero) {

        problemas.push('Cosechar con mano de obra propia cuesta ' +

          C.num(costoPropioKg - v.tercero, 0) + ' $/kg más que tercerizar.');

      }

      if (!problemas.length) {

        texto = 'La cosecha es realizable con ' + v.personas + ' personas en ' +

          C.num(diasCosecha, 0) + ' días, dentro de la ventana de cosecha.';

        if (costoPropioKg < v.tercero) {

          texto += ' Además conviene cosechar con mano de obra propia: sale ' +

            C.num(v.tercero - costoPropioKg, 0) + ' $/kg más barato.';

        } else {

          texto += ' Conviene evaluar la opción de tercerizar: sale ' +

            C.num(costoPropioKg - v.tercero, 0) + ' $/kg más barato.';

        }

      } else {

        tipo = problemas.length > 1 ? 'error' : 'aviso';

        texto = problemas.join(' ');

      }

      return {

        lineas: lineas,

        veredicto: { tipo: tipo, texto: texto },

        extra: ''

      };

    }

  };

  /* ====================================================================== */

  /*  4. CARGA ANIMAL                                                       */

  /* ====================================================================== */

  const calcCargaAnimal = {

    id: 'carga',

    titulo: 'Carga animal y balance forrajero',

    descripcion: 'Estima el consumo de materia seca del rebaño, lo contrasta con el ' +

                 'forraje disponible en potrero y huerto, y calcula cuánta suplementación ' +

                 'hace falta y cuántos días de pastoreo admite cada sector.',

    campos: [

      { id: 'animales', etiqueta: 'Número de animales', tipo: 'number', valor: 40,

        sufijo: 'animales', min: 1, max: 5000, paso: 1 },

      { id: 'peso', etiqueta: 'Peso promedio', tipo: 'number', valor: 45,

        sufijo: 'kg PV', min: 10, max: 120, paso: 1 },

      { id: 'estado', etiqueta: 'Estado productivo', tipo: 'select', valor: 'mantencion',

        opciones: [

          { valor: 'mantencion', texto: 'Mantención' },

          { valor: 'gestacion', texto: 'último tercio de gestación' },

          { valor: 'lactancia', texto: 'Lactancia' },

          { valor: 'cordero', texto: 'Cordero en crecimiento' }

        ] },

      { id: 'potrero', etiqueta: 'Superficie de potrero', tipo: 'number', valor: 4,

        sufijo: 'ha', min: 0, max: 1000, paso: 0.5 },

      { id: 'produccionPotrero', etiqueta: 'Producción del potrero', tipo: 'number', valor: 5000,

        sufijo: 'kg MS/ha/año', min: 500, max: 20000, paso: 100 },

      { id: 'produccionHuerto', etiqueta: 'Forraje del huerto (cubierta y rebrote)', tipo: 'number', valor: 1200,

        sufijo: 'kg MS/ha/año', min: 0, max: 10000, paso: 100 },

      { id: 'superficieHuerto', etiqueta: 'Superficie de huerto pastoreable', tipo: 'number', valor: 16,

        sufijo: 'ha', min: 0, max: 1000, paso: 0.5 },

      { id: 'suplemento', etiqueta: 'Suplementación adicional', tipo: 'number', valor: 0.5,

        sufijo: 'kg MS/animal/día', min: 0, max: 5, paso: 0.1 }

    ],

    calcular(v) {

      const factores = { mantencion: 1.0, gestacion: 1.5, lactancia: 1.6, cordero: 1.4 };

      const factor = factores[v.estado] || 1;

      const msAnimalDia = v.peso * 0.018 * factor;

      const msTotalDia = msAnimalDia * v.animales;

      const msTotalAnio = msTotalDia * 365;

      const msSuplemento = v.suplemento * v.animales * 365;

      const ofertaPotrero = v.potrero * v.produccionPotrero;

      const ofertaHuerto = v.superficieHuerto * v.produccionHuerto;

      const ofertaTotal = ofertaPotrero + ofertaHuerto;

      const demandaPastoreo = Math.max(0, msTotalAnio - msSuplemento);

      const balance = ofertaTotal - demandaPastoreo;

      // Carga animal: 1 UA ovina = 1 oveja de 60 kg en mantención

      const ua = (v.peso / 60) * v.animales;

      const superficieTotal = v.potrero + v.superficieHuerto;

      const cargaAnimalUA = superficieTotal > 0 ? ua / superficieTotal : 0;

      const diasPastro = balance > 0 && demandaPastoreo > 0

        ? Math.round((ofertaTotal / demandaPastoreo) * 365) : 0;

      const aguaDia = v.animales * (v.estado === 'lactancia' ? 5.7 : 3.8);

      const lineas = [

        { etiqueta: 'Consumo por animal', valor: C.num(msAnimalDia, 2) + ' kg MS/día' },

        { etiqueta: 'Consumo total del rebaño', valor: C.num(msTotalDia, 1) + ' kg MS/día', destacado: true },

        { etiqueta: 'Consumo anual', valor: C.num(msTotalAnio, 0) + ' kg MS/año' },

        { etiqueta: 'Oferta del potrero', valor: C.num(ofertaPotrero, 0) + ' kg MS/año' },

        { etiqueta: 'Oferta del huerto', valor: C.num(ofertaHuerto, 0) + ' kg MS/año' },

        { etiqueta: 'Balance forrajero', valor: (balance >= 0 ? '+' : '') + C.num(balance, 0) + ' kg MS/año', destacado: true },

        { etiqueta: 'Carga animal', valor: C.num(cargaAnimalUA, 2) + ' UA/ha', destacado: true },

        { etiqueta: 'Equivalente animal', valor: C.num(ua, 1) + ' UA (' + C.num(v.animales, 0) + ' animales)' },

        { etiqueta: 'Agua requerida', valor: C.num(aguaDia, 0) + ' L/día' }

      ];

      let tipo = 'ok', texto = '';

      if (balance < 0) {

        tipo = 'error';

        texto = 'El forraje disponible no alcanza: faltan ' + C.num(Math.abs(balance), 0) +

          ' kg de materia seca al año, equivalentes a ' +

          C.num(Math.abs(balance) / Math.max(1, v.animales) / 365, 2) +

          ' kg MS por animal y día. Hay que ampliar potrero, subir la suplementación ' +

          'o reducir la carga animal.';

      } else if (cargaAnimalUA > 0.3) {

        tipo = 'aviso';

        texto = 'El balance forrajero alcanza, pero la carga animal de ' +

          C.num(cargaAnimalUA, 2) + ' UA/ha es alta para un campo de ' +

          C.num(superficieTotal, 1) + ' ha. Vigila el estado de la cubierta vegetal ' +

          'y el daño en las plantas jóvenes.';

      } else {

        texto = 'El balance forrajero es suficiente con holgura (' + C.num(balance, 0) +

          ' kg MS/año) y la carga animal de ' + C.num(cargaAnimalUA, 2) +

          ' UA/ha es moderada. El pastoreo bajo avellanos es viable como complemento.';

      }

      if (v.estado === 'gestacion' && v.suplemento < 0.3) {

        tipo = tipo === 'ok' ? 'aviso' : tipo;

        texto += ' Con suplementación mínima en el último tercio de gestación conviene ' +

          'subir el concentrado para evitar bajo peso al parto.';

      }

      return {

        lineas: lineas,

        veredicto: { tipo: tipo, texto: texto },

        extra: ''

      };

    }

  };

  /* ====================================================================== */

  /*  RENDERIZADOR GENÉRICO                                                 */

  /* ====================================================================== */

  function campoHTML(campo, valor, alCambiar, resets, porDefecto) {

    const wrap = C.el('div', 'calc-campo');

    const id = campo._id;

    if (campo.tipo === 'sectores') {

      wrap.appendChild(C.el('label', '', campo.etiqueta));

      const cont = C.el('div', 'calc-campo');

      cont.style.marginTop = '.35rem';

      valor.forEach((s, i) => {

        const fila = C.el('div');

        fila.style.cssText = 'display:grid;grid-template-columns:1fr 5.5rem 4.5rem;gap:.35rem;align-items:center;margin-bottom:.3rem';

        const nombre = C.el('input');

        nombre.type = 'text'; nombre.value = s.nombre;

        nombre.addEventListener('input', () => { s.nombre = nombre.value; alCambiar(); });

        const sup = C.el('input');

        sup.type = 'number'; sup.value = s.ha; sup.min = '0'; sup.step = '0.1';

        sup.setAttribute('aria-label', 'Superficie de ' + s.nombre);

        sup.addEventListener('input', () => { s.ha = Number(sup.value) || 0; alCambiar(); });

        const op = C.el('label');

        op.style.cssText = 'display:flex;align-items:center;gap:.25rem;font-weight:500;font-size:.84rem;white-space:nowrap';

        const chk = C.el('input');

        chk.type = 'checkbox'; chk.checked = !!s.operativo;

        chk.style.width = 'auto';

        chk.addEventListener('change', () => { s.operativo = chk.checked; alCambiar(); });

        op.appendChild(chk);

        op.appendChild(document.createTextNode('Operativo'));

        fila.appendChild(nombre); fila.appendChild(sup); fila.appendChild(op);

        cont.appendChild(fila);

        const d = (porDefecto && porDefecto[i]) || s;

        resets.push(() => {

          s.nombre = d.nombre; s.ha = d.ha; s.operativo = d.operativo;

          nombre.value = d.nombre;

          sup.value = d.ha;

          chk.checked = !!d.operativo;

        });

      });

      wrap.appendChild(cont);

      const nota = C.el('div');

      nota.style.cssText = 'font-size:.78rem;color:var(--texto-mute);margin-top:.2rem';

      nota.textContent = 'Nombre - superficie (ha) - operativo';

      wrap.appendChild(nota);

      return wrap;

    }

    const label = C.el('label', '', campo.etiqueta);

    label.setAttribute('for', id);

    wrap.appendChild(label);

    let input;

    if (campo.tipo === 'select') {

      input = C.el('select');

      (campo.opciones || []).forEach((op) => {

        const o = C.el('option', '', op.texto);

        o.value = op.valor;

        input.appendChild(o);

      });

      input.value = valor;

    } else {

      input = C.el('input');

      input.type = campo.tipo || 'number';

      input.value = valor;

      if (campo.min != null) input.min = campo.min;

      if (campo.max != null) input.max = campo.max;

      if (campo.paso != null) input.step = campo.paso;

      if (campo.tipo === 'number') input.style.fontVariantNumeric = 'tabular-nums';

    }

    input.id = id;

    input.addEventListener('input', alCambiar);

    input.addEventListener('change', alCambiar);

    wrap.appendChild(input);

    if (campo.sufijo) {

      const s = C.el('div');

      s.style.cssText = 'font-size:.76rem;color:var(--texto-mute);margin-top:.15rem';

      s.textContent = campo.sufijo;

      wrap.appendChild(s);

    }

    return wrap;

  }

  function leerValores(config) {

    const v = {};

    config.campos.forEach((campo) => {

      if (campo.tipo === 'sectores') return;

      const el = document.getElementById(campo._id);

      if (!el) { v[campo.id] = campo.valor; return; }

      v[campo.id] = campo.tipo === 'select' ? el.value : Number(el.value);

    });

    v.sectores = config.valores.sectores;

    return v;

  }

  function renderCalculadora(config, contenedor) {

    const inst = Math.random().toString(36).slice(2, 7);

    config.instancia = inst;

    // Estado inicial

    config.valores = {};

    config.campos.forEach((campo) => {

      config.valores[campo.id] = campo.tipo === 'sectores'

        ? (campo.valor || []).map((s) => Object.assign({}, s))

        : campo.valor;

      campo._id = 'calc-' + campo.id + '-' + inst;

    });

    const resets = [];

    const sectoresPorDefecto = (config.valores.sectores || []).map((s) => Object.assign({}, s));

    const tarjeta = C.el('div', 'tarjeta');

    tarjeta.style.marginBottom = '1.2rem';

    const cab = C.el('div');

    cab.style.cssText = 'border-bottom:1px solid var(--linea-soft);padding-bottom:.7rem;margin-bottom:.9rem';

    cab.innerHTML = '<h2 style="margin-bottom:.2rem">' + C.esc(config.titulo) + '</h2>' +

      '<p style="margin:0;color:var(--texto-soft);font-size:.92rem">' + C.esc(config.descripcion) + '</p>' +

      (config.nota ? '<p style="margin:.4rem 0 0;font-size:.83rem;color:var(--texto-mute)">' +

        C.esc(config.nota) + '</p>' : '');

    tarjeta.appendChild(cab);

    const grilla = C.el('div', 'calc-grilla');

    config.campos.forEach((campo) => {

      grilla.appendChild(campoHTML(campo, config.valores[campo.id], () => calcular(), resets, sectoresPorDefecto));

    });

    tarjeta.appendChild(grilla);

    const acciones = C.el('div', 'calc-acciones');

    const btnCalc = C.el('button', 'btn', 'Calcular');

    btnCalc.type = 'button';

    btnCalc.addEventListener('click', () => calcular());

    acciones.appendChild(btnCalc);

    const btnReset = C.el('button', 'btn secundario', 'Restablecer');

    btnReset.type = 'button';

    btnReset.addEventListener('click', () => {

      config.campos.forEach((campo) => {

        if (campo.tipo === 'sectores') return;

        const el = document.getElementById(campo._id);

        if (el) el.value = campo.valor;

      });

      resets.forEach((fn) => fn());

      calcular();

    });

    acciones.appendChild(btnReset);

    tarjeta.appendChild(acciones);

    const resultados = C.el('div');

    resultados.id = 'resultados-' + config.id;

    tarjeta.appendChild(resultados);

    contenedor.appendChild(tarjeta);

    function calcular() {

      const v = leerValores(config);

      const salida = config.calcular(v);

      let html = '<div class="resultado">';

      html += '<h4>Resultados</h4>';

      salida.lineas.forEach((l) => {

        html += '<div class="linea' + (l.destacado ? ' destacada' : '') + '">' +

          '<span>' + C.esc(l.etiqueta) + '</span><span class="v">' + C.esc(l.valor) + '</span></div>';

      });

      if (salida.veredicto) {

        html += '<div class="veredicto ' + salida.veredicto.tipo + '">' + C.esc(salida.veredicto.texto) + '</div>';

      }

      html += '</div>';

      if (salida.extra) html += salida.extra;

      resultados.innerHTML = html;

    }

    calcular();

  }

  // Campo de sectores: valores por defecto tomados del dato de riego del campo

  let campoSectoresOriginal = null;

  function sectoresPorDefecto() {

    const r = window.DATOS_RIEGO;

    if (r && r.sectores && r.sectores.length) {

      return r.sectores.map((s) => ({

        nombre: s.nombre, ha: s.superficie, operativo: s.operativo

      }));

    }

    return [

      { nombre: 'Sector 1', ha: 4, operativo: true },

      { nombre: 'Sector 2', ha: 4, operativo: true },

      { nombre: 'Sector 3', ha: 4, operativo: false },

      { nombre: 'Sector 4', ha: 4, operativo: false }

    ];

  }

  /* ------------------------------------------------------------- Arranque - */

  function iniciar() {

    const cont = document.getElementById('calculadoras');

    if (!cont) return;

    cont.innerHTML = '';

    campoSectoresOriginal = sectoresPorDefecto();

    // La calculadora de riego usa la lista de sectores editable

    calcRiego.campos.forEach((c) => {

      if (c.tipo === 'sectores') c.valor = campoSectoresOriginal;

    });

    [calcRiego, calcCosto, calcCosecha, calcCargaAnimal].forEach((cfg) => {

      renderCalculadora(cfg, cont);

    });

  }

  window.CampoCalculo = { iniciar, balanceMensual, MESES };

  if (window.CampoDatos) {

    window.CampoDatos.pintar(iniciar);

  } else {

    iniciar();

  }

})();

