"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Reservation, ExclusiveExperience } from "@/lib/types"

export const reservationService = {
  async getUserReservations(userId: string): Promise<Reservation[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("reservation_datetime", { ascending: true })

    if (error) throw error

    return data
  },

  async getReservationById(reservationId: string): Promise<Reservation> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        product:products(*)
      `)
      .eq("id", reservationId)
      .single()

    if (error) throw error

    return data as unknown as Reservation
  },

  async createTableReservation(
    userId: string,
    reservationDatetime: string,
    numberOfGuests: number,
    specialRequests: string | null,
    loyaltyLevelId: string | null,
  ): Promise<Reservation> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        user_id: userId,
        reservation_type: "table",
        reservation_datetime: reservationDatetime,
        number_of_guests: numberOfGuests,
        special_requests: specialRequests,
        status: "pending",
        loyalty_level_at_reservation_id: loyaltyLevelId,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return data[0]
  },

  async createDryAgedReservation(
    userId: string,
    reservationDatetime: string,
    productId: string,
    quantity: number,
    dryAgedPreferences: any,
    specialRequests: string | null,
    loyaltyLevelId: string | null,
  ): Promise<Reservation> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        user_id: userId,
        reservation_type: "dry_aged",
        reservation_datetime: reservationDatetime,
        product_id: productId,
        quantity: quantity,
        dry_aged_preferences: dryAgedPreferences,
        special_requests: specialRequests,
        status: "pending",
        loyalty_level_at_reservation_id: loyaltyLevelId,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return data[0]
  },

  async registerForExperience(userId: string, experienceId: string, numberOfGuests: number): Promise<{ id: string }> {
    const supabase = getSupabaseClient()

    // Primeiro, obter detalhes da experiência
    const { data: experienceData, error: experienceError } = await supabase
      .from("exclusive_experiences")
      .select("*")
      .eq("id", experienceId)
      .single()

    if (experienceError) throw experienceError

    // Registrar para a experiência
    const { data, error } = await supabase
      .from("user_experience_registrations")
      .insert({
        user_id: userId,
        experience_id: experienceId,
        registration_date: new Date().toISOString(),
        status: "confirmed",
        number_of_guests: numberOfGuests,
      })
      .select()

    if (error) throw error

    return data[0]
  },

  async cancelReservation(reservationId: string): Promise<void> {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from("reservations")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reservationId)

    if (error) throw error
  },

  async getAvailableExperiences(userLoyaltyLevelId: string | null): Promise<ExclusiveExperience[]> {
    const supabase = getSupabaseClient()

    const now = new Date().toISOString()

    let query = supabase
      .from("exclusive_experiences")
      .select("*")
      .eq("is_active", true)
      .gte("experience_datetime", now)
      .order("experience_datetime", { ascending: true })

    // Filtrar por nível de fidelidade se necessário
    if (userLoyaltyLevelId) {
      query = query.or(`min_loyalty_level_id_required.is.null,min_loyalty_level_id_required.eq.${userLoyaltyLevelId}`)
    } else {
      query = query.is("min_loyalty_level_id_required", null)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  },

  async getDryAgedProducts(userLoyaltyLevelId: string | null): Promise<any[]> {
    const supabase = getSupabaseClient()

    let query = supabase.from("products").select("*").eq("type", "DRY_AGED").eq("is_active", true)

    // Filtrar por nível de fidelidade
    if (userLoyaltyLevelId) {
      query = query.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
    } else {
      query = query.is("min_loyalty_level_id_to_view", null)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  },

  async getAvailableTimeSlots(date: string): Promise<string[]> {
    // Normalmente, isso seria uma chamada de API para verificar os horários disponíveis
    // Para este exemplo, retornaremos horários fixos
    return ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]
  },
}
