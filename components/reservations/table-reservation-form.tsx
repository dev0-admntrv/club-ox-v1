"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { reservationService } from "@/lib/services/reservation-service"

interface TableReservationFormProps {
  onSubmit: (data: {
    date: Date
    time: string
    guests: number
    specialRequests: string
  }) => void
  isSubmitting: boolean
}

export function TableReservationForm({ onSubmit, isSubmitting }: TableReservationFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [guests, setGuests] = useState<number>(2)
  const [specialRequests, setSpecialRequests] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)

  // Datas disponíveis (hoje + 30 dias)
  const today = new Date()
  const maxDate = addDays(today, 30)

  // Buscar horários disponíveis quando a data mudar
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!date) return

      setIsLoadingTimes(true)
      try {
        const times = await reservationService.getAvailableTimeSlots(date.toISOString())
        setAvailableTimes(times)

        // Limpar a seleção de horário se a data mudar
        setTime("")
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error)
      } finally {
        setIsLoadingTimes(false)
      }
    }

    fetchAvailableTimes()
  }, [date])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time) return

    onSubmit({
      date,
      time,
      guests,
      specialRequests,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              disabled={(date) => isBefore(date, startOfDay(today)) || isBefore(maxDate, date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Horário</Label>
        <Select value={time} onValueChange={setTime} disabled={!date || isLoadingTimes}>
          <SelectTrigger id="time" className="w-full">
            <SelectValue placeholder="Selecione um horário">
              {time ? (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </div>
              ) : (
                "Selecione um horário"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoadingTimes ? (
              <div className="p-2 text-center text-sm text-muted-foreground">Carregando horários...</div>
            ) : availableTimes.length > 0 ? (
              availableTimes.map((timeSlot) => (
                <SelectItem key={timeSlot} value={timeSlot}>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {timeSlot}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Nenhum horário disponível para esta data
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Número de pessoas</Label>
        <Select value={guests.toString()} onValueChange={(value) => setGuests(Number.parseInt(value))}>
          <SelectTrigger id="guests" className="w-full">
            <SelectValue placeholder="Selecione o número de pessoas" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "pessoa" : "pessoas"}
              </SelectItem>
            ))}
            <SelectItem value="9">Mais de 8 pessoas (entraremos em contato)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Solicitações especiais (opcional)</Label>
        <Textarea
          id="specialRequests"
          placeholder="Informe qualquer solicitação especial, como preferências alimentares, alergias, ocasião especial, etc."
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!date || !time || isSubmitting}>
        {isSubmitting ? "Enviando..." : "Fazer Reserva"}
      </Button>
    </form>
  )
}
