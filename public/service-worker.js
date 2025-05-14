// Service Worker for Club OX App
const CACHE_NAME = "club-ox-cache-v1"
const OFFLINE_URL = "/offline"

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/login",
  "/manifest.json",
  "/favicon.ico",
  "/cozy-steakhouse.png",
  "/diverse-profile-avatars.png",
  "/grilled-picanha.png",
  "/grilled-filet-mignon.png",
  "/provoleta-cheese.png",
  "/luxury-wine-tasting.png",
  "/wine-tasting.png",
]

// Install event - precache key resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension") ||
    event.request.url.includes("extension") ||
    // Skip Supabase API requests
    event.request.url.includes("supabase.co")
  ) {
    return
  }

  // For HTML navigations, try network first, then cache, then offline page
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version of the page
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL)
          })
        }),
    )
    return
  }

  // For other requests (assets, API calls), try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Cache the response for future
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // For image requests, return a placeholder if offline
          if (event.request.destination === "image") {
            return caches.match("/placeholder.svg?key=4xnqy")
          }

          // For API requests, return an empty JSON response
          if (event.request.url.includes("/api/")) {
            return new Response(
              JSON.stringify({
                error: "offline",
                message: "You are currently offline",
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            )
          }
        })
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data.url))
})
