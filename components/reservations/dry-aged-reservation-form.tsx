"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Info } from "lucide-react"
import { format, addDays, isBefore, addWeeks } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { reservationService } from "@/lib/services/reservation-service"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DryAgedReservationFormProps {
  onSubmit: (data: {
    date: Date
    time: string
    productId: string
    quantity: number
    cutType: string
    maturationDays: number
    preparation: string
    notes: string
  }) => void
  isSubmitting: boolean
}

export function DryAgedReservationForm({ onSubmit, isSubmitting }: DryAgedReservationFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [productId, setProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [cutType, setCutType] = useState<string>("")
  const [maturationDays, setMaturationDays] = useState<number>(30)
  const [preparation, setPreparation] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [dryAgedProducts, setDryAgedProducts] = useState<any[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Datas disponíveis (hoje + 30 dias)
  const today = new Date()
  const minDate = addWeeks(today, 1) // Mínimo de 1 semana para preparação
  const maxDate = addDays(today, 60)

  // Buscar produtos Dry Aged disponíveis
  useEffect(() => {
    const fetchDryAgedProducts = async () => {
      setIsLoadingProducts(true)
      try {
        // Aqui você precisaria passar o nível de fidelidade do usuário
        const products = await reservationService.getDryAgedProducts(null)
        setDryAgedProducts(products)

        if (products.length > 0) {
          setProductId(products[0].id)
        }
      } catch (error) {
        console.error("Erro ao buscar produtos Dry Aged:", error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchDryAgedProducts()
  }, [])

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

    if (!date || !time || !productId || !cutType || !preparation) return

    onSubmit({
      date,
      time,
      productId,
      quantity,
      cutType,
      maturationDays,
      preparation,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">Corte</Label>
        <Select value={productId} onValueChange={setProductId} disabled={isLoadingProducts}>
          <SelectTrigger id="product" className="w-full">
            <SelectValue placeholder="Selecione o corte" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingProducts ? (
              <div className="p-2 text-center text-sm text-muted-foreground">Carregando cortes...</div>
            ) : dryAgedProducts.length > 0 ? (
              dryAgedProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">Nenhum corte disponível</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
          <SelectTrigger id="quantity" className="w-full">
            <SelectValue placeholder="Selecione a quantidade" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "unidade" : "unidades"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cutType">Tipo de Corte</Label>
        <Select value={cutType} onValueChange={setCutType}>
          <SelectTrigger id="cutType" className="w-full">
            <SelectValue placeholder="Selecione o tipo de corte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tradicional">Tradicional</SelectItem>
            <SelectItem value="tomahawk">Tomahawk</SelectItem>
            <SelectItem value="ancho">Ancho</SelectItem>
            <SelectItem value="picanha">Picanha</SelectItem>
            <SelectItem value="costela">Costela</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="maturationDays">Dias de Maturação</Label>
          <span className="text-sm font-medium">{maturationDays} dias</span>
        </div>
        <div className="px-1">
          <Slider
            id="maturationDays"
            min={21}
            max={60}
            step={1}
            value={[maturationDays]}
            onValueChange={(value) => setMaturationDays(value[0])}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>21 dias</span>
          <span>60 dias</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparation">Preparo</Label>
        <Select value={preparation} onValueChange={setPreparation}>
          <SelectTrigger id="preparation" className="w-full">
            <SelectValue placeholder="Selecione o preparo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rare">Mal passada (Rare)</SelectItem>
            <SelectItem value="medium-rare">Ao ponto para mal (Medium Rare)</SelectItem>
            <SelectItem value="medium">Ao ponto (Medium)</SelectItem>
            <SelectItem value="medium-well">Ao ponto para bem (Medium Well)</SelectItem>
            <SelectItem value="well-done">Bem passada (Well Done)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data de Retirada</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span>Data de Retirada</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                A data de retirada deve ser agendada com pelo menos 1 semana de antecedência para garantir o tempo de
                maturação adequado.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              disabled={(date) => isBefore(date, minDate) || isBefore(maxDate, date)}
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
        <Label htmlFor="notes">Observações adicionais (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Informe qualquer observação adicional sobre o seu pedido Dry Aged"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!date || !time || !productId || !cutType || !preparation || isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Fazer Reserva"}
      </Button>
    </form>
  )
}
