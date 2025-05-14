"use client"

import { useState, useMemo } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LevelBadge } from "@/components/ui/level-badge"
import { BadgeIcon } from "@/components/ui/badge-icon"
import {
  Award,
  ChevronRight,
  CreditCard,
  Gift,
  History,
  LogOut,
  Settings,
  User,
  Utensils,
  Wine,
  HelpCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { UserBadge, PointsTransaction, LoyaltyLevel } from "@/lib/types"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { OfflineBanner } from "@/components/offline-banner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useUserData } from "@/hooks/use-user-data"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

// User Profile Header Component
function ProfileHeader({ user, isLoading }: { user: any; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <LoadingSkeleton type="card" className="w-20 h-20 rounded-full" />
              <LoadingSkeleton
                type="card"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-16 rounded-full"
              />
            </div>
            <div className="flex-1 space-y-2">
              <LoadingSkeleton type="card" className="h-6 w-40" />
              <LoadingSkeleton type="card" className="h-4 w-32" />
              <div className="flex items-center mt-2">
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton type="card" className="h-4 w-24" />
                  <LoadingSkeleton type="card" className="h-2 w-full" />
                </div>
                <LoadingSkeleton type="card" className="ml-2 h-8 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-muted overflow-hidden">
              <Image
                src="/diverse-profile-avatars.png"
                alt="Foto de perfil"
                width={80}
                height={80}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            {user?.loyalty_level && (
              <LevelBadge
                level={user.loyalty_level.name}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name || "Usuário"}</h2>
            <p className="text-sm text-muted-foreground">
              Membro desde {user?.created_at ? format(new Date(user.created_at), "MMM yyyy", { locale: ptBR }) : ""}
            </p>

            <div className="flex items-center mt-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.points_balance || 0} pontos</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: user?.nextLevel
                        ? `${Math.min(100, ((user?.points_balance || 0) / user.nextLevel.min_points_required) * 100)}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-2" asChild>
                <Link href="/recompensas">
                  <Gift className="h-4 w-4 mr-1" />
                  Resgatar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Achievements Tab Content
function AchievementsTab({
  userBadges,
  isLoading,
  error,
  onRetry,
}: {
  userBadges: UserBadge[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}) {
  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar conquistas"
        message="Não foi possível carregar suas conquistas. Tente novamente mais tarde."
        onRetry={onRetry}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <LoadingSkeleton type="card" className="h-16 w-16 rounded-full" />
            <LoadingSkeleton type="card" className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (userBadges.length > 0) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {userBadges.map((userBadge) => {
          // Ícone baseado no nome do badge (simplificado)
          let Icon = Award
          if (userBadge.badge?.name.toLowerCase().includes("gourmet")) Icon = Utensils
          if (userBadge.badge?.name.toLowerCase().includes("sommelier")) Icon = Wine
          if (userBadge.badge?.name.toLowerCase().includes("vip")) Icon = User
          if (userBadge.badge?.name.toLowerCase().includes("gasto")) Icon = CreditCard
          if (userBadge.badge?.name.toLowerCase().includes("fiel")) Icon = History
          if (userBadge.badge?.name.toLowerCase().includes("presenteador")) Icon = Gift

          return (
            <BadgeIcon
              key={userBadge.id}
              icon={<Icon className="h-6 w-6" />}
              label={userBadge.badge?.name || ""}
              unlocked={true}
            />
          )
        })}

        {/* Adicionar badges bloqueados para completar a grade */}
        {[...Array(Math.max(0, 8 - userBadges.length))].map((_, i) => (
          <BadgeIcon key={`locked-${i}`} icon={<Award className="h-6 w-6" />} label="Bloqueado" unlocked={false} />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-muted-foreground">Você ainda não conquistou nenhum badge.</p>
        <p className="text-sm">Complete desafios para ganhar badges!</p>
      </CardContent>
    </Card>
  )
}

// History Tab Content
function HistoryTab({
  transactions,
  isLoading,
  error,
  onRetry,
}: {
  transactions: PointsTransaction[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}) {
  // Filter transactions by type
  const visits = useMemo(
    () => transactions.filter((t) => t.transaction_type === "VISIT_CONSUMPTION_EARNED"),
    [transactions],
  )

  const redemptions = useMemo(
    () => transactions.filter((t) => t.transaction_type === "REWARD_REDEMPTION_SPENT"),
    [transactions],
  )

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar histórico"
        message="Não foi possível carregar seu histórico de transações. Tente novamente mais tarde."
        onRetry={onRetry}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Histórico de Visitas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <LoadingSkeleton type="card" className="h-5 w-32" />
                  <LoadingSkeleton type="card" className="h-4 w-24" />
                  <div className="flex justify-between">
                    <LoadingSkeleton type="card" className="h-4 w-16" />
                    <LoadingSkeleton type="card" className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : visits.length > 0 ? (
            <div className="divide-y divide-border">
              {visits.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{transaction.description || "Visita"}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.transaction_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">+{transaction.points_change} pontos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Nenhuma visita registrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Histórico de Resgates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <LoadingSkeleton type="card" className="h-5 w-32" />
                  <LoadingSkeleton type="card" className="h-4 w-24" />
                  <div className="flex justify-end">
                    <LoadingSkeleton type="card" className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : redemptions.length > 0 ? (
            <div className="divide-y divide-border">
              {redemptions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{transaction.description || "Resgate"}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.transaction_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-destructive">{transaction.points_change} pontos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Nenhum resgate registrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

// Benefits Tab Content
function BenefitsTab({
  user,
  nextLevel,
}: {
  user: any
  nextLevel: LoyaltyLevel | null
}) {
  if (!user?.loyalty_level) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">Informações de benefícios não disponíveis.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Benefícios do Nível {user.loyalty_level.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <div className="p-4">
              <p className="font-medium">
                {user.loyalty_level.discount_percentage || 10}% de desconto em todos os pratos
              </p>
              <p className="text-sm text-muted-foreground">Válido para almoço e jantar</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Reserva prioritária</p>
              <p className="text-sm text-muted-foreground">Garantia de mesa com 2h de antecedência</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Sobremesa de cortesia</p>
              <p className="text-sm text-muted-foreground">No mês do seu aniversário</p>
            </div>
            <div className="p-4">
              <p className="font-medium">Acesso a eventos exclusivos</p>
              <p className="text-sm text-muted-foreground">Degustações e workshops</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextLevel && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">Próximo Nível: {nextLevel.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <div className="p-4">
                <p className="font-medium">{nextLevel.discount_percentage || 15}% de desconto em todos os pratos</p>
                <p className="text-sm text-muted-foreground">Válido para almoço e jantar</p>
              </div>
              <div className="p-4">
                <p className="font-medium">Reserva VIP garantida</p>
                <p className="text-sm text-muted-foreground">Mesmo em dias de alta demanda</p>
              </div>
              <div className="p-4">
                <p className="font-medium">Welcome drink exclusivo</p>
                <p className="text-sm text-muted-foreground">Em todas as visitas</p>
              </div>
              <div className="p-4">
                <p className="font-medium">Acesso ao menu secreto</p>
                <p className="text-sm text-muted-foreground">Cortes e pratos exclusivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// Options Menu Component
function OptionsMenu({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          <Link href="/perfil/dados-pessoais" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Dados Pessoais</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/perfil/metodos-pagamento" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Métodos de Pagamento</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/perfil/historico" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <History className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Histórico de Atividades</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/perfil/configuracoes" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Configurações</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/perfil/ajuda" className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Ajuda e Suporte</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <button className="flex items-center justify-between p-4 w-full text-left" onClick={onSignOut}>
            <div className="flex items-center">
              <LogOut className="h-5 w-5 mr-3 text-destructive" />
              <span className="text-destructive">Sair</span>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PerfilPage() {
  const { user, isLoading: isAuthLoading, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get active tab from URL or default to "conquistas"
  const defaultTab = searchParams.get("tab") || "conquistas"
  const [activeTab, setActiveTab] = useState(defaultTab)

  const { userBadges, transactions, nextLevel, isLoading, errors, mutate } = useUserData()

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/perfil?tab=${value}`, { scroll: false })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível desconectar da sua conta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Link href="/perfil/configuracoes">
            <Button variant="ghost" size="icon" aria-label="Configurações">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Offline banner */}
      <OfflineBanner />

      <main className="container px-4 py-6 space-y-6">
        {/* Perfil do Usuário */}
        <section>
          <ProfileHeader user={user} isLoading={isAuthLoading} />
        </section>

        {/* Abas de Conteúdo */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          </TabsList>

          <TabsContent value="conquistas" className="space-y-4 mt-4">
            <AchievementsTab
              userBadges={userBadges}
              isLoading={isLoading.badges}
              error={errors.badges}
              onRetry={() => mutate.badges()}
            />
          </TabsContent>

          <TabsContent value="historico" className="space-y-4 mt-4">
            <HistoryTab
              transactions={transactions}
              isLoading={isLoading.transactions}
              error={errors.transactions}
              onRetry={() => mutate.transactions()}
            />
          </TabsContent>

          <TabsContent value="beneficios" className="space-y-4 mt-4">
            <BenefitsTab user={user} nextLevel={nextLevel} />
          </TabsContent>
        </Tabs>

        {/* Menu de Opções */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Opções</h2>
          <OptionsMenu onSignOut={handleSignOut} />
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
