/* ==========================================================================
   calendario.js - calendario anual del campo
   ========================================================================== */

(function () {
  'use strict';

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function render() {
    const cont = document.getElementById('calendario');
    if (!cont) return;
    const datos = window.DATOS_CALENDARIO;
    if (!datos) { cont.innerHTML = '<div class="vacio">Sin datos de calendario</div>'; return; }
    const categorias = datos.categorias || [];
    const anio = datos['año'] || datos.ano || '';

    cont.innerHTML = '';

    const intro = document.getElementById('intro-calendario');
    if (intro && datos.introduccion) intro.textContent = datos.introduccion;

    // Filtros
    const filtros = document.createElement('div');
    filtros.className = 'filtros-documentos';
    const grupo = document.createElement('div');
    grupo.className = 'filtros-grupo';
    const selCat = document.createElement('select');
    selCat.innerHTML = '<option value="todos">Todas las categorias</option>' + categorias.map(function(c){ return '<option value="'+c.id+'">'+c.nombre+'</option>'; }).join('');
    const labCat = document.createElement('label');
    labCat.innerHTML = '<span>Categoria</span>';
    labCat.appendChild(selCat);
    grupo.appendChild(labCat);
    filtros.appendChild(grupo);
    cont.appendChild(filtros);

    const envoltura = document.createElement('div');
    envoltura.className = 'calendario-calendario';
    cont.appendChild(envoltura);

    function pintar(filtro) {
      envoltura.innerHTML = '';
      meses.forEach(function(nombreMes, mesIdx) {
        const eventosMes = (datos.eventos || []).filter(function(e){ return e.mes === mesIdx && (filtro === 'todos' || e.categoria === filtro); });
        if (eventosMes.length === 0) return;
        const panel = document.createElement('section');
        panel.className = 'panel-mes';
        panel.id = 'mes-' + mesIdx;
        const h = document.createElement('h3');
        h.textContent = nombreMes + ' ' + anio;
        panel.appendChild(h);
        const lista = document.createElement('div');
        lista.className = 'lista-eventos';
        eventosMes.forEach(function(ev) {
          const item = document.createElement('article');
          item.className = 'evento';
          const cat = categorias.find(function(c){ return c.id === ev.categoria; });
          item.innerHTML = '<div class="cab-evento"><span class="fecha">' + ev.fecha + '</span>' + (cat ? '<span class="chip" style="background:'+cat.color+'22;color:'+cat.color+'">'+cat.nombre+'</span>' : '') + '</div><h4>' + (window.Campo ? window.Campo.esc(ev.titulo) : ev.titulo) + '</h4><p>' + (window.Campo ? window.Campo.esc(ev.descripcion||'') : ev.descripcion||'') + '</p>' + (ev.responsable ? '<div class="meta">Responsable: ' + (window.Campo ? window.Campo.esc(ev.responsable) : ev.responsable) + '</div>' : '');
          lista.appendChild(item);
        });
        panel.appendChild(lista);
        envoltura.appendChild(panel);
      });
    }

    selCat.addEventListener('change', function(){ pintar(selCat.value); });
    pintar('todos');
  }

  if (window.CampoDatos) {
    window.CampoDatos.pintar(render);
  } else {
    render();
  }
})();
