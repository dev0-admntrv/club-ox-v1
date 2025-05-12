"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, Lock, Moon, Shield, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Estados para as configurações
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    promotionsEnabled: true,
    reservationsEnabled: true,
    challengesEnabled: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    shareActivity: false,
    allowDataCollection: true,
  })

  const [themeSettings, setThemeSettings] = useState({
    darkMode: false,
  })

  // Estado para o diálogo de alteração de senha
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Função para atualizar configurações de notificação
  const updateNotificationSetting = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] }

      // Simulando salvamento das configurações
      setTimeout(() => {
        toast({
          title: "Configurações atualizadas",
          description: "Suas preferências de notificação foram salvas.",
          variant: "success",
        })
      }, 500)

      return newSettings
    })
  }

  // Função para atualizar configurações de privacidade
  const updatePrivacySetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] }

      // Simulando salvamento das configurações
      setTimeout(() => {
        toast({
          title: "Configurações atualizadas",
          description: "Suas preferências de privacidade foram salvas.",
          variant: "success",
        })
      }, 500)

      return newSettings
    })
  }

  // Função para atualizar tema
  const updateThemeSetting = (key: keyof typeof themeSettings) => {
    setThemeSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] }

      // Simulando salvamento das configurações
      setTimeout(() => {
        toast({
          title: "Tema atualizado",
          description: `Modo ${newSettings.darkMode ? "escuro" : "claro"} ativado.`,
          variant: "success",
        })
      }, 500)

      // Aqui você implementaria a lógica para mudar o tema

      return newSettings
    })
  }

  // Função para alterar senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPasswordDialogOpen(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Configurações</h1>
      </div>

      <div className="space-y-6">
        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" /> Notificações
            </CardTitle>
            <CardDescription>Gerencie como e quando você recebe notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="font-medium">
                  Notificações push
                </Label>
                <p className="text-sm text-muted-foreground">Receba notificações no seu dispositivo</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notificationSettings.pushEnabled}
                onCheckedChange={() => updateNotificationSetting("pushEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Notificações por e-mail
                </Label>
                <p className="text-sm text-muted-foreground">Receba atualizações por e-mail</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notificationSettings.emailEnabled}
                onCheckedChange={() => updateNotificationSetting("emailEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promo-notifications" className="font-medium">
                  Promoções e novidades
                </Label>
                <p className="text-sm text-muted-foreground">Fique por dentro de ofertas especiais</p>
              </div>
              <Switch
                id="promo-notifications"
                checked={notificationSettings.promotionsEnabled}
                onCheckedChange={() => updateNotificationSetting("promotionsEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reservation-notifications" className="font-medium">
                  Reservas
                </Label>
                <p className="text-sm text-muted-foreground">Lembretes e confirmações de reservas</p>
              </div>
              <Switch
                id="reservation-notifications"
                checked={notificationSettings.reservationsEnabled}
                onCheckedChange={() => updateNotificationSetting("reservationsEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="challenge-notifications" className="font-medium">
                  Desafios
                </Label>
                <p className="text-sm text-muted-foreground">Atualizações sobre seus desafios</p>
              </div>
              <Switch
                id="challenge-notifications"
                checked={notificationSettings.challengesEnabled}
                onCheckedChange={() => updateNotificationSetting("challengesEnabled")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Privacidade
            </CardTitle>
            <CardDescription>Controle suas configurações de privacidade e dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-activity" className="font-medium">
                  Compartilhar atividade
                </Label>
                <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam suas conquistas</p>
              </div>
              <Switch
                id="share-activity"
                checked={privacySettings.shareActivity}
                onCheckedChange={() => updatePrivacySetting("shareActivity")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection" className="font-medium">
                  Coleta de dados
                </Label>
                <p className="text-sm text-muted-foreground">Permitir coleta de dados para melhorar a experiência</p>
              </div>
              <Switch
                id="data-collection"
                checked={privacySettings.allowDataCollection}
                onCheckedChange={() => updatePrivacySetting("allowDataCollection")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" /> Segurança
            </CardTitle>
            <CardDescription>Gerencie suas configurações de segurança.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Alterar senha
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar senha</DialogTitle>
                  <DialogDescription>Crie uma nova senha para sua conta.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha atual</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Alterando..." : "Alterar senha"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Configurações de Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {themeSettings.darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
              Aparência
            </CardTitle>
            <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">
                  Modo escuro
                </Label>
                <p className="text-sm text-muted-foreground">Ativar tema escuro para o aplicativo</p>
              </div>
              <Switch
                id="dark-mode"
                checked={themeSettings.darkMode}
                onCheckedChange={() => updateThemeSetting("darkMode")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sobre o Aplicativo */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre o aplicativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Club OX</span> - Versão 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">© 2023 OX Steakhouse. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-2">
              <Button variant="link" className="h-auto p-0 text-primary" onClick={() => router.push("/termos")}>
                Termos de uso
              </Button>
              <Button variant="link" className="h-auto p-0 text-primary" onClick={() => router.push("/privacidade")}>
                Política de privacidade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
