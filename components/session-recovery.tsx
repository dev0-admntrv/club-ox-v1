"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth-service"

// Lista de rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ["/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"]

export function SessionRecovery() {
  const { user, isLoading, refreshSession } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Verificar se a rota atual é pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "")

  useEffect(() => {
    // Não verificar sessão em rotas públicas
    if (isPublicRoute) {
      return
    }

    // Verificar e renovar a sessão periodicamente
    const checkSession = async () => {
      try {
        // Verificar primeiro se há uma sessão ativa
        const hasSession = await authService.hasActiveSession()
        if (!hasSession) {
          // Se não houver sessão e não estamos em uma rota pública, redirecionar para login
          if (!isPublicRoute) {
            console.log("Sessão não encontrada, redirecionando para login")
            router.push("/login")
          }
          return
        }

        // Se houver sessão, tentar renovar
        const currentUser = await refreshSession()
        if (!currentUser && !isPublicRoute) {
          console.log("Falha ao renovar sessão, redirecionando para login")
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Redirecionando para o login...",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      }
    }

    // Verificar a sessão a cada 10 minutos
    const interval = setInterval(checkSession, 10 * 60 * 1000)

    // Verificar a sessão quando o componente é montado
    checkSession()

    // Verificar a sessão quando a janela ganha foco
    const handleFocus = () => {
      checkSession()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [refreshSession, router, toast, isPublicRoute, pathname])

  // Não renderiza nada, apenas gerencia a sessão
  return null
}
