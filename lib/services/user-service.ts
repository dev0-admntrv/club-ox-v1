"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { User, PointsTransaction, UserBadge, UserChallenge } from "@/lib/types"

export const userService = {
  async getUserProfile(userId: string): Promise<User> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        loyalty_level:loyalty_levels(*)
      `)
      .eq("id", userId)
      .single()

    if (error) throw error

    return data as unknown as User
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) throw error

    return data[0]
  },

  async getUserPointsTransactions(userId: string): Promise<PointsTransaction[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })

    if (error) throw error

    return data
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badges(*)
      `)
      .eq("user_id", userId)

    if (error) throw error

    return data as unknown as UserBadge[]
  },

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("user_challenges").select("*").eq("user_id", userId)

    if (error) throw error

    return data
  },
}
