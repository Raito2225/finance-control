const CACHE_NAME = 'financecontrol-v1';
const ASSETS_ESTATICOS = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o Service Worker e guarda os arquivos básicos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_ESTATICOS);
    })
  );
  self.skipWaiting();
});

// Limpa caches antigos quando uma nova versão do Service Worker é ativada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia Network-First para o app e bypass total para o Supabase
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Nunca faz cache das requisições de API/Auth do Supabase
  if (url.includes('supabase.co')) {
    return;
  }

  // Para os demais arquivos: tenta a rede primeiro; se falhar (offline), usa o cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === 'GET' && response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
