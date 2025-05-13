"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Tempo de inatividade em milissegundos (5 minutos)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000

export function useSessionTimeout() {
  const { logout } = useAuth()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      console.log("Sessão expirada por inatividade")
      logout()
      router.push("/login?expired=true")
    }, INACTIVITY_TIMEOUT)
  }

  useEffect(() => {
    // Iniciar o timeout
    resetTimeout()

    // Eventos para resetar o timeout
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    // Função para lidar com eventos de atividade
    const handleActivity = () => {
      resetTimeout()
    }

    // Adicionar event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    // Limpar ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [logout, router])
}
