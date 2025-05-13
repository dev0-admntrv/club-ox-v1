"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { bannerService } from "@/lib/services/banner-service"
import { useToast } from "@/hooks/use-toast"

export default function SeedBanners() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSeedBanners = async () => {
    try {
      setIsLoading(true)

      // Banners a serem inseridos
      const banners = [
        {
          title: "Experimente Nossos Cortes Premium",
          description: "Desfrute dos melhores cortes de carne, preparados com perfeição",
          image_url: "/banners/premium-steak-banner.jpg",
          cta_link: "/cardapio",
          is_active: true,
          display_order: 1,
        },
        {
          title: "Harmonização de Vinhos",
          description: "Participe de nossos eventos exclusivos de harmonização",
          image_url: "/banners/wine-pairing-banner.jpg",
          cta_link: "/experiencias",
          is_active: true,
          display_order: 2,
        },
        {
          title: "Eventos Exclusivos",
          description: "Acesso VIP a jantares e experiências gastronômicas únicas",
          image_url: "/banners/exclusive-event-banner.jpg",
          cta_link: "/eventos",
          is_active: true,
          display_order: 3,
        },
      ]

      // Inserir cada banner
      for (const banner of banners) {
        await bannerService.createBanner(banner)
      }

      toast({
        title: "Banners inseridos com sucesso",
        description: `${banners.length} banners foram adicionados ao banco de dados.`,
      })
    } catch (error) {
      console.error("Erro ao inserir banners:", error)
      toast({
        title: "Erro ao inserir banners",
        description: "Ocorreu um erro ao adicionar os banners ao banco de dados.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inserir Banners no Banco de Dados</h1>
      <p className="mb-4">Este script irá inserir os banners padrão no banco de dados Supabase.</p>
      <Button onClick={handleSeedBanners} disabled={isLoading}>
        {isLoading ? "Inserindo banners..." : "Inserir Banners"}
      </Button>
    </div>
  )
}
