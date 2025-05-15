"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Award, ChevronRight, TrendingUp, Gift, Calendar, Info } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/types"
import { useState, useEffect } from "react"
import { userService } from "@/lib/services/user-service"
import { reservationService } from "@/lib/services/reservation-service"
import { orderService } from "@/lib/services/order-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UserProfileCardProps {
  user: User | null
  isLoading: boolean
}

interface ActivityStats {
  completedChallenges: number
  rewardRedemptions: number
  reservations: number
  isLoading: boolean
}

export function UserProfileCard({ user, isLoading }: UserProfileCardProps) {
  const [mounted, setMounted] = useState(false)
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    completedChallenges: 0,
    rewardRedemptions: 0,
    reservations: 0,
    isLoading: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch activity data for the last 90 days
  useEffect(() => {
    async function fetchActivityData() {
      if (!user) return

      try {
        // Get date from 90 days ago
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        const ninetyDaysAgoStr = ninetyDaysAgo.toISOString()

        // Fetch completed challenges in last 90 days
        const challenges = await userService.getUserChallenges(user.id)
        const completedChallenges = challenges.filter(
          (challenge) => challenge.completed_at && new Date(challenge.completed_at) >= ninetyDaysAgo,
        ).length

        // Fetch reward redemptions in last 90 days
        const orders = await orderService.getUserOrders(user.id)
        const rewardRedemptions = orders.filter(
          (order) => order.order_type === "reward_redemption" && new Date(order.order_date) >= ninetyDaysAgo,
        ).length

        // Fetch reservations in last 90 days
        const reservations = await reservationService.getUserReservations(user.id)
        const recentReservations = reservations.filter((res) => new Date(res.created_at) >= ninetyDaysAgo).length

        setActivityStats({
          completedChallenges,
          rewardRedemptions,
          reservations: recentReservations,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error fetching activity data:", error)
        setActivityStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    if (user) {
      fetchActivityData()
    }
  }, [user])

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/50">
        <CardContent className="p-0">
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 w-[60%]">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>
          <div className="bg-muted p-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="overflow-hidden border border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">Faça login para ver seu perfil</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate progress percentage to next level
  const currentPoints = user.points_balance || 0
  const pointsToNextLevel = user.loyalty_level?.points_to_next_level || 100
  const pointsFromPreviousLevel = user.loyalty_level?.points_from_previous_level || 0

  // Garantir que não haja divisão por zero
  let progressPercentage = 0
  if (pointsToNextLevel > 0) {
    progressPercentage = Math.min(
      Math.round(((currentPoints - pointsFromPreviousLevel) / pointsToNextLevel) * 100),
      100,
    )
  } else if (currentPoints >= pointsFromPreviousLevel) {
    // Se não há próximo nível, mas o usuário tem pontos suficientes, mostrar 100%
    progressPercentage = 100
  }

  // Garantir que progressPercentage seja um número válido
  if (isNaN(progressPercentage)) {
    progressPercentage = 0
  }

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm">
      {/* Main content area */}
      <CardContent className="p-0">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

          <div className="relative p-5 z-10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  {user.loyalty_level?.name || "Membro"}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pointsToNextLevel > 0
                    ? `${pointsToNextLevel - (currentPoints - pointsFromPreviousLevel)} pontos para o próximo nível`
                    : "Nível máximo alcançado"}
                </p>
              </div>
              <Link href="/perfil" className="text-xs text-primary flex items-center hover:underline">
                Ver perfil
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              {/* Points display with ring */}
              <div className="flex-shrink-0 w-auto">
                {mounted && (
                  <ProgressRing
                    value={progressPercentage}
                    size={80}
                    strokeWidth={6}
                    className="drop-shadow-sm"
                    responsive={true}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xl font-bold">{currentPoints}</span>
                      <span className="text-xs text-muted-foreground">pontos</span>
                    </div>
                  </ProgressRing>
                )}
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">+{user.points_earned_this_month || 0} este mês</span>
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>{user.loyalty_level?.name}</span>
                    <span>{user.loyalty_level?.next_level_name || "Máximo"}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats footer */}
        <div className="grid grid-cols-3 divide-x divide-border/50 border-t border-border/50 bg-muted/50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/recompensas"
                  className="flex flex-col items-center py-3.5 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Gift className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Recompensas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold">
                      {activityStats.isLoading ? "..." : activityStats.rewardRedemptions}
                    </span>
                    <Info className="h-3 w-3 text-muted-foreground ml-1" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Resgates nos últimos 90 dias</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/desafios"
                  className="flex flex-col items-center py-3.5 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Award className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Desafios</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold">
                      {activityStats.isLoading ? "..." : activityStats.completedChallenges}
                    </span>
                    <Info className="h-3 w-3 text-muted-foreground ml-1" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Desafios concluídos nos últimos 90 dias</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/reservas"
                  className="flex flex-col items-center py-3.5 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Reservas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold">
                      {activityStats.isLoading ? "..." : activityStats.reservations}
                    </span>
                    <Info className="h-3 w-3 text-muted-foreground ml-1" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Reservas feitas nos últimos 90 dias</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
