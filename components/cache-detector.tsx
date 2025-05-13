"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function CacheDetector() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se a página está sendo carregada de um cache desatualizado
    const checkStaleCache = () => {
      const lastCacheCheck = localStorage.getItem("lastCacheCheck")
      const now = Date.now()
      const cacheTimeout = 5 * 60 * 1000 // 5 minutos

      // Se não houver verificação recente ou se passou muito tempo desde a última verificação
      if (!lastCacheCheck || now - Number.parseInt(lastCacheCheck) > cacheTimeout) {
        // Atualizar timestamp da última verificação
        localStorage.setItem("lastCacheCheck", now.toString())

        // Forçar recarregamento da página com cache-busting
        const currentPath = window.location.pathname
        const hasQuery = window.location.search.length > 1
        const separator = hasQuery ? "&" : "?"

        // Verificar se a página já foi recarregada recentemente para evitar loops
        const reloadCount = sessionStorage.getItem("reloadCount") || "0"
        const parsedReloadCount = Number.parseInt(reloadCount)

        if (parsedReloadCount < 2) {
          // Limitar a 2 recargas para evitar loops
          sessionStorage.setItem("reloadCount", (parsedReloadCount + 1).toString())

          // Recarregar a página com parâmetro de cache-busting
          router.refresh()
        } else {
          // Resetar contador após 1 minuto
          setTimeout(() => {
            sessionStorage.setItem("reloadCount", "0")
          }, 60000)
        }
      }
    }

    // Executar verificação quando o componente montar
    checkStaleCache()

    // Limpar cache de service worker se existir
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.update()
        }
      })
    }

    // Limpar caches específicos do navegador
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("next-data")) {
            caches.delete(cacheName)
          }
        })
      })
    }
  }, [router])

  return null
}
