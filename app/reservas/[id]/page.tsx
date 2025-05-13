"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarDays, Clock, Users, Utensils, MapPin, AlertTriangle, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { reservationService } from "@/lib/services/reservation-service"
import type { Reservation } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { BackButton } from "@/components/ui/back-button"
import { CloseButton } from "@/components/ui/close-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ReservationDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const fetchReservation = async () => {
      if (!params.id) return

      // Verificar se o ID é um UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(params.id)) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const data = await reservationService.getReservationById(params.id)
        setReservation(data)
      } catch (error) {
        console.error("Erro ao carregar reserva:", error)
        toast({
          title: "Erro ao carregar reserva",
          description: "Não foi possível carregar os detalhes da reserva.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservation()
  }, [params.id, toast])

  const handleCancelReservation = async () => {
    if (!reservation) return

    setIsCancelling(true)
    try {
      await reservationService.cancelReservation(reservation.id)

      // Atualizar o estado local
      setReservation({
        ...reservation,
        status: "cancelled",
      })

      toast({
        title: "Reserva cancelada",
        description: "Sua reserva foi cancelada com sucesso.",
      })

      setShowCancelDialog(false)
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error)
      toast({
        title: "Erro ao cancelar reserva",
        description: "Não foi possível cancelar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <BackButton />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <CloseButton onClick={() => router.push("/reservas")} />
              <Logo className="scale-75" />
            </div>
          </div>
        </header>

        <main className="container px-4 py-6 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </main>

        <BottomNav />
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen pb-16">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <BackButton />
              <h1 className="text-xl font-bold">Reserva não encontrada</h1>
            </div>
            <div className="flex items-center gap-2">
              <CloseButton onClick={() => router.push("/reservas")} />
              <Logo className="scale-75" />
            </div>
          </div>
        </header>

        <main className="container px-4 py-6">
          <Card className="card-shadow">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Reserva não encontrada</h2>
              <p className="text-muted-foreground mb-4">Não foi possível encontrar os detalhes desta reserva.</p>
              <Button onClick={() => router.push("/reservas")}>Voltar para Reservas</Button>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    )
  }

  const reservationDate = new Date(reservation.reservation_datetime)
  const isPastReservation = isPast(reservationDate)
  const isCancelled = reservation.status === "cancelled"
  const isConfirmed = reservation.status === "confirmed"
  const isPending = reservation.status === "pending"

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-xl font-bold">Detalhes da Reserva</h1>
          </div>
          <div className="flex items-center gap-2">
            <CloseButton onClick={() => router.push("/reservas")} />
            <Logo className="scale-75" />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <Card className="card-shadow overflow-hidden">
          <div
            className={cn(
              "h-2",
              isCancelled ? "bg-destructive" : isConfirmed ? "bg-primary" : isPending ? "bg-amber-500" : "bg-muted",
            )}
          ></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {reservation.reservation_type === "table"
                  ? "Reserva de Mesa"
                  : reservation.reservation_type === "dry_aged"
                    ? "Reserva Dry Aged"
                    : "Experiência Exclusiva"}
              </h2>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  isCancelled
                    ? "bg-destructive/10 text-destructive"
                    : isConfirmed
                      ? "bg-primary/10 text-primary"
                      : isPending
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-muted text-muted-foreground",
                )}
              >
                {isCancelled ? "Cancelada" : isConfirmed ? "Confirmada" : isPending ? "Pendente" : "Concluída"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(reservationDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">{format(reservationDate, "HH:mm", { locale: ptBR })}</p>
                </div>
              </div>

              {reservation.number_of_guests && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Número de pessoas</p>
                    <p className="text-sm text-muted-foreground">{reservation.number_of_guests}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Local</p>
                  <p className="text-sm text-muted-foreground">OX Steakhouse - São Paulo</p>
                </div>
              </div>

              {reservation.reservation_type === "dry_aged" && reservation.product && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Corte Dry Aged</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.product.name} ({reservation.quantity}x)
                    </p>
                  </div>
                </div>
              )}

              {reservation.dry_aged_preferences && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="font-medium mb-2">Preferências Dry Aged</h3>
                  <div className="space-y-2">
                    {reservation.dry_aged_preferences.cut_type && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tipo de corte:</span>
                        <span className="text-sm">{reservation.dry_aged_preferences.cut_type}</span>
                      </div>
                    )}
                    {reservation.dry_aged_preferences.maturation_days && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Dias de maturação:</span>
                        <span className="text-sm">{reservation.dry_aged_preferences.maturation_days} dias</span>
                      </div>
                    )}
                    {reservation.dry_aged_preferences.preparation && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Preparo:</span>
                        <span className="text-sm">{reservation.dry_aged_preferences.preparation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reservation.special_requests && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="font-medium mb-2">Solicitações especiais</h3>
                  <p className="text-sm text-muted-foreground">{reservation.special_requests}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex flex-col gap-3">
            {!isCancelled && !isPastReservation && (
              <Button variant="outline" className="w-full" onClick={() => setShowCancelDialog(true)}>
                Cancelar Reserva
              </Button>
            )}
            <Button variant="default" className="w-full" onClick={() => router.push("/reservas")}>
              Voltar para Reservas
            </Button>
          </CardFooter>
        </Card>

        {isConfirmed && !isPastReservation && !isCancelled && (
          <Card className="card-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Reserva confirmada!</h3>
                <p className="text-sm text-muted-foreground">
                  Sua reserva está confirmada. Esperamos você na OX Steakhouse!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelando..." : "Sim, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  )
}
