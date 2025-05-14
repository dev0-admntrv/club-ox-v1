"use client"

import { useOffline } from "@/hooks/use-offline"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnimation } from "@/hooks/use-animation"
import { useEffect } from "react"

export function OfflineBanner() {
  const isOffline = useOffline()
  const animation = useAnimation({
    initialState: "exited",
    enterDelay: 300,
    exitDelay: 500,
  })

  useEffect(() => {
    if (isOffline) {
      animation.enter()
    } else {
      animation.exit()
    }
  }, [isOffline, animation])

  if (!animation.isVisible) return null

  return (
    <div
      className={`fixed bottom-20 left-0 right-0 z-50 px-4 transition-all duration-300 transform ${
        animation.isEntered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <Alert variant="destructive" className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>Você está offline. Algumas funcionalidades podem estar limitadas.</AlertDescription>
        </div>
        <Button size="sm" variant="outline" className="ml-2 bg-background" onClick={() => window.location.reload()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Reconectar
        </Button>
      </Alert>
    </div>
  )
}
