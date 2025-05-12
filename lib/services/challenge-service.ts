"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Challenge } from "@/lib/types"

export const challengeService = {
  async getActiveChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("challenges")
      .select(`
        *,
        user_challenge:user_challenges!inner(*)
      `)
      .eq("is_active", true)
      .eq("user_challenge.user_id", userId)
      .eq("user_challenge.status", "in_progress")

    if (error) throw error

    return data as unknown as Challenge[]
  },

  async getAvailableChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    // Obter desafios ativos que o usuário ainda não iniciou
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("is_active", true)
      .not("id", "in", (sb) => sb.from("user_challenges").select("challenge_id").eq("user_id", userId))

    if (error) throw error

    return data
  },

  async getCompletedChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("challenges")
      .select(`
        *,
        user_challenge:user_challenges!inner(*)
      `)
      .eq("user_challenge.user_id", userId)
      .eq("user_challenge.status", "completed")

    if (error) throw error

    return data as unknown as Challenge[]
  },

  async startChallenge(userId: string, challengeId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("user_challenges")
      .insert({
        user_id: userId,
        challenge_id: challengeId,
        status: "in_progress",
        progress_details: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return data[0]
  },

  async updateChallengeProgress(userChallengeId: string, progressDetails: any) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("user_challenges")
      .update({
        progress_details: progressDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userChallengeId)
      .select()

    if (error) throw error

    return data[0]
  },

  async completeChallenge(userChallengeId: string, userId: string, pointsReward: number) {
    const supabase = getSupabaseClient()

    // Iniciar uma transação para atualizar o desafio e adicionar pontos
    // Nota: Supabase não suporta transações diretamente via API, então fazemos operações sequenciais

    // 1. Atualizar o status do desafio
    const { data: challengeData, error: challengeError } = await supabase
      .from("user_challenges")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userChallengeId)
      .select()

    if (challengeError) throw challengeError

    // 2. Adicionar transação de pontos
    const { data: transactionData, error: transactionError } = await supabase
      .from("points_transactions")
      .insert({
        user_id: userId,
        points_change: pointsReward,
        transaction_type: "CHALLENGE_COMPLETION",
        related_user_challenge_id: userChallengeId,
        description: `Conclusão de desafio: ${challengeData[0].challenge_id}`,
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()

    if (transactionError) throw transactionError

    // 3. Atualizar o saldo de pontos do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("points_balance")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    const newBalance = (userData.points_balance || 0) + pointsReward

    const { error: updateError } = await supabase
      .from("users")
      .update({
        points_balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) throw updateError

    return {
      challenge: challengeData[0],
      transaction: transactionData[0],
      newPointsBalance: newBalance,
    }
  },
}
