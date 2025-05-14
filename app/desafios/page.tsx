"use client"

import { useState, useEffect, useCallback } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Award, Clock, Trophy, Target, CheckCircle, XCircle, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { challengeService } from "@/lib/services/challenge-service"
import type { Challenge } from "@/lib/types"

export default function DesafiosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState({
    available: true,
    inProgress: true,
    completed: true,
  })
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [inProgressChallenges, setInProgressChallenges] = useState<Challenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([])
  const [activeTab, setActiveTab] = useState<"available" | "in_progress" | "completed">("available")
  const [startingChallenge, setStartingChallenge] = useState<string | null>(null)
  const [badgeDetails, setBadgeDetails] = useState<Record<string, any>>({})

  // Function to load available challenges
  const loadAvailableChallenges = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading((prev) => ({ ...prev, available: true }))
      const challenges = await challengeService.getAvailableChallenges(user.id)
      setAvailableChallenges(challenges)
    } catch (error) {
      console.error("Error loading available challenges:", error)
      toast({
        title: "Erro ao carregar desafios",
        description: "Não foi possível carregar os desafios disponíveis. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, available: false }))
    }
  }, [user, toast])

  // Function to load in-progress challenges
  const loadInProgressChallenges = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading((prev) => ({ ...prev, inProgress: true }))
      const challenges = await challengeService.getActiveChallenges(user.id)
      setInProgressChallenges(challenges)
    } catch (error) {
      console.error("Error loading in-progress challenges:", error)
      toast({
        title: "Erro ao carregar desafios",
        description: "Não foi possível carregar seus desafios em andamento. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, inProgress: false }))
    }
  }, [user, toast])

  // Function to load completed challenges
  const loadCompletedChallenges = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading((prev) => ({ ...prev, completed: true }))
      const challenges = await challengeService.getCompletedChallenges(user.id)
      setCompletedChallenges(challenges)
    } catch (error) {
      console.error("Error loading completed challenges:", error)
      toast({
        title: "Erro ao carregar desafios",
        description: "Não foi possível carregar seus desafios completados. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, completed: false }))
    }
  }, [user, toast])

  // Function to load badge details for challenges
  const loadBadgeDetails = useCallback(
    async (challenges: Challenge[]) => {
      const newBadgeDetails: Record<string, any> = { ...badgeDetails }

      for (const challenge of challenges) {
        if (challenge.badge_id && !newBadgeDetails[challenge.badge_id]) {
          try {
            const badge = await challengeService.getBadgeForChallenge(challenge.id)
            if (badge) {
              newBadgeDetails[challenge.badge_id] = badge
            }
          } catch (error) {
            console.error(`Error loading badge for challenge ${challenge.id}:`, error)
          }
        }
      }

      setBadgeDetails(newBadgeDetails)
    },
    [badgeDetails],
  )

  // Check and update challenge progress
  const checkChallengesProgress = useCallback(async () => {
    if (!user) return

    try {
      await challengeService.checkAndUpdateChallenges(user.id)
      // Reload challenges after checking progress
      await loadInProgressChallenges()
      await loadCompletedChallenges()
    } catch (error) {
      console.error("Error checking challenge progress:", error)
    }
  }, [user, loadInProgressChallenges, loadCompletedChallenges])

  useEffect(() => {
    if (user) {
      // Load challenges based on active tab
      if (activeTab === "available") {
        loadAvailableChallenges().then((challenges) => {
          if (challenges) loadBadgeDetails(challenges as Challenge[])
        })
      } else if (activeTab === "in_progress") {
        loadInProgressChallenges().then((challenges) => {
          if (challenges) loadBadgeDetails(challenges as Challenge[])
        })
      } else if (activeTab === "completed") {
        loadCompletedChallenges().then((challenges) => {
          if (challenges) loadBadgeDetails(challenges as Challenge[])
        })
      }

      // Check and update challenge progress
      checkChallengesProgress()

      // Set up subscription for real-time updates to challenges
      const unsubscribe = challengeService.subscribeToUserChallenges(user.id, (payload) => {
        console.log("Challenge change detected:", payload)
        // Reload challenges when there are changes
        loadInProgressChallenges()
        loadCompletedChallenges()
        loadAvailableChallenges()
      })

      // Clean up subscription when component unmounts
      return () => {
        unsubscribe()
      }
    }
  }, [
    user,
    activeTab,
    loadAvailableChallenges,
    loadInProgressChallenges,
    loadCompletedChallenges,
    loadBadgeDetails,
    checkChallengesProgress,
  ])

  const handleStartChallenge = async (challengeId: string) => {
    if (!user) return

    setStartingChallenge(challengeId)
    try {
      await challengeService.startChallenge(user.id, challengeId)

      toast({
        title: "Desafio iniciado!",
        description: "Boa sorte! Acompanhe seu progresso nesta página.",
        variant: "success",
      })

      // Reload challenges after starting a new one
      await loadAvailableChallenges()
      await loadInProgressChallenges()
    } catch (error) {
      console.error("Error starting challenge:", error)
      toast({
        title: "Erro ao iniciar desafio",
        description: "Não foi possível iniciar o desafio. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setStartingChallenge(null)
    }
  }

  // Get challenges to display based on active tab
  const getDisplayedChallenges = () => {
    if (activeTab === "available") return availableChallenges
    if (activeTab === "in_progress") return inProgressChallenges
    return completedChallenges
  }

  // Check if loading based on active tab
  const isTabLoading = () => {
    if (activeTab === "available") return isLoading.available
    if (activeTab === "in_progress") return isLoading.inProgress
    return isLoading.completed
  }

  const getChallengeIcon = (type = "special") => {
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

  // Format expiry date
  const formatExpiryDate = (challenge: Challenge) => {
    if (!challenge.end_date) return null

    try {
      const date = parseISO(challenge.end_date)
      if (!isValid(date)) return null
      return format(date, "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      console.error("Error formatting date:", error)
      return null
    }
  }

  // Get badge name for a challenge
  const getBadgeName = (challenge: Challenge) => {
    if (!challenge.badge_id) return null

    const badge = badgeDetails[challenge.badge_id]
    return badge ? badge.name : "Badge Exclusivo"
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="text-lg font-semibold">Club OX Premium</div>
          <Logo className="absolute left-1/2 transform -translate-x-1/2" />
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

        {/* Navigation tabs */}
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

        {/* Challenge list */}
        <div className="space-y-4">
          {isTabLoading() ? (
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
          ) : getDisplayedChallenges().length > 0 ? (
            getDisplayedChallenges().map((challenge) => {
              // Extract progress details for in-progress challenges
              const progress =
                activeTab === "in_progress" && challenge.user_challenge
                  ? challenge.user_challenge.progress_details?.progress || 0
                  : 0
              const total =
                activeTab === "in_progress" && challenge.user_challenge
                  ? challenge.user_challenge.progress_details?.total || 1
                  : 1
              const progressPercent = Math.round((progress / total) * 100)

              // Format expiry date
              const expiryDate = formatExpiryDate(challenge)

              // Get badge name
              const badgeName = getBadgeName(challenge)

              return (
                <Card key={challenge.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 p-2 rounded-full ${
                            activeTab === "completed"
                              ? "bg-green-100 text-green-600"
                              : activeTab === "in_progress"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {getChallengeIcon(challenge.type)}
                        </div>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                      </div>
                      <Badge
                        variant={
                          activeTab === "completed" ? "success" : activeTab === "in_progress" ? "warning" : "default"
                        }
                      >
                        {activeTab === "completed"
                          ? "Completado"
                          : activeTab === "in_progress"
                            ? "Em Progresso"
                            : "Disponível"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="mb-4">{challenge.description}</CardDescription>

                    {activeTab === "in_progress" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>
                            {progress}/{total}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {badgeName && (
                        <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          Badge: {badgeName}
                        </div>
                      )}
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        {challenge.points_reward} pontos
                      </div>
                      {expiryDate && (
                        <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Expira em: {expiryDate}
                        </div>
                      )}
                    </div>

                    {activeTab === "available" && (
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleStartChallenge(challenge.id)}
                        disabled={!!startingChallenge}
                      >
                        {startingChallenge === challenge.id ? "Iniciando..." : "Iniciar Desafio"}
                      </Button>
                    )}

                    {activeTab === "completed" && challenge.user_challenge?.completed_at && (
                      <div className="flex items-center justify-center mt-4 text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">
                          Desafio completado em{" "}
                          {format(parseISO(challenge.user_challenge.completed_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    )}

                    {challenge.end_date && new Date(challenge.end_date) < new Date() && (
                      <div className="flex items-center justify-center mt-4 text-destructive">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Desafio expirado</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
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
