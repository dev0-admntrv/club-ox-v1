"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
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
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Função para atualizar o timestamp da última atividade
  const refreshSession = useCallback(() => {
    setLastActivity(Date.now())
  }, [])

  // Função para verificar inatividade e fazer logout se necessário
  const checkInactivity = useCallback(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivity

    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && user) {
      console.log("Sessão expirada por inatividade")
      signOut()
    }
  }, [lastActivity, user])

  // Configurar timer de inatividade
  useEffect(() => {
    if (user) {
      // Limpar timer existente
      if (inactivityTimer) {
        clearInterval(inactivityTimer)
      }

      // Criar novo timer
      const timer = setInterval(checkInactivity, 60000) // Verificar a cada minuto
      setInactivityTimer(timer)

      // Adicionar event listeners para detectar atividade do usuário
      const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
      const handleActivity = () => refreshSession()

      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity)
      })

      return () => {
        clearInterval(timer)
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleActivity)
        })
      }
    } else if (inactivityTimer) {
      clearInterval(inactivityTimer)
      setInactivityTimer(null)
    }
  }, [user, lastActivity, checkInactivity, inactivityTimer, refreshSession])

  // Limpar cache do navegador ao iniciar
  useEffect(() => {
    // Função para limpar o cache do navegador relacionado à autenticação
    const clearAuthCache = async () => {
      try {
        // Limpar cache de armazenamento local relacionado à autenticação
        localStorage.removeItem("supabase.auth.token")

        // Forçar revalidação de cache
        if ("caches" in window) {
          const cacheKeys = await caches.keys()
          const authCaches = cacheKeys.filter((key) => key.includes("auth"))
          await Promise.all(authCaches.map((key) => caches.delete(key)))
        }
      } catch (error) {
        console.error("Erro ao limpar cache:", error)
      }
    }

    clearAuthCache()
  }, [])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)

      // Limpar cache ao fazer logout
      localStorage.removeItem("supabase.auth.token")
      sessionStorage.clear()

      // Redirecionar para a página de login com um parâmetro para evitar cache
      router.push(`/login?t=${Date.now()}`)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Verificar o estado de autenticação inicial
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          refreshSession() // Inicializar o timer de sessão
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
        // Em caso de erro de autenticação, limpar o estado
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
          refreshSession() // Atualizar o timer de sessão
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, refreshSession, signOut])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signIn(email, password)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      refreshSession() // Inicializar o timer de sessão
      router.push("/home")
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
      await authService.signUp(email, password, name, cpf, birthDate, phoneNumber)
      // Após o cadastro, fazer login automaticamente
      await authService.signIn(email, password)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      refreshSession() // Inicializar o timer de sessão
      router.push("/home")
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
