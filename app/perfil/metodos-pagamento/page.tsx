"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Plus, Trash2, Smartphone, Banknote, QrCode } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Tipo para cartões de crédito
interface CreditCardType {
  id: string
  last4: string
  brand: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

export default function MetodosPagamentoPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Estado para armazenar os cartões (mock)
  const [cards, setCards] = useState<CreditCardType[]>([
    {
      id: "card_1",
      last4: "4242",
      brand: "visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "card_2",
      last4: "1234",
      brand: "mastercard",
      expiryMonth: "08",
      expiryYear: "2024",
      isDefault: false,
    },
  ])

  // Estado para o formulário de novo cartão
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Função para adicionar um novo cartão (mock)
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Criar um novo cartão (mock)
      const cardNumber = newCard.number.replace(/\s/g, "")
      const last4 = cardNumber.slice(-4)
      const [expiryMonth, expiryYear] = newCard.expiry.split("/")

      const newCardData: CreditCardType = {
        id: `card_${Date.now()}`,
        last4,
        brand: cardNumber.startsWith("4") ? "visa" : "mastercard",
        expiryMonth,
        expiryYear: `20${expiryYear}`,
        isDefault: cards.length === 0, // Primeiro cartão é o padrão
      }

      setCards((prev) => [...prev, newCardData])
      setNewCard({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
      })

      setIsDialogOpen(false)

      toast({
        title: "Cartão adicionado",
        description: "Seu cartão foi adicionado com sucesso.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar cartão",
        description: "Não foi possível adicionar seu cartão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para remover um cartão
  const handleRemoveCard = async (cardId: string) => {
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCards((prev) => prev.filter((card) => card.id !== cardId))

      toast({
        title: "Cartão removido",
        description: "Seu cartão foi removido com sucesso.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover cartão",
        description: "Não foi possível remover seu cartão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para definir um cartão como padrão
  const handleSetDefaultCard = async (cardId: string) => {
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCards((prev) =>
        prev.map((card) => ({
          ...card,
          isDefault: card.id === cardId,
        })),
      )

      toast({
        title: "Cartão padrão atualizado",
        description: "Seu cartão padrão foi atualizado com sucesso.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar cartão padrão",
        description: "Não foi possível atualizar seu cartão padrão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Formatação do número do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedValue = value
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19)

    setNewCard((prev) => ({ ...prev, number: formattedValue }))
  }

  // Formatação da data de expiração
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    let formattedValue = value

    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }

    setNewCard((prev) => ({ ...prev, expiry: formattedValue }))
  }

  // Formatação do CVC
  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
    setNewCard((prev) => ({ ...prev, cvc: value }))
  }

  // Função para obter o ícone do cartão
  const getCardIcon = (brand: string) => {
    if (brand === "visa") {
      return "💳 Visa"
    } else if (brand === "mastercard") {
      return "💳 Mastercard"
    } else {
      return "💳"
    }
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Métodos de Pagamento</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seus cartões</CardTitle>
          <CardDescription>Gerencie seus cartões de crédito e débito para pagamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          {cards.length > 0 ? (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    card.isDefault ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <CreditCard className={`h-6 w-6 ${card.isDefault ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getCardIcon(card.brand)} •••• {card.last4}
                        {card.isDefault && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Padrão
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expira em {card.expiryMonth}/{card.expiryYear.slice(-2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {!card.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefaultCard(card.id)}>
                        Definir como padrão
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">Você ainda não tem cartões cadastrados.</p>
              <p className="text-sm">Adicione um cartão para facilitar seus pagamentos.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Adicionar novo cartão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar novo cartão</DialogTitle>
                <DialogDescription>Preencha os dados do seu cartão para adicioná-lo à sua conta.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddCard}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={newCard.number}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      value={newCard.name}
                      onChange={(e) => setNewCard((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade (MM/AA)</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={newCard.expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={handleCVCChange}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adicionando..." : "Adicionar cartão"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outros métodos de pagamento</CardTitle>
          <CardDescription>Métodos de pagamento aceitos no restaurante.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Cartões de crédito e débito</p>
                <p className="text-sm text-muted-foreground">Aceitamos Visa, Mastercard, American Express e Elo.</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <Smartphone className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Pagamento por aproximação</p>
                <p className="text-sm text-muted-foreground">Apple Pay, Google Pay e Samsung Pay.</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <Banknote className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Dinheiro</p>
                <p className="text-sm text-muted-foreground">Aceito apenas no restaurante físico.</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <QrCode className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Pix</p>
                <p className="text-sm text-muted-foreground">Pagamento instantâneo via QR Code.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
