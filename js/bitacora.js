/* ==========================================================================
   bitacora.js - bitacora de labores y gastos
   ========================================================================== */

(function () {
  'use strict';

  const C = window.Campo;

  function formatCLP(m) {
    try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(m); } catch(e) { return '$ ' + m; }
  }

  function render() {
    const cont = document.getElementById('bitacora');
    if (!cont) return;

    cont.innerHTML = '';

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.innerHTML = '<button class="tab activo" data-tab="labores">Labores</button><button class="tab" data-tab="gastos">Gastos</button>';
    cont.appendChild(tabs);

    const panelLabores = document.createElement('section');
    panelLabores.id = 'panel-labores';
    panelLabores.className = 'seccion';
    cont.appendChild(panelLabores);

    const panelGastos = document.createElement('section');
    panelGastos.id = 'panel-gastos';
    panelGastos.className = 'seccion';
    panelGastos.style.display = 'none';
    cont.appendChild(panelGastos);

    tabs.querySelectorAll('.tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        tabs.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('activo'); });
        btn.classList.add('activo');
        panelLabores.style.display = btn.dataset.tab === 'labores' ? 'block' : 'none';
        panelGastos.style.display = btn.dataset.tab === 'gastos' ? 'block' : 'none';
      });
    });

    // Labores
    const labores = window.DATOS_LABORES || [];
    panelLabores.innerHTML = '<h2>Labores realizadas</h2><p class="parrafo-intro">Registro de las labores efectuadas en el campo.</p>';
    const envL = document.createElement('div');
    envL.className = 'tabla-envoltura';
    const tL = document.createElement('table');
    tL.className = 'tabla';
    tL.innerHTML = '<thead><tr><th>Fecha</th><th>Categoria</th><th>Labor</th><th>Sector</th><th>Ha</th><th>Horas</th><th>Personas</th><th>Costo</th><th>Observacion</th></tr></thead>';
    const tbL = document.createElement('tbody');
    labores.slice().sort(function(a,b){ return a.fecha < b.fecha ? 1 : -1; }).forEach(function(l){
      const tr = document.createElement('tr');
      [l.fecha, l.categoria, l.labor, l.sector, l.hectareas, l.horas, l.personas, formatCLP(l.costo||0), l.observacion||''].forEach(function(val,i){
        const td = document.createElement('td');
        td.textContent = val;
        if ([4,5,6,7].indexOf(i)>=0) td.className = 'num';
        tr.appendChild(td);
      });
      tbL.appendChild(tr);
    });
    tL.appendChild(tbL);
    envL.appendChild(tL);
    panelLabores.appendChild(envL);

    // Gastos
    const gastos = window.DATOS_GASTOS || [];
    panelGastos.innerHTML = '<h2>Gastos e ingresos</h2><p class="parrafo-intro">Movimientos registrados por fecha, categoria y proveedor.</p>';
    const envG = document.createElement('div');
    envG.className = 'tabla-envoltura';
    const tG = document.createElement('table');
    tG.className = 'tabla';
    tG.innerHTML = '<thead><tr><th>Fecha</th><th>Tipo</th><th>Categoria</th><th>Concepto</th><th>Monto</th><th>Forma de pago</th><th>Proveedor</th></tr></thead>';
    const tbG = document.createElement('tbody');
    gastos.slice().sort(function(a,b){ return a.fecha < b.fecha ? 1 : -1; }).forEach(function(g){
      const tr = document.createElement('tr');
      [g.fecha, g.tipo, g.categoria, g.concepto, formatCLP(g.monto||0), g.formaPago||'', g.proveedor||''].forEach(function(val,i){
        const td = document.createElement('td');
        td.textContent = val;
        if (i === 4) td.className = 'num';
        tr.appendChild(td);
      });
      tbG.appendChild(tr);
    });
    tG.appendChild(tbG);
    envG.appendChild(tG);
    panelGastos.appendChild(envG);

    // Totales
    let total = 0;
    gastos.forEach(function(g){ if(g.tipo === 'gasto') total += (g.monto||0); });
    const aviso = document.createElement('div');
    aviso.className = 'aviso info';
    aviso.innerHTML = '<strong>Total de gastos registrados:</strong> ' + formatCLP(total);
    panelGastos.appendChild(aviso);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
