"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { userService } from "./user-service"

// Usar uma única instância do cliente Supabase
const supabase = getSupabaseClient()

class AuthService {
  async signUp(email: string, password: string, name: string, cpf: string, birthDate: string, phoneNumber: string) {
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
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Erro ao fazer logout:", error)
      throw new Error(error.message)
    }
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      throw new Error(error.message)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have a session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError)
        return null
      }

      if (!sessionData.session) {
        return null
      }

      // Then get the user
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Erro ao obter usuário:", userError)
        return null
      }

      if (!userData.user) {
        return null
      }

      try {
        // Buscar dados completos do usuário do banco de dados
        const user = await userService.getUserById(userData.user.id)
        return user
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err)

        // Retornar um usuário básico se não conseguir buscar os dados completos
        return {
          id: userData.user.id,
          email: userData.user.email || "",
          name: userData.user.user_metadata?.name || "",
          cpf: userData.user.user_metadata?.cpf || "",
          birth_date: userData.user.user_metadata?.birth_date || "",
          phone_number: userData.user.user_metadata?.phone_number || "",
          points: 0,
          loyalty_level_id: 1, // Bronze por padrão
          created_at: userData.user.created_at,
          updated_at: userData.user.updated_at,
        } as User
      }
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      return null
    }
  }
}

export const authService = new AuthService()
