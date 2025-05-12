"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CalendarDays, CalendarRange, Flame } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { reservationService } from "@/lib/services/reservation-service"
import { TableReservationForm } from "@/components/reservations/table-reservation-form"
import { DryAgedReservationForm } from "@/components/reservations/dry-aged-reservation-form"

export default function NovaReservaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTableReservation = async (data: {
    date: Date
    time: string
    guests: number
    specialRequests: string
  }) => {
    if (!user) return

    try {
      setIsSubmitting(true)

      // Combinar data e hora
      const reservationDate = new Date(data.date)
      const [hours, minutes] = data.time.split(":").map(Number)
      reservationDate.setHours(hours, minutes)

      await reservationService.createTableReservation(
        user.id,
        reservationDate.toISOString(),
        data.guests,
        data.specialRequests || null,
        user.loyalty_level_id,
      )

      toast({
        title: "Reserva realizada com sucesso!",
        description: "Sua reserva foi enviada e está aguardando confirmação.",
      })

      router.push("/reservas")
    } catch (error) {
      console.error("Erro ao fazer reserva:", error)
      toast({
        title: "Erro ao fazer reserva",
        description: "Não foi possível completar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDryAgedReservation = async (data: {
    date: Date
    time: string
    productId: string
    quantity: number
    cutType: string
    maturationDays: number
    preparation: string
    notes: string
  }) => {
    if (!user) return

    try {
      setIsSubmitting(true)

      // Combinar data e hora
      const reservationDate = new Date(data.date)
      const [hours, minutes] = data.time.split(":").map(Number)
      reservationDate.setHours(hours, minutes)

      const dryAgedPreferences = {
        cut_type: data.cutType,
        maturation_days: data.maturationDays,
        preparation: data.preparation,
        notes: data.notes,
      }

      await reservationService.createDryAgedReservation(
        user.id,
        reservationDate.toISOString(),
        data.productId,
        data.quantity,
        dryAgedPreferences,
        null,
        user.loyalty_level_id,
      )

      toast({
        title: "Reserva Dry Aged realizada!",
        description: "Sua reserva de corte especial foi enviada e está aguardando confirmação.",
      })

      router.push("/reservas")
    } catch (error) {
      console.error("Erro ao fazer reserva:", error)
      toast({
        title: "Erro ao fazer reserva",
        description: "Não foi possível completar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Nova Reserva</h1>
          </div>
          <Logo className="scale-75" />
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <Tabs defaultValue="mesa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mesa" className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              <span>Mesa</span>
            </TabsTrigger>
            <TabsTrigger value="dryaged" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span>Dry Aged</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mesa" className="space-y-4 mt-4 animate-fade-in">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Reserva de Mesa
                </CardTitle>
                <CardDescription>
                  Reserve uma mesa na OX Steakhouse para desfrutar de uma experiência gastronômica única.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TableReservationForm onSubmit={handleTableReservation} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dryaged" className="space-y-4 mt-4 animate-fade-in">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  Reserva Dry Aged
                </CardTitle>
                <CardDescription>
                  Reserve com antecedência um corte especial Dry Aged com o tempo de maturação de sua preferência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DryAgedReservationForm onSubmit={handleDryAgedReservation} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
