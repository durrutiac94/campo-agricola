# Campo El Avellano

Sitio estatico para gestion del campo (avellanos, ovinos, riego, maquinaria).

## Caracteristicas
- HTML/CSS/JS puro, sin build
- Datos en data/*.js como window.*
- Funciona en file:// (sin fetch)
- PWA con Service Worker
- Buscador global (Ctrl+K / /)
- Calculadoras agricolas
- Exportacion CSV

## Estructura
- index.html, avellanos.html, ovejas.html, riego.html, maquinaria.html, mapa.html, calendario.html, bitacora.html, calculadoras.html, documentos.html, contacto.html
- css/, js/, data/, pdfs/, assets/

## Desarrollo
Levantar servidor local:
`
py -m http.server 8000
`
Abrir http://localhost:8000/

## Despliegue
GitHub Pages desde raiz del repo.
