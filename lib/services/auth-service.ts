"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { userService } from "./user-service"

class AuthService {
  private supabase = getSupabaseClient()

  async signUp(email: string, password: string, name: string, cpf: string, birthDate: string, phoneNumber: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
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
    } catch (error) {
      console.error("Erro no serviço de autenticação (signUp):", error)
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro ao fazer login:", error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error("Erro no serviço de autenticação (signIn):", error)
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Erro no serviço de autenticação (signOut):", error)
      throw error
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Erro no serviço de autenticação (resetPassword):", error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await this.supabase.auth.getSession()

      if (sessionError || !session) {
        return null
      }

      const { data: authUser, error: userError } = await this.supabase.auth.getUser()

      if (userError || !authUser.user) {
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
          points_balance: 0,
          loyalty_level_id: "1", // Bronze por padrão
          created_at: authUser.user.created_at,
          updated_at: authUser.user.updated_at,
        } as User
      }
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      return null
    }
  }
}

export const authService = new AuthService()
