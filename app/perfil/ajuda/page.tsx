"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Phone, Mail, FileQuestion } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AjudaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulando envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Mensagem enviada",
        description: "Recebemos sua mensagem e responderemos em breve.",
        variant: "success",
      })

      setContactForm({
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Ajuda e Suporte</h1>
      </div>

      <div className="space-y-6">
        {/* Perguntas Frequentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" /> Perguntas Frequentes
            </CardTitle>
            <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como funciona o programa de fidelidade?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    O programa de fidelidade Club OX permite acumular pontos a cada visita e consumo no restaurante. Os
                    pontos podem ser trocados por benefícios exclusivos, como descontos, itens do menu e experiências
                    especiais. Quanto mais pontos você acumular, mais alto será seu nível de fidelidade, desbloqueando
                    benefícios ainda melhores.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Como faço para ganhar pontos?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Você ganha pontos de várias formas:
                    <br />• A cada R$ 1 gasto no restaurante = 1 ponto
                    <br />• Completando desafios no aplicativo
                    <br />• Convidando amigos para o Club OX
                    <br />• Participando de eventos especiais
                    <br />• Fazendo reservas pelo aplicativo
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Como faço uma reserva?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Para fazer uma reserva, acesse a seção "Reservas" no menu principal do aplicativo. Lá você poderá
                    escolher a data, horário e número de pessoas. Também é possível fazer reservas especiais para cortes
                    Dry Aged e experiências exclusivas. Após confirmar sua reserva, você receberá uma notificação de
                    confirmação.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Como funcionam os desafios?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Os desafios são missões que você pode completar para ganhar pontos extras e badges exclusivos. Eles
                    podem incluir experimentar determinados pratos, visitar o restaurante em dias específicos, convidar
                    amigos, entre outros. Acesse a seção "Desafios" para ver quais estão disponíveis para você e
                    acompanhar seu progresso.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Como resgatar meus pontos?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Para resgatar seus pontos, acesse a seção "Recompensas" no aplicativo. Lá você encontrará todas as
                    opções disponíveis para seu nível atual, como descontos, itens do menu, experiências exclusivas e
                    produtos da loja. Selecione a recompensa desejada e confirme o resgate. Algumas recompensas são
                    aplicadas automaticamente, enquanto outras geram um código que deve ser apresentado no restaurante.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" /> Entre em Contato
            </CardTitle>
            <CardDescription>Envie uma mensagem para nossa equipe de suporte</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Dúvida sobre pontos"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva sua dúvida ou problema em detalhes..."
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Outros Canais */}
        <Card>
          <CardHeader>
            <CardTitle>Outros Canais de Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">(11) 3456-7890</p>
                <p className="text-xs text-muted-foreground">Segunda a sexta, das 9h às 18h</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg border border-border">
              <div className="mr-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-sm text-muted-foreground">contato@oxsteakhouse.com.br</p>
                <p className="text-xs text-muted-foreground">Resposta em até 24 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
