# Campo El Avellano

Sitio estático de gestión del campo (avellanos, ovinos, riego, maquinaria).

**Publicado en:** https://durrutiac94.github.io/campo-agricola/

## Características

- HTML/CSS/JS puro, sin build
- Contenido en Supabase (lectura pública) con copia local en el dispositivo
- `data/*.js` queda como respaldo cuando no hay conexión ni caché
- Edición en el sitio con cuenta: crear, modificar y borrar registros y fichas
- Subida de PDFs individual y por lotes desde el editor a Supabase Storage
- PWA con Service Worker (lectura sin conexión)
- Buscador global (Ctrl+K / `/`)
- Calculadoras agrícolas
- Exportación CSV

## Estructura

- Páginas: `index.html`, `avellanos.html`, `ovejas.html`, `riego.html`, `maquinaria.html`, `mapa.html`, `calendario.html`, `bitacora.html`, `calculadoras.html`, `documentos.html`, `contacto.html`
- Carpetas: `css/`, `js/`, `data/`, `pdfs/`, `assets/`, `supabase/`
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

## Edición

1. Pulsar **Entrar** en la barra superior e ingresar con la cuenta del campo.
2. Con la sesión iniciada aparecen los botones **Editar**, **Borrar** y **+ Agregar** en cada lista, y **Editar ficha** en cada sección.
3. Los cambios se guardan en Supabase y se ven en todos los dispositivos al recargar.
4. **Salir** oculta los controles de edición (el sitio sigue siendo de lectura pública).

Las cuentas se crean desde el panel de Supabase (Authentication → Users). No hay registro público.

## Estado

- Contenido en Supabase: lectura pública y edición con cuenta (RLS configurado en `supabase/esquema.sql`).
- Los datos se muestran desde la copia local del dispositivo y luego se refrescan desde la nube.
- Editor disponible en todas las secciones, el calendario, las bitácoras, los contactos y los documentos.
- Documentos PDF: se suben desde el editor a Supabase Storage (bucket público `documentos`, solo PDF, máximo 20 MB). Cualquiera con el enlace puede leerlos.
- Carga por lotes: hasta 20 PDFs a la vez, con categoría común ajustable por archivo, título editable, fecha y etiquetas comunes. Las categorías son `Avellanos`, `Ovejas`, `Riego`, `Maquinaria` y `General`; los documentos antiguos sin categoría se muestran como `General`.
- La sección Mapa queda como fase extra al final (mapa QGIS estático e interactivo).
- Pendientes: cola de cambios sin conexión, aviso global de sesión vencida, cron anti-pausa y segunda cuenta. Mapa QGIS al final.

## Etiquetas

- `v0.1.0`: sitio estático publicado.
