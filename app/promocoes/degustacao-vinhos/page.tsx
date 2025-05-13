"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, ChevronLeft, Clock, GlassWater, MapPin, Share2, Star, Users } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const vinhos = [
  {
    id: 1,
    nome: "Malbec Reserva",
    descricao: "Vinho tinto encorpado com notas de frutas negras e especiarias.",
    origem: "Argentina",
    ano: 2018,
    harmonizacao: "Cortes bovinos como Ancho e Tomahawk",
    imagem: "/wine-malbec.png",
  },
  {
    id: 2,
    nome: "Cabernet Sauvignon",
    descricao: "Vinho tinto com taninos marcantes e notas de cassis e cedro.",
    origem: "Chile",
    ano: 2019,
    harmonizacao: "Carnes vermelhas grelhadas e queijos maturados",
    imagem: "/wine-cabernet.png",
  },
  {
    id: 3,
    nome: "Syrah",
    descricao: "Vinho tinto com aromas de frutas silvestres, pimenta e toques defumados.",
    origem: "Brasil",
    ano: 2020,
    harmonizacao: "Carnes vermelhas com molhos encorpados",
    imagem: "/wine-syrah.png",
  },
  {
    id: 4,
    nome: "Chardonnay",
    descricao: "Vinho branco com notas de frutas tropicais e toques de baunilha.",
    origem: "Brasil",
    ano: 2021,
    harmonizacao: "Peixes, frutos do mar e queijos leves",
    imagem: "/wine-chardonnay.png",
  },
]

const proximasDatas = [
  {
    id: 1,
    data: "08/06/2023",
    horario: "19:00 - 22:00",
    vagas: 8,
    tema: "Vinhos Argentinos",
  },
  {
    id: 2,
    data: "15/06/2023",
    horario: "19:00 - 22:00",
    vagas: 12,
    tema: "Vinhos Chilenos",
  },
  {
    id: 3,
    data: "22/06/2023",
    horario: "19:00 - 22:00",
    vagas: 10,
    tema: "Vinhos Brasileiros",
  },
  {
    id: 4,
    data: "29/06/2023",
    horario: "19:00 - 22:00",
    vagas: 12,
    tema: "Vinhos Portugueses",
  },
]

export default function DegustacaoVinhosPage() {
  const [dataEscolhida, setDataEscolhida] = useState<number | null>(null)

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/home">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Degustação de Vinhos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Banner principal */}
        <div className="relative h-56 overflow-hidden rounded-xl card-shadow">
          <ResponsiveImage
            src="/banners/wine-tasting-event.jpg"
            alt="Noite de Degustação de Vinhos"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit mb-2 bg-primary/90 hover:bg-primary">Evento Semanal</Badge>
            <div className="mb-1 animate-slide-up">
              <h2 className="text-2xl font-bold text-white">Noite de Degustação de Vinhos</h2>
              <p className="text-sm text-white/90">
                Junte-se ao nosso sommelier para uma experiência única de harmonização
              </p>
            </div>
          </div>
        </div>

        {/* Informações do evento */}
        <Card className="card-shadow">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xl font-bold">Sobre o Evento</h3>
            <p className="text-sm text-muted-foreground">
              Nossa noite de degustação de vinhos é uma experiência sensorial completa, onde nosso sommelier guiará você
              por uma seleção de vinhos premium, cuidadosamente harmonizados com pratos especiais do nosso menu.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs text-center">3 horas de experiência</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                <GlassWater className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs text-center">4 rótulos selecionados</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                <Users className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs text-center">Grupos de até 12 pessoas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de informações */}
        <Tabs defaultValue="datas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datas">Datas</TabsTrigger>
            <TabsTrigger value="vinhos">Vinhos</TabsTrigger>
            <TabsTrigger value="info">Detalhes</TabsTrigger>
          </TabsList>
          <TabsContent value="datas" className="space-y-4 mt-4">
            <h3 className="text-lg font-bold">Próximas Degustações</h3>
            <div className="space-y-3">
              {proximasDatas.map((data) => (
                <Card
                  key={data.id}
                  className={`card-shadow transition-all ${
                    dataEscolhida === data.id ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setDataEscolhida(data.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{data.tema}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{data.data}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{data.horario}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={data.vagas > 0 ? "outline" : "destructive"}>
                          {data.vagas > 0 ? `${data.vagas} vagas` : "Esgotado"}
                        </Badge>
                        <p className="text-sm font-medium mt-2">R$ 180,00</p>
                        <p className="text-xs text-muted-foreground">por pessoa</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="w-full" disabled={dataEscolhida === null}>
              Reservar Vaga
            </Button>
          </TabsContent>
          <TabsContent value="vinhos" className="space-y-4 mt-4">
            <h3 className="text-lg font-bold">Seleção de Vinhos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nossa seleção de vinhos varia a cada semana, mas sempre inclui rótulos premium de diferentes regiões
              vinícolas. Abaixo estão alguns exemplos dos vinhos que você poderá degustar:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vinhos.map((vinho) => (
                <Card key={vinho.id} className="overflow-hidden card-shadow">
                  <div className="relative h-40">
                    <ResponsiveImage
                      src={vinho.imagem}
                      alt={vinho.nome}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{vinho.nome}</h4>
                      <Badge variant="outline">{vinho.ano}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vinho.descricao}</p>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Origem:</span> {vinho.origem}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Harmonização:</span> {vinho.harmonizacao}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card className="card-shadow">
              <CardContent className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>O que está incluído?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Degustação de 4 rótulos de vinhos premium</li>
                        <li>Tábua de frios e queijos selecionados</li>
                        <li>Petiscos especiais harmonizados com cada vinho</li>
                        <li>Explicação detalhada de cada vinho pelo sommelier</li>
                        <li>Material informativo sobre os vinhos degustados</li>
                        <li>10% de desconto na compra de garrafas dos vinhos degustados</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Local e Horário</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          OX Steakhouse - Sala de Degustação
                        </p>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          Todas as quintas-feiras
                        </p>
                        <p className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          Das 19h às 22h
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Política de Cancelamento</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Cancelamentos podem ser feitos com até 24 horas de antecedência para reembolso integral. Após
                        esse prazo, será cobrada uma taxa de 50% do valor. Em caso de não comparecimento sem aviso
                        prévio, não haverá reembolso.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Recomendações</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Chegue com 15 minutos de antecedência</li>
                        <li>Evite usar perfumes fortes que possam interferir na experiência sensorial</li>
                        <li>
                          Caso tenha alguma restrição alimentar, informe com antecedência para adaptarmos os
                          acompanhamentos
                        </li>
                        <li>
                          Se pretende dirigir após o evento, recomendamos que utilize serviços de transporte alternativo
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Avaliações</h3>
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="ml-2 text-sm font-medium">4.9</span>
                  <span className="ml-1 text-sm text-muted-foreground">(128 avaliações)</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Marcelo S.</span>
                      <div className="flex">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      "Experiência incrível! O sommelier é muito conhecedor e explica tudo de forma clara e
                      descontraída. Os vinhos estavam excelentes e a harmonização perfeita."
                    </p>
                  </div>
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Ana P.</span>
                      <div className="flex">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      "Já participei de várias degustações, mas esta superou todas as expectativas. Ambiente agradável,
                      vinhos de excelente qualidade e petiscos deliciosos."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  Ver todas as avaliações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
