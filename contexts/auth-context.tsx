"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { authService } from "@/lib/services/auth-service"
import type { User } from "@/lib/types"

// Tempo de inatividade em milissegundos (5 minutos)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    name: string,
    cpf: string,
    birthDate: string,
    phoneNumber: string,
  ) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const lastActivityRef = useRef<number>(Date.now())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Função para atualizar o timestamp da última atividade
  const refreshSession = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  // Função para verificar e limpar caches relacionados à autenticação
  const clearAuthCache = useCallback(async () => {
    try {
      // Limpar localStorage e sessionStorage
      localStorage.removeItem("supabase.auth.token")
      localStorage.removeItem("supabase.auth.expires_at")

      // Limpar outros itens de cache que podem estar causando problemas
      const authItems = Object.keys(localStorage).filter((key) => key.includes("auth") || key.includes("supabase"))

      authItems.forEach((key) => {
        localStorage.removeItem(key)
      })

      // Limpar cache do navegador relacionado à autenticação
      if ("caches" in window) {
        const cacheKeys = await caches.keys()
        const authCaches = cacheKeys.filter(
          (key) => key.includes("auth") || key.includes("supabase") || key.includes("next-data"),
        )
        await Promise.all(authCaches.map((key) => caches.delete(key)))
      }
    } catch (error) {
      console.error("Erro ao limpar cache:", error)
    }
  }, [])

  // Função para fazer logout
  const signOut = useCallback(async () => {
    if (isLoading) return // Evitar chamadas durante carregamento

    setIsLoading(true)
    try {
      // Limpar timers
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }

      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current)
        sessionCheckTimerRef.current = null
      }

      // Fazer logout no Supabase
      await authService.signOut()

      // Limpar cache
      await clearAuthCache()

      // Limpar estado
      setUser(null)

      // Adicionar timestamp para evitar cache
      const timestamp = Date.now()

      // Redirecionar para a página de login
      router.push(`/login?t=${timestamp}`)

      // Forçar recarregamento da página para limpar qualquer estado residual
      if (typeof window !== "undefined") {
        window.location.href = `/login?t=${timestamp}`
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error)

      // Mesmo em caso de erro, limpar o estado e redirecionar
      setUser(null)
      router.push(`/login?t=${Date.now()}`)
    } finally {
      setIsLoading(false)
    }
  }, [router, isLoading, clearAuthCache])

  // Função para verificar inatividade e fazer logout se necessário
  const checkInactivity = useCallback(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityRef.current

    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && user) {
      console.log("Sessão expirada por inatividade")
      signOut()
    }
  }, [signOut, user])

  // Função para verificar periodicamente a validade da sessão
  const checkSessionValidity = useCallback(async () => {
    if (!user) return

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.log("Sessão inválida detectada:", error)
        await signOut()
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error)
    }
  }, [user, signOut])

  // Configurar event listeners para detectar atividade do usuário
  useEffect(() => {
    if (!user) return

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [user])

  // Configurar timer de inatividade
  useEffect(() => {
    if (!user) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
      return
    }

    // Limpar timer existente
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current)
    }

    // Criar novo timer
    const timer = setInterval(() => {
      checkInactivity()
    }, 60000) // Verificar a cada minuto

    inactivityTimerRef.current = timer

    return () => {
      clearInterval(timer)
      inactivityTimerRef.current = null
    }
  }, [user, checkInactivity])

  // Configurar verificação periódica da validade da sessão
  useEffect(() => {
    if (!user) {
      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current)
        sessionCheckTimerRef.current = null
      }
      return
    }

    // Limpar timer existente
    if (sessionCheckTimerRef.current) {
      clearInterval(sessionCheckTimerRef.current)
    }

    // Criar novo timer para verificar a sessão a cada 5 minutos
    const timer = setInterval(
      () => {
        checkSessionValidity()
      },
      5 * 60 * 1000,
    )

    sessionCheckTimerRef.current = timer

    return () => {
      clearInterval(timer)
      sessionCheckTimerRef.current = null
    }
  }, [user, checkSessionValidity])

  // Limpar cache do navegador ao iniciar
  useEffect(() => {
    clearAuthCache()
  }, [clearAuthCache])

  // Verificar o estado de autenticação inicial e configurar listener
  useEffect(() => {
    const supabase = getSupabaseClient()
    let isActive = true // Flag para evitar atualizações de estado após desmontagem

    // Verificar o estado de autenticação inicial
    const checkUser = async () => {
      try {
        // Limpar qualquer cache antigo primeiro
        await clearAuthCache()

        const currentUser = await authService.getCurrentUser()

        if (isActive) {
          setUser(currentUser)
          if (currentUser) {
            lastActivityRef.current = Date.now() // Inicializar o timer de sessão
          }
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
        // Em caso de erro de autenticação, limpar o estado
        if (isActive) {
          setUser(null)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    checkUser()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isActive) return

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
          lastActivityRef.current = Date.now() // Atualizar o timer de sessão
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push(`/login?t=${Date.now()}`)
      }
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [router, clearAuthCache])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Limpar qualquer cache antigo primeiro
      await clearAuthCache()

      await authService.signIn(email, password)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      lastActivityRef.current = Date.now() // Inicializar o timer de sessão

      // Adicionar timestamp para evitar cache
      router.push(`/home?t=${Date.now()}`)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    name: string,
    cpf: string,
    birthDate: string,
    phoneNumber: string,
  ) => {
    setIsLoading(true)
    try {
      // Limpar qualquer cache antigo primeiro
      await clearAuthCache()

      await authService.signUp(email, password, name, cpf, birthDate, phoneNumber)
      // Após o cadastro, fazer login automaticamente
      await authService.signIn(email, password)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      lastActivityRef.current = Date.now() // Inicializar o timer de sessão

      // Adicionar timestamp para evitar cache
      router.push(`/home?t=${Date.now()}`)
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email)
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
