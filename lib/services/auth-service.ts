"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"

export const authService = {
  async signUp(email: string, password: string, name: string, cpf: string, birthDate: string, phoneNumber: string) {
    const supabase = getSupabaseClient()

    // Registrar o usuário na autenticação do Supabase com metadados
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError) throw authError

    // Não precisamos mais inserir manualmente na tabela users
    // O trigger handle_new_user() fará isso automaticamente

    return authData
  },

  async signIn(email: string, password: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabaseClient()

    // Obter o usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Obter o perfil do usuário com o nível de fidelidade
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        loyalty_level:loyalty_levels(*)
      `)
      .eq("id", user.id)
      .single()

    if (error) throw error

    return data as unknown as User
  },

  async resetPassword(email: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },
}
