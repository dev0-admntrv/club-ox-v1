"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 px-6 pb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Você está offline</h1>

          <p className="text-muted-foreground mb-6">
            Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>

            <Button asChild className="flex-1">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Página inicial
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
