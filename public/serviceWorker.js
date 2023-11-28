const CACHE_NAME = "v1_cache";
const urlsToCache = ["/", "/index.html"];

self.addEventListener('install', event => {
  // Precache recursos
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina cachés antiguos
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Intenta obtener el recurso de la red
    fetch(event.request)
      .then(response => {
        // Si se obtiene una respuesta válida de la red, actualiza el caché y devuelve la respuesta
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(err => {
        // Si no se puede obtener de la red, intenta recuperar del caché
        console.log('Error al obtener de la red, intentando desde el caché', err);
        return caches.match(event.request);
      })
  );
});
