"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth-service"
import { getSupabaseClient } from "@/lib/supabase/client"

export function ProtectedSessionManager() {
  const { refreshSession } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Usar uma referência para o cliente Supabase para garantir que usamos a mesma instância
  const supabaseRef = useRef(getSupabaseClient())

  useEffect(() => {
    // Verificar e renovar a sessão periodicamente
    const checkSession = async () => {
      try {
        // Verificar primeiro se há uma sessão ativa
        const hasSession = await authService.hasActiveSession()
        if (!hasSession) {
          console.log("Sessão não encontrada, redirecionando para login")
          router.push("/login")
          return
        }

        // Se houver sessão, tentar renovar
        const currentUser = await refreshSession()
        if (!currentUser) {
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
  }, [refreshSession, router, toast])

  // Não renderiza nada, apenas gerencia a sessão
  return null
}
