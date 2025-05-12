"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function EsqueciSenhaPage() {
  const { resetPassword, isLoading } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await resetPassword(email)
      setSubmitted(true)
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1-e1718106048155%20%281%29-INfZzptdk096qVsjKkK50rH26MTwbe.png"
              alt="OX Steakhouse"
              width={120}
              height={60}
              className="h-auto"
            />
            <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
            <p className="text-muted-foreground text-center">
              Informe seu e-mail para receber instruções de recuperação
            </p>
          </div>

          {submitted ? (
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <h2 className="font-medium text-primary mb-2">E-mail enviado!</h2>
              <p className="text-sm mb-4">
                Enviamos instruções para redefinir sua senha para {email}. Verifique sua caixa de entrada.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
