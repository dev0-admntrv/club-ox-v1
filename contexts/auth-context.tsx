"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { authService } from "@/lib/services/auth-service"
import type { User } from "@/lib/types"

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Usar useRef para garantir que temos apenas uma instância do cliente
  const supabaseClient = useRef(getSupabaseClient())

  useEffect(() => {
    let mounted = true

    // Verificar o estado de autenticação inicial
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkUser()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabaseClient.current.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const currentUser = await authService.getCurrentUser()
          if (mounted) {
            setUser(currentUser)
          }
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error)
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setUser(null)
          router.push("/login")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signIn(email, password)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
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
      router.push("/home")
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
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
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, resetPassword }}>
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
