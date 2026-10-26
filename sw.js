/* Service worker del sitio de gestión de campo.

 *

 * Estrategia:

 *   - App shell (HTML, CSS, JS, data): cache-first con revalidación en segundo plano.

 *   - PDFs y otros binarios: NO se cachean. El visor nativo del navegador usa

 *     range requests y una respuesta completa cacheada rompe la reproducción.

 *     El sitio sigue siendo navegable sin señal; los PDF requieren conexión.

 *   - Navegaciones: network-first con fallback al index cacheado.

 */

const VERSION = 'v10';

const CACHE_SHELL = `campo-shell-${VERSION}`;

const CACHE_PAGINAS = `campo-paginas-${VERSION}`;

const SHELL = [

  './',

  './index.html',

  './avellanos.html',

  './ovejas.html',

  './riego.html',

  './maquinaria.html',

  './mapa.html',

  './calendario.html',

  './calculadoras.html',

  './bitacora.html',

  './documentos.html',

  './contacto.html',

  './404.html',

  './offline.html',

  './css/styles.css',

  './css/campo.css',

  './js/app.js',

  './js/config.js',

  './js/supabase.js',

  './js/manifiesto.js',

  './js/datos.js',

  './js/esquema.js',

  './js/editor.js',

  './js/secciones.js',

  './js/exportar.js',

  './js/buscador.js',

  './js/visor.js',

  './js/calculo.js',

  './js/bitacora.js',

  './js/calendario.js',

  './js/mapa.js',

  './data/campo.js',

  './data/mapa.js',

  './data/calendario.js',

  './data/labores.js',

  './data/gastos.js',

  './data/avellanos.js',

  './data/ovejas.js',

  './data/riego.js',

  './data/maquinaria.js',

  './data/documentos.js',

  './data/contactos.js',

  './manifest.webmanifest'

];

const ES_BINARIO = (ruta) => /\.(pdf|zip|docx?|xlsx?|pptx?|mp4|mp3|webm)$/i.test(ruta);

self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_SHELL)

      .then((cache) => cache.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))

      .catch(() => { /* si un recurso falla, no aborta la instalación */ })

      .then(() => self.skipWaiting())

  );

});

self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys()

      .then((nombres) => Promise.all(

        nombres.filter((n) => n !== CACHE_SHELL && n !== CACHE_PAGINAS).map((n) => caches.delete(n))

      ))

      .then(() => self.clients.claim())

  );

});

self.addEventListener('fetch', (event) => {

  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // Binarios: pasan directo a la red, sin cachear.

  if (ES_BINARIO(url.pathname)) return;

  // Navegaciones: red primero, si no hay red se sirve la página cacheada.

  if (req.mode === 'navigate') {

    event.respondWith(

      fetch(req)

        .then((res) => {

          const copia = res.clone();

          caches.open(CACHE_PAGINAS).then((c) => c.put(req, copia));

          return res;

        })

        .catch(() => caches.match(req).then((r) => r || caches.match('./offline.html')))

    );

    return;

  }

  // Recursos estáticos: cache primero, revalidando en segundo plano.

  event.respondWith(

    caches.match(req).then((cacheada) => {

      const red = fetch(req)

        .then((res) => {

          if (res && res.ok && res.type === 'basic') {

            const copia = res.clone();

            caches.open(CACHE_SHELL).then((c) => c.put(req, copia));

          }

          return res;

        })

        .catch(() => cacheada);

      return cacheada || red;

    })

  );

});

