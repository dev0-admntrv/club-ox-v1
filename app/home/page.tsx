"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeIcon } from "@/components/ui/badge-icon"
import { Bell, Award, Calendar, Wine, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { UserProfileCard } from "@/components/user-profile-card"
import type { Challenge, UserBadge, Banner } from "@/lib/types"
import { challengeService } from "@/lib/services/challenge-service"
import { userService } from "@/lib/services/user-service"
import { bannerService } from "@/lib/services/banner-service"
import { Skeleton } from "@/components/ui/skeleton"
import { LevelBadge } from "@/components/ui/level-badge"

export default function HomePage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState({
    challenges: true,
    badges: true,
    banners: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Carregar desafios ativos
          setIsLoading((prev) => ({ ...prev, challenges: true }))
          const challenges = await challengeService.getActiveChallenges(user.id)
          setActiveChallenges(challenges)
          setIsLoading((prev) => ({ ...prev, challenges: false }))

          // Carregar badges do usuário
          setIsLoading((prev) => ({ ...prev, badges: true }))
          const badges = await userService.getUserBadges(user.id)
          setUserBadges(badges)
          setIsLoading((prev) => ({ ...prev, badges: false }))

          // Carregar banners promocionais
          setIsLoading((prev) => ({ ...prev, banners: true }))
          const bannerData = await bannerService.getActiveBanners(user.loyalty_level_id)
          setBanners(bannerData)
          setIsLoading((prev) => ({ ...prev, banners: false }))
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          setIsLoading({
            challenges: false,
            badges: false,
            banners: false,
          })
        }
      }
    }

    fetchData()
  }, [user])

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

      <main className="container px-4 py-6 space-y-8">
        {/* User Status */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            {isAuthLoading ? (
              <>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0] || "Usuário"}</h2>
                {user?.loyalty_level && <LevelBadge level={user.loyalty_level.name} />}
              </>
            )}
          </div>

          <UserProfileCard user={user} isLoading={isAuthLoading} />
        </section>

        {/* Desafios Ativos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Desafios Ativos</h2>
            <Link href="/desafios" className="text-sm text-primary">
              Ver todos
            </Link>
          </div>

          {isLoading.challenges ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="min-w-[280px] h-[150px] rounded-lg" />
                ))}
              </div>
            </div>
          ) : activeChallenges.length > 0 ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {activeChallenges.map((challenge) => {
                  // Aqui você precisaria extrair os detalhes do progresso do desafio
                  // Este é um exemplo simplificado
                  const progress = challenge.user_challenge?.progress_details?.progress || 0
                  const total = challenge.user_challenge?.progress_details?.total || 1
                  const progressPercent = Math.round((progress / total) * 100)

                  // Ícone baseado no nome do desafio (simplificado)
                  let Icon = Award
                  if (challenge.name.toLowerCase().includes("sommelier")) Icon = Wine
                  if (challenge.name.toLowerCase().includes("cliente")) Icon = Calendar
                  if (challenge.name.toLowerCase().includes("embaixador")) Icon = Users

                  return (
                    <Card key={challenge.id} className="min-w-[280px] max-w-[280px]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{challenge.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {progress}/{total} {challenge.description}
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Recompensa:</span>
                          <span className="text-sm font-medium">{challenge.points_reward} pontos</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">Você não tem desafios ativos no momento.</p>
                <Button asChild className="mt-2">
                  <Link href="/desafios">Iniciar um desafio</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Conquistas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Suas Conquistas</h2>
            <Link href="/conquistas" className="text-sm text-primary">
              Ver todas
            </Link>
          </div>

          {isLoading.badges ? (
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : userBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {userBadges.slice(0, 4).map((userBadge) => {
                // Ícone baseado no nome do badge (simplificado)
                let Icon = Award
                if (userBadge.badge?.name.toLowerCase().includes("gourmet")) Icon = Users
                if (userBadge.badge?.name.toLowerCase().includes("sommelier")) Icon = Wine

                return (
                  <BadgeIcon
                    key={userBadge.id}
                    icon={<Icon className="h-6 w-6" />}
                    label={userBadge.badge?.name || ""}
                    unlocked={true}
                  />
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">Você ainda não conquistou nenhum badge.</p>
                <p className="text-sm">Complete desafios para ganhar badges!</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Promoções */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Promoções Exclusivas</h2>

          {isLoading.banners ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ) : banners.length > 0 ? (
            <div className="space-y-4">
              {banners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={banner.image_url || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                      <p className="text-sm text-white/80">{banner.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">Nenhuma promoção disponível no momento.</p>
                <p className="text-sm">Fique atento para novas promoções!</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
