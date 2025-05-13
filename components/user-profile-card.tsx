"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { User, LoyaltyLevel } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, ChevronRight } from "lucide-react"
import Link from "next/link"

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
                <div className="flex justify-between mt-3">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
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
  let pointsEarned = 0

  if (nextLevel) {
    pointsNeeded = nextLevel.min_points_required - currentLevel.min_points_required
    pointsEarned = user.points_balance - currentLevel.min_points_required
    progress = Math.min(100, Math.round((pointsEarned / pointsNeeded) * 100))
  }

  return (
    <Card className="overflow-hidden card-shadow">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold">{user.points_balance}</span>
                    <span className="text-sm text-muted-foreground">pontos</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Nível atual: {currentLevel.name}</p>
                </div>
              </div>

              <Link href="/perfil" className="text-sm text-primary flex items-center">
                Ver perfil
                <ChevronRight className="ml-0.5 h-4 w-4" />
              </Link>
            </div>

            {nextLevel ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium">
                    Próximo nível: <span className="font-bold">{nextLevel.name}</span>
                  </p>
                  <span className="text-xs font-medium">{progress}%</span>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold inline-block text-muted-foreground">
                      {currentLevel.min_points_required}
                    </div>
                    <div className="text-xs font-semibold inline-block text-muted-foreground">
                      {nextLevel.min_points_required}
                    </div>
                  </div>

                  <div className="relative h-2">
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm rounded-full shadow-inner"></div>
                    <div
                      className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 -top-1 w-4 h-4 bg-primary rounded-full shadow-md transform translate-x-1/2 border-2 border-background"></div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Faltam {pointsNeeded - pointsEarned} pontos para o próximo nível
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm font-medium">Nível máximo alcançado!</p>
                <p className="text-xs text-muted-foreground mt-1">Parabéns por sua fidelidade!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
