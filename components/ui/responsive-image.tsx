"use client"

import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { isValidImagePath } from "@/lib/image-utils"

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
    // Reset error state when src changes
    setError(false)

    // Process image URL
    if (!src) {
      setImageSrc(fallbackSrc)
      return
    }

    const srcString = src.toString()

    // Verificar se o caminho da imagem é válido
    if (!isValidImagePath(srcString)) {
      console.warn(`Caminho de imagem inválido: ${srcString}, usando fallback`)
      setError(true)
      return
    }

    // Handle specific problematic images
    if (srcString.includes("url_banner_desafio.jpg")) {
      console.warn("Imagem problemática detectada, usando fallback:", srcString)
      setError(true)
      return
    }

    // Normalizar o caminho da imagem (garantir que comece com /)
    if (!srcString.startsWith("http") && !srcString.startsWith("/")) {
      setImageSrc(`/${srcString}`)
    } else {
      setImageSrc(srcString)
    }
  }, [src, fallbackSrc])

  const handleImageError = () => {
    console.warn(`Erro ao carregar imagem: ${src}`)
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
          onError={handleImageError}
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
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}
