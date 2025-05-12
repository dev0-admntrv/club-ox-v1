"use client"

import { getSupabaseClient } from "@/lib/supabase/client"

export const orderService = {
  async createRewardOrder(userId: string, productId: string, quantity: number, pointsCost: number) {
    const supabase = getSupabaseClient()

    // 1. Verificar se o usuário tem pontos suficientes
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("points_balance")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    const totalPointsCost = pointsCost * quantity

    if ((userData.points_balance || 0) < totalPointsCost) {
      throw new Error("Saldo de pontos insuficiente")
    }

    // 2. Criar o pedido
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_date: new Date().toISOString(),
        total_points_spent: totalPointsCost,
        status: "pending",
        order_type: "reward_redemption",
        created_at: new Date().toISOString(),
      })
      .select()

    if (orderError) throw orderError

    // 3. Adicionar o item ao pedido
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: orderData[0].id,
      product_id: productId,
      quantity: quantity,
      unit_points_cost: pointsCost,
      created_at: new Date().toISOString(),
    })

    if (itemError) throw itemError

    // 4. Registrar a transação de pontos
    const { error: transactionError } = await supabase.from("points_transactions").insert({
      user_id: userId,
      points_change: -totalPointsCost,
      transaction_type: "REWARD_REDEMPTION_SPENT",
      related_order_id: orderData[0].id,
      description: "Resgate de recompensa",
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    if (transactionError) throw transactionError

    // 5. Atualizar o saldo de pontos do usuário
    const newBalance = userData.points_balance - totalPointsCost

    const { error: updateError } = await supabase
      .from("users")
      .update({
        points_balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) throw updateError

    return {
      order: orderData[0],
      newPointsBalance: newBalance,
    }
  },

  async getUserOrders(userId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq("user_id", userId)
      .order("order_date", { ascending: false })

    if (error) throw error

    return data
  },
}
