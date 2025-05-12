"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/lib/services/user-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function DadosPessoaisPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phoneNumber: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !isLoading) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        cpf: user.cpf || "",
        birthDate: user.birth_date ? format(new Date(user.birth_date), "yyyy-MM-dd") : "",
        phoneNumber: user.phone_number || "",
      })
    }
  }, [user, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    try {
      await userService.updateUserProfile(user.id, {
        name: formData.name,
        cpf: formData.cpf,
        birth_date: formData.birthDate,
        phone_number: formData.phoneNumber,
      })

      toast({
        title: "Perfil atualizado",
        description: "Seus dados pessoais foram atualizados com sucesso.",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seus dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value)
    setFormData((prev) => ({ ...prev, cpf: formattedValue }))
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value)
    setFormData((prev) => ({ ...prev, phoneNumber: formattedValue }))
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Dados Pessoais</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded"></div>
              <div className="h-6 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded"></div>
              <div className="h-6 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Dados Pessoais</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas informações</CardTitle>
          <CardDescription>Atualize seus dados pessoais. Seu e-mail não pode ser alterado.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" value={formData.email} disabled />
              <p className="text-xs text-muted-foreground">Para alterar seu e-mail, entre em contato com o suporte.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleCPFChange} maxLength={14} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Telefone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                maxLength={15}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Salvando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Salvar alterações
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
