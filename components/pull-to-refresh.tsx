"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  pullDownThreshold?: number
  maxPullDownDistance?: number
  backgroundColor?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  pullDownThreshold = 80,
  maxPullDownDistance = 120,
  backgroundColor = "bg-background",
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull to refresh when at the top of the page
      if (window.scrollY <= 0) {
        startYRef.current = e.touches[0].clientY
      } else {
        startYRef.current = null
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null) return
      if (isRefreshing) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startYRef.current

      // Only activate pull down when scrolling down from the top
      if (diff > 0 && window.scrollY <= 0) {
        // Calculate pull distance with resistance (gets harder to pull the further you go)
        const newDistance = Math.min(maxPullDownDistance, diff * 0.5)
        setPullDistance(newDistance)
        setIsPulling(true)

        // Prevent default scrolling behavior
        e.preventDefault()
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return

      if (pullDistance >= pullDownThreshold) {
        // Trigger refresh
        setIsRefreshing(true)
        setPullDistance(pullDownThreshold) // Keep indicator visible during refresh

        try {
          await onRefresh()
        } catch (error) {
          console.error("Refresh failed:", error)
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
          setIsPulling(false)
        }
      } else {
        // Reset without refreshing
        setPullDistance(0)
        setIsPulling(false)
      }

      startYRef.current = null
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, isRefreshing, pullDistance, pullDownThreshold, maxPullDownDistance, onRefresh])

  // Calculate progress percentage
  const progress = Math.min(100, (pullDistance / pullDownThreshold) * 100)

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull to refresh indicator */}
      <div
        className={`absolute left-0 right-0 flex items-center justify-center transition-transform duration-200 ${backgroundColor} z-10`}
        style={{
          height: `${pullDownThreshold}px`,
          transform: `translateY(${pullDistance - pullDownThreshold}px)`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        {isRefreshing ? (
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <div className="flex flex-col items-center">
            <ArrowDown
              className="h-6 w-6 text-primary transition-transform"
              style={{
                transform: `rotate(${Math.min(180, progress * 1.8)}deg)`,
              }}
            />
            <span className="text-xs text-muted-foreground mt-1">
              {progress >= 100 ? "Solte para atualizar" : "Puxe para atualizar"}
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: isPulling || isRefreshing ? `translateY(${pullDistance}px)` : "translateY(0px)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
