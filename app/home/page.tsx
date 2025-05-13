"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeIcon } from "@/components/ui/badge-icon"
import { Bell, Award, Calendar, Wine, Users, ChevronRight, Sparkles, Gift, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { UserProfileCard } from "@/components/user-profile-card"
import { ReservationModal } from "@/components/reservation-modal"
import type { Challenge, UserBadge, Banner } from "@/lib/types"
import { challengeService } from "@/lib/services/challenge-service"
import { userService } from "@/lib/services/user-service"
import { bannerService } from "@/lib/services/banner-service"
import { Skeleton } from "@/components/ui/skeleton"
import { LevelBadge } from "@/components/ui/level-badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

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
      {/* Mostrar modal de reserva se houver alguma reserva futura */}
      <ReservationModal user={user} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-8">
        {/* User Status */}
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            {isAuthLoading ? (
              <>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0] || "Usuário"}</h2>
                  <p className="text-sm text-muted-foreground">Bem-vindo ao Club OX</p>
                </div>
                {user?.loyalty_level && <LevelBadge level={user.loyalty_level.name} />}
              </>
            )}
          </div>

          <UserProfileCard user={user} isLoading={isAuthLoading} />
        </section>

        {/* Banners de promoção */}
        <section className="animate-slide-up">
          {isLoading.banners ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : banners.length > 0 ? (
            <Carousel opts={{ loop: true, align: "center" }}>
              <CarouselContent>
                {banners.map((banner) => (
                  <CarouselItem key={banner.id}>
                    <div className="relative h-48 overflow-hidden rounded-xl card-shadow">
                      <Image
                        src={banner.image_url || "/placeholder.svg"}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                        <div className="mb-1 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                          <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                          <p className="text-sm text-white/90">{banner.description}</p>
                        </div>
                        {banner.cta_link && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-fit mt-2 animate-slide-up"
                            style={{ animationDelay: "0.5s" }}
                            asChild
                          >
                            <Link href={banner.cta_link}>
                              Saiba mais
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselDots count={banners.length} />
            </Carousel>
          ) : (
            <Card className="overflow-hidden card-shadow">
              <div className="relative h-40">
                <Image src="/placeholder.svg?key=sa476" alt="OX Steakhouse" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    <h3 className="text-xl font-bold text-white">Bem-vindo ao Club OX</h3>
                    <p className="text-sm text-white/90">Acumule pontos e desfrute de benefícios exclusivos</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* Desafios Ativos */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Desafios</h2>
            </div>
            <Link href="/desafios" className="text-sm text-primary flex items-center">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading.challenges ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="min-w-[280px] h-[150px] rounded-xl" />
                ))}
              </div>
            </div>
          ) : activeChallenges.length > 0 ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {activeChallenges.map((challenge, idx) => {
                  // Aqui você precisaria extrair os detalhes do progresso do desafio
                  const progress = challenge.user_challenge?.progress_details?.progress || 0
                  const total = challenge.user_challenge?.progress_details?.total || 1
                  const progressPercent = Math.round((progress / total) * 100)

                  // Ícone baseado no nome do desafio (simplificado)
                  let Icon = Award
                  if (challenge.name.toLowerCase().includes("sommelier")) Icon = Wine
                  if (challenge.name.toLowerCase().includes("cliente")) Icon = Calendar
                  if (challenge.name.toLowerCase().includes("embaixador")) Icon = Users

                  return (
                    <Card
                      key={challenge.id}
                      className={cn(
                        "min-w-[280px] max-w-[280px] card-shadow border-transparent hover:border-primary/30 transition-all",
                        idx === 0 && "shine",
                      )}
                    >
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
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Recompensa:</span>
                          <span className="text-sm font-medium flex items-center">
                            <Award className="h-4 w-4 text-primary mr-1" />
                            {challenge.points_reward} pontos
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                <Card className="min-w-[200px] card-shadow flex items-center justify-center p-4 bg-accent/30">
                  <Link
                    href="/desafios"
                    className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Mais desafios</span>
                  </Link>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="card-shadow border-transparent hover:border-primary/30 transition-all">
              <CardContent className="p-4 text-center py-8">
                <div className="flex flex-col items-center">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Comece sua jornada</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Participe de desafios para ganhar pontos, recompensas exclusivas e aumentar seu nível de fidelidade.
                  </p>
                  <Button asChild>
                    <Link href="/desafios">Explorar desafios</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Conquistas */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Conquistas</h2>
            </div>
            <Link href="/conquistas" className="text-sm text-primary flex items-center">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading.badges ? (
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : userBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {userBadges.slice(0, 4).map((userBadge) => {
                // Ícone baseado no nome do badge (simplificado)
                let Icon = Award
                if (userBadge.badge?.name.toLowerCase().includes("gourmet")) Icon = Utensils
                if (userBadge.badge?.name.toLowerCase().includes("sommelier")) Icon = Wine
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
            </div>
          ) : (
            <Card className="p-6 text-center card-shadow border-transparent">
              <div className="flex flex-col items-center">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Conquiste seus badges</h3>
                <p className="text-muted-foreground text-sm">
                  Complete desafios e visite a OX Steakhouse para desbloquear conquistas exclusivas.
                </p>
              </div>
            </Card>
          )}
        </section>

        {/* Ações Rápidas */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Card className="card-shadow group hover:border-primary/20 transition-all">
              <Link href="/cardapio">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Cardápio</h3>
                  <p className="text-xs text-muted-foreground">Explore nosso menu completo</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="card-shadow group hover:border-primary/20 transition-all">
              <Link href="/reservas/nova">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Reserva</h3>
                  <p className="text-xs text-muted-foreground">Agende sua próxima visita</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="card-shadow group hover:border-primary/20 transition-all">
              <Link href="/loja">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Loja</h3>
                  <p className="text-xs text-muted-foreground">Resgate recompensas exclusivas</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="card-shadow group hover:border-primary/20 transition-all">
              <Link href="/desafios">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Desafios</h3>
                  <p className="text-xs text-muted-foreground">Complete e ganhe pontos</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)
