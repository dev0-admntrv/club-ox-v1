"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, ChevronLeft, Clock, Info, Minus, Plus, Share2, Star } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const cortesPremium = [
  {
    id: 1,
    nome: "Tomahawk",
    descricao: "Corte nobre com osso, maturado por 30 dias, ideal para compartilhar.",
    preco: 289.9,
    imagem: "/grilled-tomahawk.jpg",
    peso: "800g a 1kg",
    tempoPreparo: "35-40 min",
    classificacao: 5,
    disponivel: true,
    maturacao: 30,
    origem: "Black Angus",
  },
  {
    id: 2,
    nome: "Ancho Premium",
    descricao: "Corte suculento da parte dianteira do contrafilé, maturado por 21 dias.",
    preco: 159.9,
    imagem: "/grilled-ribeye.jpg",
    peso: "400g",
    tempoPreparo: "25-30 min",
    classificacao: 4.8,
    disponivel: true,
    maturacao: 21,
    origem: "Angus",
  },
  {
    id: 3,
    nome: "Picanha Premium",
    descricao: "Corte tradicional brasileiro, maturado por 15 dias para realçar o sabor.",
    preco: 139.9,
    imagem: "/grilled-picanha.png",
    peso: "400g",
    tempoPreparo: "20-25 min",
    classificacao: 4.9,
    disponivel: true,
    maturacao: 15,
    origem: "Angus",
  },
  {
    id: 4,
    nome: "Dry Aged Ribeye",
    descricao: "Maturado a seco por 45 dias, proporcionando sabor intenso e textura única.",
    preco: 199.9,
    imagem: "/dry-aged-ribeye.png",
    peso: "350g",
    tempoPreparo: "25-30 min",
    classificacao: 5,
    disponivel: true,
    maturacao: 45,
    origem: "Black Angus",
  },
  {
    id: 5,
    nome: "Filet Mignon",
    descricao: "O corte mais macio, maturado por 15 dias para realçar a maciez.",
    preco: 169.9,
    imagem: "/grilled-filet-mignon.png",
    peso: "300g",
    tempoPreparo: "20-25 min",
    classificacao: 4.7,
    disponivel: true,
    maturacao: 15,
    origem: "Angus",
  },
]

export default function CortesPremiumPage() {
  const [quantidades, setQuantidades] = useState<Record<number, number>>(
    Object.fromEntries(cortesPremium.map((corte) => [corte.id, 0])),
  )

  const aumentarQuantidade = (id: number) => {
    setQuantidades((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const diminuirQuantidade = (id: number) => {
    if (quantidades[id] > 0) {
      setQuantidades((prev) => ({ ...prev, [id]: prev[id] - 1 }))
    }
  }

  const totalItens = Object.values(quantidades).reduce((sum, qty) => sum + qty, 0)
  const valorTotal = cortesPremium.reduce((sum, corte) => sum + corte.preco * (quantidades[corte.id] || 0), 0)

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
            <h1 className="text-xl font-bold">Cortes Premium</h1>
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
            src="/banners/premium-cuts-banner.jpg"
            alt="Cortes Premium Selecionados"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit mb-2 bg-primary/90 hover:bg-primary">Promoção Especial</Badge>
            <div className="mb-1 animate-slide-up">
              <h2 className="text-2xl font-bold text-white">Cortes Premium Selecionados</h2>
              <p className="text-sm text-white/90">
                Experimente nossos cortes especiais maturados para uma experiência gastronômica única
              </p>
            </div>
          </div>
        </div>

        {/* Informações da promoção */}
        <Card className="card-shadow">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xl font-bold">Sobre a Promoção</h3>
            <p className="text-sm text-muted-foreground">
              Nossa seleção de cortes premium inclui as melhores peças de carne, cuidadosamente selecionadas e maturadas
              para realçar o sabor e a maciez. Cada corte é preparado por nossos chefs especializados e servido no ponto
              perfeito.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm font-medium mb-1">Período da Promoção</span>
                <span className="text-xs text-muted-foreground">De 01/06 a 30/06</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm font-medium mb-1">Disponibilidade</span>
                <span className="text-xs text-muted-foreground">Todos os dias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de informações */}
        <Tabs defaultValue="cortes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cortes">Cortes Disponíveis</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>
          <TabsContent value="cortes" className="space-y-4 mt-4">
            {cortesPremium.map((corte) => (
              <Card key={corte.id} className="overflow-hidden card-shadow">
                <div className="relative h-48">
                  <ResponsiveImage
                    src={corte.imagem}
                    alt={corte.nome}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 hover:bg-primary">{corte.maturacao} dias de maturação</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{corte.nome}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{corte.classificacao}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{corte.descricao}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-1 text-primary" />
                      <span>{corte.peso}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary" />
                      <span>{corte.tempoPreparo}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">R$ {corte.preco.toFixed(2)}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => diminuirQuantidade(corte.id)}
                        disabled={quantidades[corte.id] === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center">{quantidades[corte.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => aumentarQuantidade(corte.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card className="card-shadow">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-bold">Processo de Maturação</h3>
                <p className="text-sm text-muted-foreground">
                  Nossos cortes passam por um cuidadoso processo de maturação a úmido (wet aging) ou a seco (dry aging),
                  que pode durar de 15 a 45 dias. Este processo permite que as enzimas naturais da carne quebrem as
                  fibras musculares, resultando em uma textura mais macia e um sabor mais concentrado.
                </p>

                <h3 className="text-lg font-bold">Origem das Carnes</h3>
                <p className="text-sm text-muted-foreground">
                  Trabalhamos exclusivamente com carnes de raças premium como Angus e Black Angus, criadas em fazendas
                  selecionadas com os mais altos padrões de qualidade e bem-estar animal.
                </p>

                <h3 className="text-lg font-bold">Preparo</h3>
                <p className="text-sm text-muted-foreground">
                  Nossos chefs são especializados em técnicas de preparo que realçam o sabor natural da carne. Cada
                  corte é grelhado na temperatura ideal para atingir o ponto perfeito, preservando a suculência e o
                  sabor.
                </p>

                <h3 className="text-lg font-bold">Recomendações</h3>
                <p className="text-sm text-muted-foreground">
                  Para uma experiência completa, recomendamos acompanhar nossos cortes premium com uma seleção de vinhos
                  tintos encorpados, como Malbec, Cabernet Sauvignon ou Syrah.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão de ação */}
        {totalItens > 0 && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
            <Button className="w-full" size="lg">
              Finalizar Pedido • {totalItens} {totalItens === 1 ? "item" : "itens"} • R$ {valorTotal.toFixed(2)}
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
