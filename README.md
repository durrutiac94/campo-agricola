# Campo El Avellano

Sitio estático de gestión del campo (avellanos, ovinos, riego, maquinaria).

**Publicado en:** https://durrutiac94.github.io/campo-agricola/

## Características

- HTML/CSS/JS puro, sin build
- Datos en `data/*.js` como `window.*`
- Funciona en `file://` (sin `fetch`)
- PWA con Service Worker (lectura sin conexión)
- Buscador global (Ctrl+K / `/`)
- Calculadoras agrícolas
- Exportación CSV

## Estructura

- Páginas: `index.html`, `avellanos.html`, `ovejas.html`, `riego.html`, `maquinaria.html`, `mapa.html`, `calendario.html`, `bitacora.html`, `calculadoras.html`, `documentos.html`, `contacto.html`
- Carpetas: `css/`, `js/`, `data/`, `pdfs/`, `assets/`
- `sw.js` + `manifest.webmanifest` para la PWA
- `sitemap.xml` y `robots.txt` para buscadores

## Desarrollo

```powershell
py -m http.server 8000
```

Abrir http://localhost:8000/

## Despliegue

GitHub Pages desde la raíz del repositorio, rama `main`:

1. `git add -A` y `git commit -m "..."`.
2. `git push origin main`.
3. Pages reconstruye solo (Settings → Pages → `main` / `(root)`).

## Estado

- PDFs todavía no cargados: los enlaces de `documentos.html` se activarán en la fase de subida.
- La sección Mapa queda congelada hasta decidir si se mantiene.
- Próxima etapa: edición del contenido con Supabase (lectura pública, escritura con cuenta).

## Etiquetas

- `v0.1.0`: sitio estático publicado.
