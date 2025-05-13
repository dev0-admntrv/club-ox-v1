"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Bell, Calendar, ChevronLeft, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"

const eventos = [
  {
    id: 1,
    titulo: "Noite de Degustação de Vinhos",
    descricao:
      "Junte-se ao nosso sommelier para uma noite especial de degustação de vinhos premium, cuidadosamente selecionados para harmonizar com nossos cortes de carne.",
    data: "Toda quinta-feira",
    horario: "19:00 - 22:00",
    local: "OX Steakhouse",
    imagem: "/banners/wine-tasting-event.jpg",
    preco: "R$ 180,00 por pessoa",
    vagas: 12,
  },
  {
    id: 2,
    titulo: "Workshop de Cortes Nobres",
    descricao:
      "Aprenda sobre os diferentes cortes de carne, técnicas de preparo e como escolher o melhor corte para cada ocasião com nosso chef executivo.",
    data: "15 de Junho, 2023",
    horario: "16:00 - 18:00",
    local: "OX Steakhouse - Sala VIP",
    imagem: "/banners/premium-cuts-banner.jpg",
    preco: "R$ 220,00 por pessoa",
    vagas: 8,
  },
  {
    id: 3,
    titulo: "Jantar Harmonizado",
    descricao:
      "Uma experiência gastronômica exclusiva com menu degustação de 5 tempos, cada um harmonizado com um vinho especial selecionado pelo nosso sommelier.",
    data: "Último sábado do mês",
    horario: "20:00 - 23:00",
    local: "OX Steakhouse",
    imagem: "/luxury-wine-tasting.png",
    preco: "R$ 350,00 por pessoa",
    vagas: 20,
  },
]

export default function EventosPage() {
  const [activeTab, setActiveTab] = useState<"proximos" | "passados">("proximos")

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
            <h1 className="text-xl font-bold">Eventos</h1>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="relative h-48 overflow-hidden rounded-xl card-shadow">
          <ResponsiveImage
            src="/banners/wine-tasting-event.jpg"
            alt="Eventos OX Steakhouse"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <div className="mb-1 animate-slide-up">
              <h2 className="text-2xl font-bold text-white">Eventos Exclusivos</h2>
              <p className="text-sm text-white/90">Experiências gastronômicas únicas para nossos clientes</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "proximos" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("proximos")}
          >
            Próximos Eventos
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "passados" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("passados")}
          >
            Eventos Passados
          </button>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {activeTab === "proximos" ? (
            eventos.map((evento) => (
              <Card key={evento.id} className="overflow-hidden card-shadow">
                <div className="relative h-40">
                  <ResponsiveImage
                    src={evento.imagem}
                    alt={evento.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2">{evento.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{evento.descricao}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{evento.data}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{evento.horario}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{evento.local}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{evento.preco}</p>
                    <p className="text-xs text-muted-foreground">{evento.vagas} vagas disponíveis</p>
                  </div>
                  <Button>Reservar</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum evento passado</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Não há registros de eventos passados. Fique atento aos próximos eventos exclusivos.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
