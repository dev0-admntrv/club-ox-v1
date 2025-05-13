"use client"

import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

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

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
    auto: "",
  }

  const imageSource = error ? fallbackSrc : src

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    console.error(`Erro ao carregar imagem: ${src}`)
    setError(true)
  }

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <Image
          src={imageSource || "/placeholder.svg"}
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
        src={imageSource || "/placeholder.svg"}
        alt={alt}
        className={cn("h-auto w-full object-cover transition-all", className)}
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}
