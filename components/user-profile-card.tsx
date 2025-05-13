"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ProgressRing } from "@/components/ui/progress-ring"
import type { User, LoyaltyLevel } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ArrowUp } from "lucide-react"

interface UserProfileCardProps {
  user: User | null
  isLoading: boolean
}

export function UserProfileCard({ user, isLoading }: UserProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden card-shadow">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-[100px] w-[100px] rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user || !user.loyalty_level) {
    return (
      <Card className="overflow-hidden card-shadow">
        <CardContent className="p-0">
          <div className="p-4 text-center">
            <p>Erro ao carregar dados do usuário.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular o próximo nível
  const currentLevel = user.loyalty_level
  const nextLevel: LoyaltyLevel | null = null // Aqui você buscaria o próximo nível do banco de dados

  // Calcular o progresso para o próximo nível
  let progress = 0
  let pointsNeeded = 0

  if (nextLevel) {
    pointsNeeded = nextLevel.min_points_required - currentLevel.min_points_required
    const pointsEarned = user.points_balance - currentLevel.min_points_required
    progress = Math.min(100, Math.round((pointsEarned / pointsNeeded) * 100))
  }

  return (
    <Card className="overflow-hidden card-shadow">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/30 via-primary/20 to-primary/5 dark:from-primary/20 dark:via-primary/10 dark:to-primary/5 p-5">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <ProgressRing progress={progress} size={110} strokeWidth={8} className="drop-shadow-sm">
                <div className="flex flex-col items-center justify-center bg-background rounded-full w-[94px] h-[94px]">
                  <span className="text-2xl font-bold">{user.points_balance}</span>
                  <span className="text-xs text-muted-foreground">pontos</span>
                </div>
              </ProgressRing>
              {nextLevel && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                  <ArrowUp className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium">Nível atual</h3>
                  <p className="text-lg font-bold">{currentLevel.name}</p>
                </div>
                {nextLevel && (
                  <div className="text-right">
                    <h3 className="text-sm font-medium">Próximo nível</h3>
                    <p className="text-lg font-bold">{nextLevel.name}</p>
                  </div>
                )}
              </div>

              {nextLevel ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{user.points_balance} pts</span>
                      <span>{nextLevel.min_points_required} pts</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Faltam {pointsNeeded - (user.points_balance - currentLevel.min_points_required)} pontos para o
                      próximo nível
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">Nível máximo alcançado!</p>
                  <p className="text-xs text-muted-foreground mt-1">Aproveite todos os benefícios exclusivos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
