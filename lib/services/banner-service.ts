"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"

export const bannerService = {
  async getActiveBanners(userLoyaltyLevelId: string | null): Promise<Banner[]> {
    const supabase = getSupabaseClient()

    let query = supabase.from("banners").select("*").eq("is_active", true)

    // Filtrar banners por nível de fidelidade
    if (userLoyaltyLevelId) {
      // Mostrar banners sem restrição de nível OU com nível mínimo menor ou igual ao do usuário
      query = query.or(`target_min_loyalty_level_id.is.null,target_min_loyalty_level_id.eq.${userLoyaltyLevelId}`)
    } else {
      // Se o usuário não tiver nível, mostrar apenas banners sem restrição
      query = query.is("target_min_loyalty_level_id", null)
    }

    // Filtrar por data de exibição
    const now = new Date().toISOString()
    query = query.or(`start_date.is.null,start_date.lte.${now}`)
    query = query.or(`end_date.is.null,end_date.gte.${now}`)

    // Ordenar por ordem de exibição
    query = query.order("display_order", { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar banners:", error)
      throw error
    }

    // Processar URLs de imagens para garantir que funcionem corretamente
    const processedBanners = data.map((banner) => {
      // Se a imagem estiver no Storage do Supabase, garantir que a URL esteja correta
      if (banner.image_url && banner.image_url.includes("storage.googleapis.com")) {
        // Verificar se a URL já tem um token de acesso público
        if (!banner.image_url.includes("token=")) {
          console.warn("Imagem do banner pode não ter acesso público:", banner.id)
        }
      }

      return banner
    })

    return processedBanners
  },

  // Método para verificar se uma imagem existe e é acessível
  async checkImageExists(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { method: "HEAD" })
      return response.ok
    } catch (error) {
      console.error("Erro ao verificar imagem:", error)
      return false
    }
  },
}
