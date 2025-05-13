"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { BackButton } from "@/components/ui/back-button"
import { CloseButton } from "@/components/ui/close-button"
import { BottomNav } from "@/components/bottom-nav"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface EmbeddedWebViewProps {
  url: string
  title?: string
}

export function EmbeddedWebView({ url, title = "Visualização Externa" }: EmbeddedWebViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Set a timeout to simulate loading and then hide the skeleton
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [url])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <BackButton onClick={() => router.back()} />
            <h1 className="text-xl font-bold truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <CloseButton onClick={() => router.push("/home")} />
            <Logo className="scale-75" />
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 p-4 z-10">
            <Skeleton className="w-full h-32 mb-4 rounded-lg" />
            <Skeleton className="w-full h-24 mb-4 rounded-lg" />
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full min-h-[calc(100vh-8rem)]"
          onLoad={() => setIsLoading(false)}
          style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
        />
      </main>

      <BottomNav />
    </div>
  )
}
