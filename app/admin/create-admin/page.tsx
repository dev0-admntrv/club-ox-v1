"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("admin@oxsteakhouse.com")
  const [password, setPassword] = useState("123456")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCreateAdmin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = getSupabaseClient()

      // Registrar o usuário no sistema de autenticação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: "Administrador",
            role: "admin",
          },
        },
      })

      if (error) throw error

      // Verificar se o usuário já existe na tabela users
      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      if (userCheckError && userCheckError.code !== "PGRST116") {
        throw userCheckError
      }

      // Se o usuário não existir na tabela users, criá-lo
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user?.id,
          email: email,
          name: "Administrador",
          role: "admin",
          loyalty_level_id: "3", // Nível mais alto (ajuste conforme necessário)
          points: 1000,
        })

        if (insertError) throw insertError
      }

      setResult(`Usuário administrador criado com sucesso! ID: ${data.user?.id}`)
      toast({
        title: "Sucesso!",
        description: "Usuário administrador criado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao criar usuário admin:", error)
      setResult(`Erro ao criar usuário admin: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o usuário administrador.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Usuário Administrador</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button onClick={handleCreateAdmin} disabled={isLoading} className="w-full">
          {isLoading ? "Criando..." : "Criar Administrador"}
        </Button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.includes("Erro") ? "bg-destructive/10" : "bg-primary/10"}`}>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}
