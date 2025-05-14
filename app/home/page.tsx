"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeIcon } from "@/components/ui/badge-icon"
import { Bell, Award, Calendar, Wine, Users, ChevronRight, Sparkles, Gift, Utensils, Flame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { UserProfileCard } from "@/components/user-profile-card"
import { ReservationModal } from "@/components/reservation-modal"
import { UpcomingReservations } from "@/components/upcoming-reservations"
import type { Challenge, UserBadge, Banner } from "@/lib/types"
import { challengeService } from "@/lib/services/challenge-service"
import { userService } from "@/lib/services/user-service"
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

// Banners locais temporários
const localBanners: Banner[] = [
  {
    id: "1",
    title: "Experiência Premium de Carnes",
    description: "Desfrute dos melhores cortes selecionados pelos nossos chefs",
    image_url: "/banner-1.jpg",
    cta_link: "/cardapio",
    is_active: true,
    display_order: 1,
  },
  {
    id: "2",
    title: "Degustação de Vinhos Exclusiva",
    description: "Participe de nossa próxima degustação com sommelier premiado",
    image_url: "/banner-2.jpg",
    cta_link: "/eventos",
    is_active: true,
    display_order: 2,
  },
  {
    id: "3",
    title: "Menu Especial do Chef",
    description: "Novos pratos disponíveis exclusivamente para membros",
    image_url: "/banner-3.jpg",
    cta_link: "/cardapio/especial",
    is_active: true,
    display_order: 3,
  },
]

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

  // Função simplificada para verificar se uma imagem existe (removida a funcionalidade que causa o erro)
  const getImagePath = (imagePath: string): string => {
    // Retorna um placeholder se o caminho estiver vazio
    if (!imagePath) {
      return "/cozy-steakhouse.png"
    }

    // Se for um caminho remoto (URL), retornar como está
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // Se for um caminho local, usar o placeholder como fallback
    return imagePath || "/cozy-steakhouse.png"
  }

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

          // Temporariamente usando banners locais em vez de buscar do Supabase
          setIsLoading((prev) => ({ ...prev, banners: true }))

          // Preparar banners com caminhos de imagem verificados
          const preparedBanners = localBanners.map((banner) => ({
            ...banner,
            image_url: getImagePath(banner.image_url),
          }))

          // Simular um pequeno atraso para parecer que está carregando do servidor
          setTimeout(() => {
            setBanners(preparedBanners)
            setIsLoading((prev) => ({ ...prev, banners: false }))
          }, 500)

          /* Código original para buscar banners do Supabase - mantido para referência futura
          const bannerData = await bannerService.getActiveBanners(user.loyalty_level_id)
          setBanners(bannerData)
          setIsLoading((prev) => ({ ...prev, banners: false }))
          */
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          // Em caso de erro, ainda definimos os banners locais com caminhos verificados
          const fallbackBanners = localBanners.map((banner) => ({
            ...banner,
            image_url: getImagePath(banner.image_url),
          }))

          setBanners(fallbackBanners)
          setIsLoading({
            challenges: false,
            badges: false,
            banners: false,
          })
        }
      } else {
        // Se não houver usuário, ainda mostramos os banners locais
        const preparedBanners = localBanners.map((banner) => ({
          ...banner,
          image_url: getImagePath(banner.image_url),
        }))

        setBanners(preparedBanners)
        setIsLoading((prev) => ({ ...prev, banners: false }))
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

      <main className="container px-4 py-6 space-y-6">
        {/* 1. User Status */}
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

        {/* 5. Conquistas (movido para posição 2) */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
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
            <Card className="p-6 text-center border-transparent">
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

        {/* 2. Banners de promoção (movido para posição 3) */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Promoções</h2>
            </div>
          </div>

          {isLoading.banners ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : banners.length > 0 ? (
            <div className="relative">
              <Carousel opts={{ loop: true, align: "center" }}>
                <CarouselContent>
                  {banners.map((banner) => (
                    <CarouselItem key={banner.id}>
                      <div className="relative h-48 overflow-hidden rounded-xl card-shadow">
                        {/* Usando o componente Image com fallback */}
                        <Image
                          src={banner.image_url || "/placeholder.svg?height=400&width=800&query=steakhouse"}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback para placeholder se a imagem não carregar
                            const target = e.target as HTMLImageElement
                            target.onerror = null // Prevenir loop infinito
                            target.src = `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(banner.title)}`
                          }}
                          priority // Carregar imagens com prioridade
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
            </div>
          ) : (
            <Card className="overflow-hidden card-shadow">
              <div className="relative h-48">
                <Image src="/cozy-steakhouse.png" alt="OX Steakhouse" fill className="object-cover" priority />
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

        {/* 3. Upcoming Reservations (movido para posição 4) */}
        {!isAuthLoading && user && (
          <section className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <UpcomingReservations userId={user.id} />
          </section>
        )}

        {/* 4. Desafios Ativos (movido para posição 5) */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
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
                        "min-w-[280px] max-w-[280px] overflow-hidden border border-border hover:border-primary/30 transition-all duration-300",
                        idx === 0 && "relative",
                      )}
                    >
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-bl-md z-10">
                          Em destaque
                        </div>
                      )}
                      <div className="h-1.5 bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{challenge.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {progress}/{total} {challenge.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                progressPercent < 100 ? "bg-primary animate-pulse" : "bg-green-500"
                              }`}
                            ></div>
                            <span className="text-xs font-medium">
                              {progressPercent < 100 ? `${progressPercent}% completo` : "Completo!"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                            <Award className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary">{challenge.points_reward} pts</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                <Card className="min-w-[200px] flex items-center justify-center p-4 bg-accent/30 border-dashed border-2 border-muted">
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
            <Card className="border-transparent hover:border-primary/30 transition-all">
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

        {/* 6. Ações Rápidas (mantido na posição 6) */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.35s" }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Card className="group hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <Link href="/cardapio">
                <CardContent className="p-4 flex flex-col items-center text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors z-10">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1 relative z-10">Cardápio</h3>
                  <p className="text-xs text-muted-foreground relative z-10">Explore nosso menu completo</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <Link href="/reservas/nova">
                <CardContent className="p-4 flex flex-col items-center text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors z-10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1 relative z-10">Reserva</h3>
                  <p className="text-xs text-muted-foreground relative z-10">Agende sua próxima visita</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <Link href="/loja">
                <CardContent className="p-4 flex flex-col items-center text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors z-10">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1 relative z-10">Loja</h3>
                  <p className="text-xs text-muted-foreground relative z-10">Resgate recompensas exclusivas</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <Link href="/desafios">
                <CardContent className="p-4 flex flex-col items-center text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors z-10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1 relative z-10">Desafios</h3>
                  <p className="text-xs text-muted-foreground relative z-10">Complete e ganhe pontos</p>
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
