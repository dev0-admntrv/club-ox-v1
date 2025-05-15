"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ProgressRingProps {
  value: number
  size: number
  strokeWidth: number
  className?: string
  children?: React.ReactNode
}

export function ProgressRing({ value, size, strokeWidth, className = "", children }: ProgressRingProps) {
  const [offset, setOffset] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    // Garantir que value seja um número válido entre 0 e 100
    const safeValue = isNaN(value) ? 0 : Math.max(0, Math.min(100, value))
    const progressOffset = ((100 - safeValue) / 100) * circumference
    setOffset(progressOffset)
  }, [value, circumference])

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle text-primary stroke-current"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
