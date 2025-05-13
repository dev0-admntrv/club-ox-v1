"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface SelfServiceFallbackProps {
  url: string
}

export function SelfServiceFallback({ url }: SelfServiceFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
      <div className="rounded-full bg-amber-100 p-4 mb-4">
        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">Menu Digital</h2>
      <p className="text-muted-foreground mb-6">
        O menu digital não pôde ser carregado dentro do aplicativo. Você pode acessá-lo diretamente clicando no botão
        abaixo.
      </p>
      <Button onClick={() => window.open(url, "_blank")} className="flex items-center gap-2">
        Abrir Menu Digital <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  )
}
