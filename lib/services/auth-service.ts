"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { userService } from "./user-service"

class AuthService {
  async signUp(email: string, password: string, name: string, cpf: string, birthDate: string, phoneNumber: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          cpf,
          birth_date: birthDate,
          phone_number: phoneNumber,
        },
      },
    })

    if (error) {
      console.error("Erro ao cadastrar:", error)
      throw new Error(error.message)
    }

    return data
  }

  async signIn(email: string, password: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro ao fazer login:", error)
      throw new Error(error.message)
    }

    return data
  }

  async signOut() {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Erro ao fazer logout:", error)
      throw new Error(error.message)
    }
  }

  async resetPassword(email: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      throw new Error(error.message)
    }
  }

  async hasActiveSession(): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getSession()
    return !!data.session
  }

  async refreshToken() {
    try {
      // Primeiro verificar se há uma sessão ativa antes de tentar renovar
      const hasSession = await this.hasActiveSession()
      if (!hasSession) {
        console.log("Nenhuma sessão ativa para renovar")
        return null
      }

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error("Erro ao renovar token:", error)
        return null
      }

      return data.session
    } catch (error) {
      console.error("Erro ao tentar renovar token:", error)
      return null
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()

      // Primeiro, verificar se há uma sessão válida
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError)
        return null
      }

      // Se não houver sessão, não tentar renovar automaticamente
      if (!session) {
        return null
      }

      // Obter dados do usuário autenticado
      const { data: authUser, error: userError } = await supabase.auth.getUser()

      if (userError || !authUser.user) {
        console.error("Erro ao obter usuário:", userError)
        return null
      }

      try {
        // Buscar dados completos do usuário do banco de dados
        const user = await userService.getUserById(authUser.user.id)
        return user
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err)

        // Retornar um usuário básico se não conseguir buscar os dados completos
        return {
          id: authUser.user.id,
          email: authUser.user.email || "",
          name: authUser.user.user_metadata?.name || "",
          cpf: authUser.user.user_metadata?.cpf || "",
          birth_date: authUser.user.user_metadata?.birth_date || "",
          phone_number: authUser.user.user_metadata?.phone_number || "",
          points: 0,
          loyalty_level_id: 1, // Bronze por padrão
          created_at: authUser.user.created_at,
          updated_at: authUser.user.updated_at,
        } as User
      }
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      return null
    }
  }

  async getServerUser() {
    try {
      const supabase = getSupabaseClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return null
      }

      const { data: authUser } = await supabase.auth.getUser()

      if (!authUser.user) {
        return null
      }

      try {
        // Buscar dados completos do usuário do banco de dados
        const user = await userService.getUserById(authUser.user.id)
        return user
      } catch (err) {
        console.error("Erro ao buscar dados do usuário no servidor:", err)

        // Retornar um usuário básico se não conseguir buscar os dados completos
        return {
          id: authUser.user.id,
          email: authUser.user.email || "",
          name: authUser.user.user_metadata?.name || "",
          cpf: authUser.user.user_metadata?.cpf || "",
          birth_date: authUser.user.user_metadata?.birth_date || "",
          phone_number: authUser.user.user_metadata?.phone_number || "",
          points: 0,
          loyalty_level_id: 1, // Bronze por padrão
          created_at: authUser.user.created_at,
          updated_at: authUser.user.updated_at,
        } as User
      }
    } catch (error) {
      console.error("Erro ao obter usuário no servidor:", error)
      return null
    }
  }
}

export const authService = new AuthService()
