"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CalendarDays, CalendarPlus, Clock, Users, Utensils, ChevronRight, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { reservationService } from "@/lib/services/reservation-service"
import type { Reservation, ExclusiveExperience } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isPast, isToday, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ReservasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [experiences, setExperiences] = useState<ExclusiveExperience[]>([])
  const [isLoading, setIsLoading] = useState({
    reservations: true,
    experiences: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Buscar reservas do usuário
        setIsLoading((prev) => ({ ...prev, reservations: true }))
        const reservationsData = await reservationService.getUserReservations(user.id)
        setReservations(reservationsData)
        setIsLoading((prev) => ({ ...prev, reservations: false }))

        // Buscar experiências disponíveis
        setIsLoading((prev) => ({ ...prev, experiences: true }))
        const experiencesData = await reservationService.getAvailableExperiences(user.loyalty_level_id)
        setExperiences(experiencesData)
        setIsLoading((prev) => ({ ...prev, experiences: false }))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setIsLoading({
          reservations: false,
          experiences: false,
        })
      }
    }

    fetchData()
  }, [user])

  // Filtrar reservas por status
  const upcomingReservations = reservations.filter(
    (r) => !isPast(new Date(r.reservation_datetime)) && r.status !== "cancelled",
  )
  const pastReservations = reservations.filter(
    (r) => isPast(new Date(r.reservation_datetime)) || r.status === "cancelled",
  )

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reservas</h1>
          <Button onClick={() => router.push("/reservas-nova")} size="sm" className="gap-1">
            <CalendarPlus className="h-4 w-4" />
            Nova Reserva
          </Button>
        </div>

        <Tabs defaultValue="proximas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proximas">Próximas</TabsTrigger>
            <TabsTrigger value="anteriores">Anteriores</TabsTrigger>
          </TabsList>

          <TabsContent value="proximas" className="space-y-4 mt-4 animate-fade-in">
            {isLoading.reservations ? (
              Array(2)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
            ) : upcomingReservations.length > 0 ? (
              upcomingReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card className="card-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma reserva agendada</h3>
                    <p className="text-muted-foreground mb-4">
                      Você não tem reservas futuras. Que tal agendar uma visita à OX Steakhouse?
                    </p>
                    <Button asChild>
                      <Link href="/reservas/nova">Fazer Reserva</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="anteriores" className="space-y-4 mt-4 animate-fade-in">
            {isLoading.reservations ? (
              Array(2)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
            ) : pastReservations.length > 0 ? (
              pastReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} isPast />
              ))
            ) : (
              <Card className="card-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma reserva anterior</h3>
                    <p className="text-muted-foreground">
                      Você ainda não fez nenhuma reserva. Experimente a OX Steakhouse!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Experiências Exclusivas
            </h2>
            <Link href="/experiencias" className="text-sm text-primary flex items-center">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading.experiences ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="min-w-[280px] h-[200px] rounded-xl" />
                  ))}
              </div>
            </div>
          ) : experiences.length > 0 ? (
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {experiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="card-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma experiência disponível</h3>
                  <p className="text-muted-foreground">
                    No momento não há experiências exclusivas disponíveis. Volte em breve!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

interface ReservationCardProps {
  reservation: Reservation
  isPast?: boolean
}

function ReservationCard({ reservation, isPast = false }: ReservationCardProps) {
  const reservationDate = new Date(reservation.reservation_datetime)
  const isToday_ = isToday(reservationDate)
  const isCancelled = reservation.status === "cancelled"

  return (
    <Card
      className={cn(
        "overflow-hidden card-shadow transition-all",
        isPast ? "opacity-80" : "hover:border-primary/20",
        isCancelled && "opacity-60",
      )}
    >
      <Link href={`/reservas/${reservation.id}`}>
        <CardContent className="p-0">
          <div className="flex">
            <div
              className={cn(
                "w-2 flex-shrink-0",
                isCancelled ? "bg-destructive/50" : isToday_ ? "bg-primary" : isPast ? "bg-muted" : "bg-primary/70",
              )}
            ></div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium">
                      {reservation.reservation_type === "table"
                        ? "Reserva de Mesa"
                        : reservation.reservation_type === "dry_aged"
                          ? "Reserva Dry Aged"
                          : "Experiência Exclusiva"}
                    </h3>
                    {isCancelled && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                        Cancelada
                      </span>
                    )}
                    {isToday_ && !isCancelled && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Hoje</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(reservationDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{format(reservationDate, "HH:mm", { locale: ptBR })}</span>
                </div>
                {reservation.number_of_guests && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{reservation.number_of_guests} pessoas</span>
                  </div>
                )}
                {reservation.reservation_type === "dry_aged" && (
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {reservation.product?.name || "Corte especial"} ({reservation.quantity}x)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

interface ExperienceCardProps {
  experience: ExclusiveExperience
}

function ExperienceCard({ experience }: ExperienceCardProps) {
  const experienceDate = new Date(experience.experience_datetime)
  const isComingSoon = isPast(addDays(new Date(), 7))

  return (
    <Card className="min-w-[280px] max-w-[280px] overflow-hidden card-shadow hover:border-primary/20 transition-all">
      <Link href={`/experiencias/${experience.id}`}>
        <div className="relative h-40">
          <Image
            src={
              experience.image_url ||
              "/placeholder.svg?height=300&width=300&query=wine%20tasting%20event%20luxury%20restaurant" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={experience.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
            <div>
              <h3 className="font-medium text-white">{experience.name}</h3>
              <p className="text-xs text-white/90 line-clamp-2">{experience.description}</p>
            </div>
          </div>
          {isComingSoon && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              Em breve
            </div>
          )}
          {experience.points_cost && (
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded-full">
              {experience.points_cost} pts
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-3 mt-1">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs">{format(experienceDate, "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs">{format(experienceDate, "HH:mm", { locale: ptBR })}</span>
            </div>
          </div>
          <Button size="sm" className="w-full mt-3">
            Participar
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
