"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Button } from "@/components/ui/button"
import { Gift, Utensils } from "lucide-react"
import type { User, LoyaltyLevel } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfileCardProps {
  user: User | null
  isLoading: boolean
}

export function UserProfileCard({ user, isLoading }: UserProfileCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-[100px] w-[100px] rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between mt-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user || !user.loyalty_level) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-4">
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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <ProgressRing progress={progress} size={100} strokeWidth={8} className="shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{user.points_balance}</span>
              <span className="text-xs text-muted-foreground">pontos</span>
            </div>
          </ProgressRing>

          <div className="flex-1">
            {nextLevel ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">Próximo nível: {nextLevel.name}</p>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Faltam {pointsNeeded - (user.points_balance - currentLevel.min_points_required)} pontos
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mb-1">Nível máximo alcançado!</p>
            )}

            <div className="flex justify-between mt-3">
              <Button size="sm" variant="outline">
                <Gift className="h-4 w-4 mr-1" />
                Resgatar
              </Button>
              <Button size="sm" variant="outline">
                <Utensils className="h-4 w-4 mr-1" />
                Escanear QR
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
