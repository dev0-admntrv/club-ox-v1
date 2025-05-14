"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Algo deu errado</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver o problema.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
          <Button
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
          >
            Voltar
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-6 p-4 bg-muted rounded-md text-left overflow-auto max-w-full">
            <p className="font-mono text-sm">{error.toString()}</p>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}
