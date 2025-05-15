"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ProgressRingProps {
  value: number
  size: number
  strokeWidth: number
  className?: string
  children?: React.ReactNode
  responsive?: boolean
}

export function ProgressRing({
  value,
  size,
  strokeWidth,
  className = "",
  children,
  responsive = false,
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0)
  const [dimensions, setDimensions] = useState({ size, strokeWidth })

  // Ajusta o tamanho do anel com base no tamanho da tela quando responsive=true
  useEffect(() => {
    if (!responsive) return

    function handleResize() {
      const width = window.innerWidth
      let newSize = size
      let newStrokeWidth = strokeWidth

      if (width < 640) {
        // Mobile
        newSize = Math.round(size * 0.85)
        newStrokeWidth = Math.round(strokeWidth * 0.85)
      } else if (width < 768) {
        // Tablet pequeno
        newSize = Math.round(size * 0.9)
        newStrokeWidth = Math.round(strokeWidth * 0.9)
      }

      setDimensions({ size: newSize, strokeWidth: newStrokeWidth })
    }

    // Configuração inicial
    handleResize()

    // Adiciona listener para redimensionamento
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [responsive, size, strokeWidth])

  const radius = (dimensions.size - dimensions.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    // Garantir que value seja um número válido entre 0 e 100
    const safeValue = isNaN(value) ? 0 : Math.max(0, Math.min(100, value))
    const progressOffset = ((100 - safeValue) / 100) * circumference
    setOffset(progressOffset)
  }, [value, circumference])

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        width: `${dimensions.size}px`,
        height: `${dimensions.size}px`,
        minWidth: `${dimensions.size}px`,
        minHeight: `${dimensions.size}px`,
      }}
    >
      <svg
        width={dimensions.size}
        height={dimensions.size}
        viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
        className="absolute inset-0"
      >
        <circle
          className="text-muted stroke-current"
          strokeWidth={dimensions.strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
        />
        <circle
          className="progress-ring-circle text-primary stroke-current"
          strokeWidth={dimensions.strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          style={{ transition: "stroke-dashoffset 0.35s ease" }}
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
    </div>
  )
}
