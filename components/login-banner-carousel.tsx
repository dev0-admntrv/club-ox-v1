"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel"
import { Banner } from "@/components/banner"
import { bannerService } from "@/lib/services/banner-service"
import type { Banner as BannerType } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function LoginBannerCarousel() {
  const [banners, setBanners] = useState<BannerType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true)
        // Não passamos o nível de fidelidade, pois o usuário ainda não está logado
        const data = await bannerService.getActiveBanners(null)
        setBanners(data)
      } catch (error) {
        console.error("Erro ao buscar banners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto mb-8">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Banner
                imageUrl={banner.image_url}
                title={banner.title}
                description={banner.description || ""}
                ctaLink={banner.cta_link || undefined}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
        <CarouselDots count={banners.length} />
      </Carousel>
    </div>
  )
}
