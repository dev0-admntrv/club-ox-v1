"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"

interface Reservation {
  id: string
  reservation_datetime: string
  number_of_guests: number
  special_requests: string | null
  status: string
  reservation_type: string
}

interface ReservationModalProps {
  user: User | null
}

export function ReservationModal({ user }: ReservationModalProps) {
  const [open, setOpen] = useState(false)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkReservations = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "confirmed")
          .gte("reservation_datetime", today.toISOString())
          .order("reservation_datetime", { ascending: true })
          .limit(1)
          .single()

        if (error) {
          if (error.code !== "PGRST116") {
            // PGRST116 é o código de erro para "nenhum resultado"
            console.error("Erro ao buscar reservas:", error)
          }
          setReservation(null)
        } else {
          setReservation(data)
          setOpen(true)
        }
      } catch (error) {
        console.error("Erro ao verificar reservas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkReservations()
  }, [user])

  if (isLoading || !reservation) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="size-5 text-primary" />
            Você tem uma reserva agendada
          </DialogTitle>
          <DialogDescription>Detalhes da sua próxima visita à OX Steakhouse</DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-accent/50 rounded-lg space-y-3 my-2">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-primary" />
            <div>
              <p className="font-medium">Data</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(reservation.reservation_datetime), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="size-5 text-primary" />
            <div>
              <p className="font-medium">Horário</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(reservation.reservation_datetime), "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="size-5 text-primary" />
            <div>
              <p className="font-medium">Número de pessoas</p>
              <p className="text-sm text-muted-foreground">{reservation.number_of_guests}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Utensils className="size-5 text-primary" />
            <div>
              <p className="font-medium">Tipo de reserva</p>
              <p className="text-sm text-muted-foreground capitalize">
                {reservation.reservation_type === "table" ? "Mesa" : "Evento especial"}
              </p>
            </div>
          </div>

          {reservation.special_requests && (
            <div className="pt-2 border-t border-border">
              <p className="font-medium mb-1">Solicitações especiais:</p>
              <p className="text-sm text-muted-foreground">{reservation.special_requests}</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-4">
          <Button variant="outline" asChild>
            <Link href={`/reservas/${reservation.id}`}>Ver detalhes</Link>
          </Button>
          <Button onClick={() => setOpen(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
