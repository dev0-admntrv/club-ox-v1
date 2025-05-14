"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { userService } from "./user-service"

export const authService = {
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
  },

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
  },

  async signOut() {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Erro ao fazer logout:", error)
      throw new Error(error.message)
    }
  },

  async resetPassword(email: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      throw new Error(error.message)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        return null
      }

      const { data: authUser, error: userError } = await supabase.auth.getUser()

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
  },

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
  },
}
