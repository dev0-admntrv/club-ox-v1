"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"

class BannerService {
  async getBanners(): Promise<Banner[]> {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Erro ao buscar banners:", error)
        return this.getLocalBanners() // Fallback para banners locais
      }

      return data as Banner[]
    } catch (error) {
      console.error("Erro ao buscar banners:", error)
      return this.getLocalBanners() // Fallback para banners locais
    }
  }

  async createBanner(banner: Partial<Banner>): Promise<Banner> {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from("banners")
        .insert([
          {
            title: banner.title,
            description: banner.description,
            image_url: banner.image_url,
            cta_link: banner.cta_link,
            is_active: banner.is_active ?? true,
            display_order: banner.display_order ?? 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        console.error("Erro ao criar banner:", error)
        throw new Error(`Erro ao criar banner: ${error.message}`)
      }

      return data[0] as Banner
    } catch (error) {
      console.error("Erro ao criar banner:", error)
      throw error
    }
  }

  // Método para obter banners locais como fallback
  getLocalBanners(): Banner[] {
    return [
      {
        id: "1",
        title: "Cortes Premium OX",
        description: "Experimente nossos cortes premium, selecionados e preparados pelos melhores chefs.",
        image_url: "/banners/premium-steak-banner.jpg",
        cta_link: "/cardapio",
        is_active: true,
        display_order: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Harmonização de Vinhos",
        description: "Participe de nossos eventos exclusivos de harmonização com os melhores vinhos.",
        image_url: "/banners/wine-pairing-banner.jpg",
        cta_link: "/eventos",
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Experiência VIP",
        description: "Conheça nossa experiência gastronômica exclusiva para membros VIP.",
        image_url: "/banners/exclusive-event-banner.jpg",
        cta_link: "/reservas-nova",
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
      },
    ]
  }
}

export const bannerService = new BannerService()
