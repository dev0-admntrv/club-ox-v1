import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BannerProps {
  imageUrl: string
  title: string
  description: string
  ctaLink?: string
  ctaText?: string
  className?: string
}

export function Banner({ imageUrl, title, description, ctaLink, ctaText = "Saiba mais", className }: BannerProps) {
  return (
    <div className={cn("relative h-48 overflow-hidden rounded-xl card-shadow", className)}>
      <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
        <div className="mb-1 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-white/90">{description}</p>
        </div>
        {ctaLink && (
          <Button
            size="sm"
            variant="secondary"
            className="w-fit mt-2 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
            asChild
          >
            <Link href={ctaLink}>
              {ctaText}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
