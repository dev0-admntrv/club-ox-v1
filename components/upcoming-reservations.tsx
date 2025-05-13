import Link from "next/link"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarClock, ChevronRight, Clock, Users, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Reservation } from "@/lib/types"

interface UpcomingReservationsProps {
  reservations: Reservation[]
  isLoading: boolean
}

export function UpcomingReservations({ reservations, isLoading }: UpcomingReservationsProps) {
  // Filter to show only the next 2 upcoming reservations
  const upcomingReservations = reservations
    .filter((r) => new Date(r.reservation_datetime) >= new Date() && r.status !== "cancelled")
    .sort((a, b) => new Date(a.reservation_datetime).getTime() - new Date(b.reservation_datetime).getTime())
    .slice(0, 2)

  return (
    <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Próximas Reservas</h2>
        </div>
        <Link href="/reservas" className="text-sm text-primary flex items-center">
          Ver todas
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : upcomingReservations.length > 0 ? (
        <div className="space-y-3">
          {upcomingReservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      ) : (
        <Card className="card-shadow border-transparent hover:border-primary/20 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center py-6">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium mb-1">Nenhuma reserva agendada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você não tem reservas futuras. Que tal agendar uma visita à OX Steakhouse?
            </p>
            <Button asChild size="sm">
              <Link href="/reservas/nova">Fazer Reserva</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

interface ReservationCardProps {
  reservation: Reservation
}

function ReservationCard({ reservation }: ReservationCardProps) {
  const reservationDate = new Date(reservation.reservation_datetime)
  const isToday_ = isToday(reservationDate)

  return (
    <Card className="overflow-hidden card-shadow border-transparent hover:border-primary/20 transition-all">
      <Link href={`/reservas/${reservation.id}`}>
        <CardContent className="p-0">
          <div className="flex">
            <div className={cn("w-2 flex-shrink-0", isToday_ ? "bg-primary" : "bg-primary/70")}></div>
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
                    {isToday_ && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Hoje</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(reservationDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
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
