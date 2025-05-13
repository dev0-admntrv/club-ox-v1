"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"
import { getBannerFallbackImage, isValidImagePath } from "@/lib/image-utils"

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

    try {
      const { data, error } = await query

      if (error) {
        console.error("Erro ao buscar banners:", error)
        throw error
      }

      // Processar banners para garantir que as imagens sejam válidas
      const processedBanners = data.map((banner) => {
        // Verificar se a URL da imagem é válida
        if (!banner.image_url || !isValidImagePath(banner.image_url)) {
          console.warn(`Banner com URL de imagem inválida: ${banner.id}`)
          // Substituir por uma imagem padrão baseada no tipo de banner
          banner.image_url = getBannerFallbackImage(banner.id, banner.title)
        }

        // Verificar se é uma URL problemática conhecida
        if (banner.image_url.includes("url_banner_desafio.jpg")) {
          console.warn("Banner com imagem problemática detectado:", banner.id)
          banner.image_url = "/banners/challenge-banner.jpg"
        }

        // Se a imagem não começar com http ou /, adicionar / no início
        if (!banner.image_url.startsWith("http") && !banner.image_url.startsWith("/")) {
          banner.image_url = `/${banner.image_url}`
        }

        return banner
      })

      return processedBanners
    } catch (error) {
      console.error("Erro ao processar banners:", error)
      return []
    }
  },
}
