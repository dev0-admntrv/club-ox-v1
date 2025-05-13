// Service Worker para controle de cache
self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  // Limpar caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        }),
      )
    }),
  )

  // Tomar controle de clientes não controlados
  event.waitUntil(clients.claim())
})

// Interceptar requisições para adicionar headers de cache
self.addEventListener("fetch", (event) => {
  // Não interceptar requisições para API ou autenticação
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/auth/") ||
    event.request.url.includes("/_next/data/")
  ) {
    // Criar uma nova requisição com headers modificados
    const modifiedRequest = new Request(event.request, {
      headers: {
        ...Object.fromEntries(event.request.headers),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
      },
    })

    event.respondWith(
      fetch(modifiedRequest).catch((error) => {
        console.error("Fetch error:", error)
        throw error
      }),
    )
  }
})
