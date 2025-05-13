"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function SessionRecovery() {
  const [isRecovering, setIsRecovering] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar se há sinais de problemas de cache
    const checkForCacheIssues = () => {
      // Verificar se a página está demorando para carregar
      const pageLoadTime = performance.now()
      const loadThreshold = 3000 // 3 segundos

      if (pageLoadTime > loadThreshold) {
        // Possível problema de cache detectado
        handleCacheIssue()
      }

      // Verificar se há erros de rede relacionados a cache
      window.addEventListener("error", (event) => {
        if (
          event.message &&
          (event.message.includes("Failed to fetch") ||
            event.message.includes("NetworkError") ||
            event.message.includes("Network request failed"))
        ) {
          handleCacheIssue()
        }
      })

      // Verificar se há erros de carregamento de recursos
      document.addEventListener(
        "error",
        (event) => {
          const target = event.target as HTMLElement
          if (target.tagName === "IMG" || target.tagName === "SCRIPT" || target.tagName === "LINK") {
            // Possível problema de cache em recursos
            handleCacheIssue()
          }
        },
        true,
      )
    }

    const handleCacheIssue = () => {
      if (isRecovering) return

      setIsRecovering(true)

      toast({
        title: "Detectamos um problema de carregamento",
        description: "Estamos tentando resolver automaticamente...",
        duration: 5000,
      })

      // Tentar limpar caches
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName)
          })
        })
      }

      // Limpar localStorage e sessionStorage
      localStorage.clear()
      sessionStorage.clear()

      // Recarregar a página com parâmetro de cache-busting após um breve delay
      setTimeout(() => {
        const timestamp = Date.now()
        window.location.href = `${window.location.pathname}?t=${timestamp}`
      }, 2000)
    }

    checkForCacheIssues()
  }, [router, toast, isRecovering])

  return null
}
