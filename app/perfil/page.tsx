"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LevelBadge } from "@/components/ui/level-badge"
import { BadgeIcon } from "@/components/ui/badge-icon"
import { Award, ChevronRight, CreditCard, Gift, History, LogOut, Settings, User, Utensils, Wine } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/lib/services/user-service"
import type { UserBadge, PointsTransaction, LoyaltyLevel } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PerfilPage() {
  const { user, isLoading: isAuthLoading, signOut } = useAuth()
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [nextLevel, setNextLevel] = useState<LoyaltyLevel | null>(null)
  const [isLoading, setIsLoading] = useState({
    badges: true,
    transactions: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Carregar badges do usuário
          setIsLoading((prev) => ({ ...prev, badges: true }))
          const badges = await userService.getUserBadges(user.id)
          setUserBadges(badges)
          setIsLoading((prev) => ({ ...prev, badges: false }))

          // Carregar transações de pontos
          setIsLoading((prev) => ({ ...prev, transactions: true }))
          const pointsTransactions = await userService.getUserPointsTransactions(user.id)
          setTransactions(pointsTransactions)
          setIsLoading((prev) => ({ ...prev, transactions: false }))

          // Aqui você buscaria o próximo nível de fidelidade
          // setNextLevel(nextLevelData)
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          setIsLoading({
            badges: false,
            transactions: false,
          })
        }
      }
    }

    fetchData()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Filtrar transações por tipo
  const visits = transactions.filter((t) => t.transaction_type === "VISIT_CONSUMPTION_EARNED")
  const redemptions = transactions.filter((t) => t.transaction_type === "REWARD_REDEMPTION_SPENT")

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Perfil do Usuário */}
        <section>
          {isAuthLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center mt-2">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="ml-2 h-8 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                    <h2 className="text-xl font-bold">{user?.name || "Usuário"}</h2>
                    <p className="text-sm text-muted-foreground">
                      Membro desde{" "}
                      {user?.created_at ? format(new Date(user.created_at), "MMM yyyy", { locale: ptBR }) : ""}
                    </p>

                    <div className="flex items-center mt-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user?.points_balance || 0} pontos</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: nextLevel
                                ? `${Math.min(100, ((user?.points_balance || 0) / nextLevel.min_points_required) * 100)}%`
                                : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2">
                        <Gift className="h-4 w-4 mr-1" />
                        Resgatar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Abas de Conteúdo */}
        <Tabs defaultValue="conquistas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          </TabsList>

          <TabsContent value="conquistas" className="space-y-4 mt-4">
            {isLoading.badges ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : userBadges.length > 0 ? (
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
                  <BadgeIcon
                    key={`locked-${i}`}
                    icon={<Award className="h-6 w-6" />}
                    label="Bloqueado"
                    unlocked={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground">Você ainda não conquistou nenhum badge.</p>
                  <p className="text-sm">Complete desafios para ganhar badges!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="historico" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Histórico de Visitas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading.transactions ? (
                  <div className="divide-y divide-border">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
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
                {isLoading.transactions ? (
                  <div className="divide-y divide-border">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="p-4 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex justify-end">
                          <Skeleton className="h-4 w-20" />
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
          </TabsContent>

          <TabsContent value="beneficios" className="space-y-4 mt-4">
            {user?.loyalty_level ? (
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
                          <p className="font-medium">
                            {nextLevel.discount_percentage || 15}% de desconto em todos os pratos
                          </p>
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
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground">Informações de benefícios não disponíveis.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Menu de Opções */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Opções</h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <Link href="/dados-pessoais" className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Dados Pessoais</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/metodos-pagamento" className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Métodos de Pagamento</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/configuracoes" className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Configurações</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/ajuda" className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Ajuda e Suporte</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <button className="flex items-center justify-between p-4 w-full text-left" onClick={handleSignOut}>
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3 text-destructive" />
                    <span className="text-destructive">Sair</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
