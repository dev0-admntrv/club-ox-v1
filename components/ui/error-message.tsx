"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title = "Erro ao carregar dados",
  message = "Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.",
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={`${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="w-fit flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
