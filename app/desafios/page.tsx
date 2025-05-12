"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Bell, Calendar, Clock, Flame, Utensils, Users, Wine } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { challengeService } from "@/lib/services/challenge-service"
import type { Challenge } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function DesafiosPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Buscar desafios ativos
        const active = await challengeService.getActiveChallenges(user.id)
        setActiveChallenges(active)

        // Buscar desafios disponíveis
        const available = await challengeService.getAvailableChallenges(user.id)
        setAvailableChallenges(available)

        // Buscar desafios concluídos
        const completed = await challengeService.getCompletedChallenges(user.id)
        setCompletedChallenges(completed)
      } catch (error) {
        console.error("Erro ao carregar desafios:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleStartChallenge = async (challengeId: string) => {
    if (!user) return

    try {
      await challengeService.startChallenge(user.id, challengeId)

      // Atualizar listas de desafios
      const active = await challengeService.getActiveChallenges(user.id)
      setActiveChallenges(active)

      const available = await challengeService.getAvailableChallenges(user.id)
      setAvailableChallenges(available)

      toast({
        title: "Desafio iniciado!",
        description: "Boa sorte na sua jornada.",
      })
    } catch (error) {
      console.error("Erro ao iniciar desafio:", error)
      toast({
        title: "Erro ao iniciar desafio",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const getChallengeIcon = (challenge: Challenge) => {
    if (challenge.name.includes("Sommelier")) return <Wine className="h-5 w-5 text-primary" />
    if (challenge.name.includes("Assíduo")) return <Calendar className="h-5 w-5 text-primary" />
    if (challenge.name.includes("Embaixador")) return <Users className="h-5 w-5 text-primary" />
    if (challenge.name.includes("Mestre")) return <Utensils className="h-5 w-5 text-primary" />
    if (challenge.name.includes("Dry Aged")) return <Flame className="h-5 w-5 text-primary" />
    return <Award className="h-5 w-5 text-primary" />
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Desafios</h1>

        <Tabs defaultValue="ativos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ativos">Ativos</TabsTrigger>
            <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          </TabsList>

          <TabsContent value="ativos" className="space-y-4 mt-4">
            {isLoading ? (
              Array(2)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)
            ) : activeChallenges.length > 0 ? (
              activeChallenges.map((challenge) => {
                const progress = challenge.user_challenge?.progress_details?.progress || 0
                const total = challenge.user_challenge?.progress_details?.total || 1
                const percentage = (progress / total) * 100

                return (
                  <Card key={challenge.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {getChallengeIcon(challenge)}
                          </div>
                          <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {challenge.end_date
                              ? `Termina em ${new Date(challenge.end_date).toLocaleDateString("pt-BR")}`
                              : "Sem prazo definido"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{challenge.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Progresso: {progress}/{total}
                          </span>
                          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-sm font-medium">Recompensa:</span>
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="h-4 w-4 text-primary" />
                            <span>{challenge.points_reward} pontos</span>
                          </div>
                        </div>
                        <Button>Ver Detalhes</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum desafio ativo</h3>
                <p className="text-muted-foreground mb-4">
                  Você não tem desafios em andamento. Inicie um novo desafio na aba "Disponíveis".
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="disponiveis" className="space-y-4 mt-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)
            ) : availableChallenges.length > 0 ? (
              availableChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getChallengeIcon(challenge)}
                        </div>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{challenge.description}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-sm font-medium">Recompensa:</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{challenge.points_reward} pontos</span>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleStartChallenge(challenge.id)}>
                        Iniciar Desafio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum desafio disponível</h3>
                <p className="text-muted-foreground">No momento não há novos desafios disponíveis. Volte em breve!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-4 mt-4">
            {isLoading ? (
              Array(2)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)
            ) : completedChallenges.length > 0 ? (
              completedChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {getChallengeIcon(challenge)}
                        </div>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Concluído
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{challenge.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progresso: 100%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-sm font-medium">Recompensa recebida:</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{challenge.points_reward} pontos</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum desafio concluído</h3>
                <p className="text-muted-foreground">
                  Você ainda não concluiu nenhum desafio. Complete desafios para ganhar pontos e recompensas!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
