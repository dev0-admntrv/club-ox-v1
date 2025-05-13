"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { reservationService } from "@/lib/services/reservation-service"
import type { Reservation } from "@/lib/types"
import { format, isToday, isFuture, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface UpcomingReservationsProps {
  userId: string | undefined
}

export function UpcomingReservations({ userId }: UpcomingReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReservations() {
      if (!userId) return

      try {
        setIsLoading(true)
        const userReservations = await reservationService.getUserReservations(userId)

        // Filter for today and future reservations
        const upcomingReservations = userReservations.filter((reservation) => {
          const reservationDate = parseISO(reservation.reservation_datetime)
          return (isToday(reservationDate) || isFuture(reservationDate)) && reservation.status !== "cancelled"
        })

        setReservations(upcomingReservations)
      } catch (error) {
        console.error("Error fetching reservations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [userId])

  if (isLoading) {
    return (
      <Card className="card-shadow">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (reservations.length === 0) {
    return null // Don't show the section if there are no upcoming reservations
  }

  return (
    <Card className="card-shadow">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Próximas Reservas</h2>
          </div>
          <Link href="/reservas" className="text-sm text-primary flex items-center">
            Ver todas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {reservations.slice(0, 3).map((reservation) => {
            const reservationDate = parseISO(reservation.reservation_datetime)
            const formattedDate = format(reservationDate, "dd 'de' MMMM", { locale: ptBR })
            const formattedTime = format(reservationDate, "HH:mm")
            const isForToday = isToday(reservationDate)

            return (
              <Link href={`/reservas/${reservation.id}`} key={reservation.id}>
                <div className="p-3 rounded-lg border border-border hover:border-primary/30 transition-all bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isForToday ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isForToday ? "Hoje" : formattedDate}
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {formattedTime}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        reservation.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {reservation.status === "confirmed" ? "Confirmada" : "Pendente"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {reservation.reservation_type === "table"
                          ? "Reserva de Mesa"
                          : reservation.reservation_type === "dry_aged"
                            ? "Reserva Dry Aged"
                            : "Experiência Exclusiva"}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {reservation.number_of_guests && (
                          <div className="flex items-center mr-3">
                            <Users className="h-3 w-3 mr-1" />
                            {reservation.number_of_guests} {reservation.number_of_guests === 1 ? "pessoa" : "pessoas"}
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          OX Steakhouse
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {reservations.length > 3 && (
          <div className="text-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reservas">Ver mais {reservations.length - 3} reservas</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
