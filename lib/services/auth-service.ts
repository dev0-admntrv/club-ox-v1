"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"

export const authService = {
  async signUp(email: string, password: string, name: string, cpf: string, birthDate: string) {
    const supabase = getSupabaseClient()

    // Registrar o usuário na autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // Criar o perfil do usuário na tabela users
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        cpf,
        birth_date: birthDate,
        points_balance: 0,
        role: "user",
      })

      if (profileError) throw profileError
    }

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
