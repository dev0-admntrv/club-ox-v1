"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Award, Clock, Trophy, Target, CheckCircle, XCircle, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

// Tipos para os desafios
interface Challenge {
  id: string
  title: string
  description: string
  points_reward: number
  badge_reward?: string
  progress_current: number
  progress_total: number
  expires_at?: string
  status: "available" | "in_progress" | "completed" | "expired"
  type: "visit" | "consumption" | "referral" | "special"
}

export default function DesafiosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeTab, setActiveTab] = useState<"available" | "in_progress" | "completed">("available")
  const [startingChallenge, setStartingChallenge] = useState<string | null>(null)

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true)
      try {
        // Simulando carregamento de dados
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados de exemplo
        const mockChallenges: Challenge[] = [
          {
            id: "challenge_1",
            title: "Mestre da Carne",
            description: "Experimente 5 cortes diferentes do nosso cardápio",
            points_reward: 500,
            badge_reward: "Gourmet Explorer",
            progress_current: 2,
            progress_total: 5,
            expires_at: format(addDays(new Date(), 30), "yyyy-MM-dd"),
            status: "in_progress",
            type: "consumption",
          },
          {
            id: "challenge_2",
            title: "Cliente Fiel",
            description: "Visite o restaurante 3 vezes em um mês",
            points_reward: 300,
            progress_current: 1,
            progress_total: 3,
            expires_at: format(addDays(new Date(), 20), "yyyy-MM-dd"),
            status: "in_progress",
            type: "visit",
          },
          {
            id: "challenge_3",
            title: "Sommelier Aprendiz",
            description: "Experimente 4 vinhos diferentes da nossa carta",
            points_reward: 400,
            badge_reward: "Wine Enthusiast",
            progress_current: 0,
            progress_total: 4,
            expires_at: format(addDays(new Date(), 60), "yyyy-MM-dd"),
            status: "available",
            type: "consumption",
          },
          {
            id: "challenge_4",
            title: "Embaixador OX",
            description: "Convide 3 amigos para o Club OX",
            points_reward: 600,
            badge_reward: "Social Ambassador",
            progress_current: 0,
            progress_total: 3,
            status: "available",
            type: "referral",
          },
          {
            id: "challenge_5",
            title: "Aniversariante do Mês",
            description: "Visite-nos no mês do seu aniversário e ganhe uma sobremesa especial",
            points_reward: 200,
            progress_current: 1,
            progress_total: 1,
            status: "completed",
            type: "special",
          },
        ]

        setChallenges(mockChallenges)
      } catch (error) {
        console.error("Erro ao carregar desafios:", error)
        toast({
          title: "Erro ao carregar desafios",
          description: "Não foi possível carregar seus desafios. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [toast])

  const handleStartChallenge = async (challengeId: string) => {
    setStartingChallenge(challengeId)
    try {
      // Simulando chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Atualizar o estado local
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                status: "in_progress" as const,
              }
            : challenge,
        ),
      )

      toast({
        title: "Desafio iniciado!",
        description: "Boa sorte! Acompanhe seu progresso nesta página.",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao iniciar desafio:", error)
      toast({
        title: "Erro ao iniciar desafio",
        description: "Não foi possível iniciar o desafio. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setStartingChallenge(null)
    }
  }

  const filteredChallenges = challenges.filter((challenge) => {
    if (activeTab === "available") return challenge.status === "available"
    if (activeTab === "in_progress") return challenge.status === "in_progress"
    return challenge.status === "completed"
  })

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <Clock className="h-5 w-5" />
      case "consumption":
        return <Trophy className="h-5 w-5" />
      case "referral":
        return <Target className="h-5 w-5" />
      case "special":
        return <Award className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

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
        <div>
          <h1 className="text-2xl font-bold">Desafios</h1>
          <p className="text-muted-foreground">Complete desafios para ganhar pontos e badges exclusivos</p>
        </div>

        {/* Tabs de navegação */}
        <div className="flex border-b border-border">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "available" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Disponíveis
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "in_progress" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("in_progress")}
          >
            Em Progresso
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "completed" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completados
          </button>
        </div>

        {/* Lista de desafios */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton loading
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`mr-2 p-2 rounded-full ${
                          challenge.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : challenge.status === "in_progress"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {getChallengeIcon(challenge.type)}
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        challenge.status === "completed"
                          ? "success"
                          : challenge.status === "in_progress"
                            ? "warning"
                            : "default"
                      }
                    >
                      {challenge.status === "completed"
                        ? "Completado"
                        : challenge.status === "in_progress"
                          ? "Em Progresso"
                          : "Disponível"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="mb-4">{challenge.description}</CardDescription>

                  {challenge.status !== "available" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>
                          {challenge.progress_current}/{challenge.progress_total}
                        </span>
                      </div>
                      <Progress value={(challenge.progress_current / challenge.progress_total) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {challenge.badge_reward && (
                      <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        Badge: {challenge.badge_reward}
                      </div>
                    )}
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      {challenge.points_reward} pontos
                    </div>
                    {challenge.expires_at && (
                      <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Expira em:{" "}
                        {format(new Date(challenge.expires_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                    )}
                  </div>

                  {challenge.status === "available" && (
                    <Button
                      className="w-full mt-4"
                      onClick={() => handleStartChallenge(challenge.id)}
                      disabled={!!startingChallenge}
                    >
                      {startingChallenge === challenge.id ? "Iniciando..." : "Iniciar Desafio"}
                    </Button>
                  )}

                  {challenge.status === "completed" && (
                    <div className="flex items-center justify-center mt-4 text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Desafio completado!</span>
                    </div>
                  )}

                  {challenge.status === "expired" && (
                    <div className="flex items-center justify-center mt-4 text-destructive">
                      <XCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Desafio expirado</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center">
                  {activeTab === "available" ? (
                    <>
                      <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum desafio disponível</h3>
                      <p className="text-muted-foreground">
                        No momento não há novos desafios disponíveis. Volte em breve para conferir as novidades!
                      </p>
                    </>
                  ) : activeTab === "in_progress" ? (
                    <>
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum desafio em andamento</h3>
                      <p className="text-muted-foreground">
                        Você não tem desafios em andamento. Inicie um novo desafio na aba "Disponíveis".
                      </p>
                    </>
                  ) : (
                    <>
                      <Award className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum desafio completado</h3>
                      <p className="text-muted-foreground">
                        Você ainda não completou nenhum desafio. Complete desafios para ganhar pontos e badges
                        exclusivos!
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
