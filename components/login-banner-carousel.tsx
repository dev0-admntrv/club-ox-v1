"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { bannerService } from "@/lib/services/banner-service"
import type { Banner as BannerType } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LoginBannerCarousel() {
  const [banners, setBanners] = useState<BannerType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBanners()
        setBanners(data)
      } catch (err) {
        setError("Erro ao carregar banners")
        console.error("Erro ao carregar banners:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Carregando banners...</p>
      </div>
    )
  }

  if (error || banners.length === 0) {
    return null
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
              <Image
                src={banner.image_url || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 max-w-md">
                <h3 className="text-white text-2xl font-bold mb-2">{banner.title}</h3>
                <p className="text-white/90 mb-4">{banner.description}</p>
                {banner.cta_link && (
                  <Link href={banner.cta_link}>
                    <Button variant="secondary" size="sm">
                      Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  )
}
