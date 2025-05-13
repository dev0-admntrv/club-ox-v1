"use client"

import { useState, useEffect } from "react"
import { SafeIframe } from "@/components/safe-iframe"
import { SelfServiceFallback } from "@/components/self-service-fallback"

export default function SelfServicePage() {
  const menuUrl = "https://menudigital.lexsis.com.br/?l=UMthdgF1"
  const [iframeSupported, setIframeSupported] = useState(true)

  useEffect(() => {
    // Verificar se o dispositivo suporta iframes adequadamente
    // Alguns dispositivos móveis podem ter problemas com iframes
    const checkIframeSupport = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /iphone|ipad|ipod|android/.test(userAgent)

      // Se for um dispositivo móvel antigo ou com limitações conhecidas
      if (
        isMobile &&
        ((userAgent.includes("firefox/") && Number.parseInt(userAgent.split("firefox/")[1]) < 90) ||
          (userAgent.includes("chrome/") && Number.parseInt(userAgent.split("chrome/")[1]) < 80))
      ) {
        setIframeSupported(false)
      }
    }

    checkIframeSupport()
  }, [])

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="bg-background border-b border-border/50 p-4 flex items-center justify-center">
        <h1 className="text-xl font-bold text-center">Menu Digital</h1>
      </header>

      <div className="flex-1 w-full">
        {iframeSupported ? (
          <SafeIframe src={menuUrl} title="Menu Digital OX Steakhouse" className="w-full h-full" />
        ) : (
          <SelfServiceFallback url={menuUrl} />
        )}
      </div>
    </div>
  )
}
