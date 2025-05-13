"use client"

import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { isExternalUrl } from "@/lib/image-utils"

interface ResponsiveImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
  aspectRatio?: "square" | "video" | "wide" | "auto"
  containerClassName?: string
}

export function ResponsiveImage({
  src,
  alt,
  fill = false,
  className,
  fallbackSrc = "/abstract-colorful-swirls.png",
  aspectRatio = "auto",
  containerClassName,
  ...props
}: ResponsiveImageProps) {
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    // Função para verificar e processar a URL da imagem
    const processImageUrl = async () => {
      if (!src) {
        setImageSrc(fallbackSrc)
        return
      }

      // Se for uma URL externa, use diretamente
      if (typeof src === "string" && isExternalUrl(src)) {
        setImageSrc(src)
        return
      }

      // Se for uma URL do Supabase Storage
      if (typeof src === "string" && src.includes("storage.googleapis.com")) {
        try {
          // Adicionar timestamp para evitar cache
          const url = new URL(src)
          url.searchParams.append("t", Date.now().toString())
          setImageSrc(url.toString())
        } catch (e) {
          console.error("Erro ao processar URL do Supabase:", e)
          setImageSrc(src)
        }
        return
      }

      // Para imagens locais ou outras URLs
      setImageSrc(src as string)
    }

    processImageUrl()
  }, [src, fallbackSrc])

  const handleError = () => {
    console.error(`Erro ao carregar imagem: ${src}`)
    setError(true)
  }

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
    auto: "",
  }

  const finalImageSrc = error ? fallbackSrc : imageSrc || fallbackSrc

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <Image
          src={finalImageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={cn("object-cover transition-all", className)}
          onError={handleError}
          {...props}
        />
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden", aspectRatioClasses[aspectRatio], containerClassName)}>
      <Image
        src={finalImageSrc || "/placeholder.svg"}
        alt={alt}
        className={cn("h-auto w-full object-cover transition-all", className)}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
