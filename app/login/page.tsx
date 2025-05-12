"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { signIn, signUp, isLoading } = useAuth()
  const { toast } = useToast()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.id]: e.target.value,
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signIn(loginData.email, loginData.password)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos os campos obrigatórios
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.cpf ||
      !registerData.birthDate ||
      !registerData.phoneNumber
    ) {
      toast({
        title: "Erro no cadastro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    // Validar CPF (apenas números)
    const cpfOnlyNumbers = registerData.cpf.replace(/\D/g, "")
    if (cpfOnlyNumbers.length !== 11) {
      toast({
        title: "Erro no cadastro",
        description: "CPF inválido. Digite um CPF com 11 dígitos.",
        variant: "destructive",
      })
      return
    }

    // Validar telefone (apenas números)
    const phoneOnlyNumbers = registerData.phoneNumber.replace(/\D/g, "")
    if (phoneOnlyNumbers.length < 10) {
      toast({
        title: "Erro no cadastro",
        description: "Telefone inválido. Digite um telefone válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await signUp(
        registerData.email,
        registerData.password,
        registerData.name,
        cpfOnlyNumbers,
        registerData.birthDate,
        phoneOnlyNumbers,
      )
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para formatar o CPF enquanto o usuário digita
  const formatCPF = (value: string) => {
    const cpfOnlyNumbers = value.replace(/\D/g, "")
    let formattedCPF = cpfOnlyNumbers

    if (cpfOnlyNumbers.length > 3) {
      formattedCPF = cpfOnlyNumbers.replace(/^(\d{3})(\d)/, "$1.$2")
    }
    if (cpfOnlyNumbers.length > 6) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    }
    if (cpfOnlyNumbers.length > 9) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    }

    return formattedCPF
  }

  // Função para formatar o telefone enquanto o usuário digita
  const formatPhone = (value: string) => {
    const phoneOnlyNumbers = value.replace(/\D/g, "")
    let formattedPhone = phoneOnlyNumbers

    if (phoneOnlyNumbers.length > 0) {
      formattedPhone = phoneOnlyNumbers.replace(/^(\d{2})(\d)/, "($1) $2")
    }
    if (phoneOnlyNumbers.length > 6) {
      formattedPhone = formattedPhone.replace(/^($$\d{2}$$)(\s)(\d{5})(\d)/, "$1$2$3-$4")
    }

    return formattedPhone
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value)
    setRegisterData({
      ...registerData,
      cpf: formattedCPF,
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value)
    setRegisterData({
      ...registerData,
      phoneNumber: formattedPhone,
    })
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
            <h1 className="text-2xl font-bold text-center">Bem-vindo ao Club OX</h1>
            <p className="text-muted-foreground text-center">Entre para desfrutar de benefícios exclusivos</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/esqueci-senha" className="text-xs text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button">
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    <FaFacebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" type="text" required value={registerData.name} onChange={handleRegisterChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                    value={registerData.cpf}
                    onChange={handleCPFChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    required
                    value={registerData.birthDate}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telefone</Label>
                  <Input
                    id="phoneNumber"
                    type="text"
                    placeholder="(00) 00000-0000"
                    required
                    maxLength={15}
                    value={registerData.phoneNumber}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button">
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    <FaFacebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
