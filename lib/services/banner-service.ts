"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"

export const bannerService = {
  async getActiveBanners(userLoyaltyLevelId: string | null): Promise<Banner[]> {
    try {
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

      if (error) throw error

      // Se não houver banners no banco de dados, retornar banners locais
      if (!data || data.length === 0) {
        return this.getLocalBanners()
      }

      return data
    } catch (error) {
      console.error("Erro ao buscar banners:", error)
      // Em caso de erro, retornar banners locais
      return this.getLocalBanners()
    }
  },

  getLocalBanners(): Banner[] {
    return [
      {
        id: "local-1",
        title: "Experimente Nossos Cortes Premium",
        description: "Desfrute dos melhores cortes de carne, preparados com perfeição",
        image_url: "/banners/premium-steak-banner.jpg",
        cta_link: "/cardapio",
        is_active: true,
        display_order: 1,
      },
      {
        id: "local-2",
        title: "Harmonização de Vinhos",
        description: "Participe de nossos eventos exclusivos de harmonização",
        image_url: "/banners/wine-pairing-banner.jpg",
        cta_link: "/experiencias",
        is_active: true,
        display_order: 2,
      },
      {
        id: "local-3",
        title: "Eventos Exclusivos",
        description: "Acesso VIP a jantares e experiências gastronômicas únicas",
        image_url: "/banners/exclusive-event-banner.jpg",
        cta_link: "/eventos",
        is_active: true,
        display_order: 3,
      },
    ]
  },
}
