"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { bannerService } from "@/lib/services/banner-service"
import { useToast } from "@/hooks/use-toast"

export default function SeedBanners() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const bannerData = [
    {
      title: "Cortes Premium OX",
      description: "Experimente nossos cortes premium, selecionados e preparados pelos melhores chefs.",
      imagePath: "/banners/premium-steak-banner.jpg",
      cta_link: "/cardapio",
    },
    {
      title: "Harmonização de Vinhos",
      description: "Participe de nossos eventos exclusivos de harmonização com os melhores vinhos.",
      imagePath: "/banners/wine-pairing-banner.jpg",
      cta_link: "/eventos",
    },
    {
      title: "Experiência VIP",
      description: "Conheça nossa experiência gastronômica exclusiva para membros VIP.",
      imagePath: "/banners/exclusive-event-banner.jpg",
      cta_link: "/reservas-nova",
    },
  ]

  const handleSeedBanners = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const results = []

      for (const banner of bannerData) {
        // Simular o upload da imagem para o Storage do Supabase
        // Em um ambiente real, você faria o upload do arquivo
        const imageUrl = `https://oxsteakhouse.com${banner.imagePath}`

        // Criar o banner no banco de dados
        const newBanner = await bannerService.createBanner({
          title: banner.title,
          description: banner.description,
          image_url: imageUrl,
          cta_link: banner.cta_link,
          is_active: true,
          display_order: bannerData.indexOf(banner),
        })

        results.push(newBanner)
      }

      setResult(`Banners inseridos com sucesso: ${results.length} banners criados.`)
      toast({
        title: "Sucesso!",
        description: `${results.length} banners foram inseridos no banco de dados.`,
      })
    } catch (error) {
      console.error("Erro ao inserir banners:", error)
      setResult(`Erro ao inserir banners: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao inserir os banners. Verifique o console para mais detalhes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inserir Banners no Banco de Dados</h1>

      <div className="bg-card rounded-lg p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-2">Banners a serem inseridos:</h2>
        <ul className="space-y-4">
          {bannerData.map((banner, index) => (
            <li key={index} className="border-b pb-4 last:border-0">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Imagem: {banner.imagePath}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                  <p className="text-xs">Link: {banner.cta_link}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={handleSeedBanners} disabled={isLoading} className="mb-4">
        {isLoading ? "Inserindo banners..." : "Inserir Banners"}
      </Button>

      {result && (
        <div className={`p-4 rounded-md ${result.includes("Erro") ? "bg-destructive/10" : "bg-primary/10"}`}>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}
