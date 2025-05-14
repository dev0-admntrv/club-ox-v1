"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { authService } from "@/lib/services/auth-service"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

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
  refreshSession: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Lista de rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ["/login", "/cadastro", "/esqueci-senha", "/redefinir-senha", "/"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sessionChecked, setSessionChecked] = useState(false)

  // Usar uma referência para o cliente Supabase para garantir que usamos a mesma instância
  const supabaseRef = useRef(getSupabaseClient())

  // Verificar se a rota atual é pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "")

  // Função para atualizar o usuário atual
  const refreshSession = useCallback(async () => {
    try {
      // Verificar primeiro se há uma sessão ativa
      const hasSession = await authService.hasActiveSession()
      if (!hasSession) {
        setUser(null)
        return null
      }

      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error)
      return null
    }
  }, [])

  // Verificar o estado de autenticação inicial
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true)

        // Não verificar sessão em rotas públicas durante a inicialização
        if (!isPublicRoute) {
          await refreshSession()
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
      } finally {
        setIsLoading(false)
        setSessionChecked(true)
      }
    }

    if (!sessionChecked) {
      checkUser()
    }
  }, [refreshSession, sessionChecked, isPublicRoute])

  // Configurar listener para mudanças de autenticação
  useEffect(() => {
    if (!sessionChecked) return

    // Usar a referência ao cliente Supabase
    const supabase = supabaseRef.current

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const currentUser = await refreshSession()
          if (currentUser && event === "SIGNED_IN") {
            router.push("/home")
          }
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/login")
      } else if (event === "USER_UPDATED") {
        await refreshSession()
      }
    })

    // Configurar verificação periódica da sessão apenas para rotas protegidas
    let sessionCheckInterval: NodeJS.Timeout | null = null

    if (!isPublicRoute) {
      sessionCheckInterval = setInterval(
        () => {
          refreshSession()
        },
        5 * 60 * 1000,
      ) // Verificar a cada 5 minutos
    }

    return () => {
      subscription.unsubscribe()
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval)
      }
    }
  }, [refreshSession, router, sessionChecked, isPublicRoute])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signIn(email, password)
      const currentUser = await refreshSession()
      if (currentUser) {
        router.push("/home")
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${currentUser.name}!`,
        })
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      })
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
      const currentUser = await refreshSession()
      if (currentUser) {
        router.push("/home")
        toast({
          title: "Cadastro realizado com sucesso",
          description: `Bem-vindo ao Club OX, ${name}!`,
        })
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      toast({
        title: "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Verifique os dados informados e tente novamente",
        variant: "destructive",
      })
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
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado com segurança",
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email)
      toast({
        title: "Solicitação enviada",
        description: "Verifique seu email para redefinir sua senha",
      })
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      toast({
        title: "Erro ao solicitar redefinição",
        description: error instanceof Error ? error.message : "Não foi possível enviar o email de redefinição",
        variant: "destructive",
      })
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
