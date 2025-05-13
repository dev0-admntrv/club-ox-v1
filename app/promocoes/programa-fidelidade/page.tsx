"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Award,
  Bell,
  ChevronLeft,
  ChevronRight,
  Gift,
  HelpCircle,
  Share2,
  ShoppingBag,
  Trophy,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LevelBadge } from "@/components/ui/level-badge"
import { useAuth } from "@/contexts/auth-context"

const niveisPrograma = [
  {
    id: 1,
    nome: "Bronze",
    pontos: 0,
    cor: "text-amber-700",
    bgCor: "bg-amber-700/20",
    beneficios: [
      "Acesso ao Club OX",
      "Acúmulo de pontos (1 ponto a cada R$ 1)",
      "Promoções exclusivas",
      "Presente de aniversário",
    ],
  },
  {
    id: 2,
    nome: "Prata",
    pontos: 1000,
    cor: "text-slate-400",
    bgCor: "bg-slate-400/20",
    beneficios: [
      "Todos os benefícios do nível Bronze",
      "Acúmulo de pontos (1,2 pontos a cada R$ 1)",
      "10% de desconto em vinhos selecionados",
      "Reserva prioritária",
    ],
  },
  {
    id: 3,
    nome: "Ouro",
    pontos: 3000,
    cor: "text-yellow-500",
    bgCor: "bg-yellow-500/20",
    beneficios: [
      "Todos os benefícios do nível Prata",
      "Acúmulo de pontos (1,5 pontos a cada R$ 1)",
      "15% de desconto em vinhos selecionados",
      "Acesso a eventos exclusivos",
      "Reserva de cortes especiais",
    ],
  },
  {
    id: 4,
    nome: "Diamante",
    pontos: 7000,
    cor: "text-sky-400",
    bgCor: "bg-sky-400/20",
    beneficios: [
      "Todos os benefícios do nível Ouro",
      "Acúmulo de pontos (2 pontos a cada R$ 1)",
      "20% de desconto em vinhos selecionados",
      "Degustação de novos pratos antes do lançamento",
      "Atendimento personalizado",
      "Mesa preferencial",
    ],
  },
  {
    id: 5,
    nome: "Mestre da Carne",
    pontos: 15000,
    cor: "text-red-600",
    bgCor: "bg-red-600/20",
    beneficios: [
      "Todos os benefícios do nível Diamante",
      "Acúmulo de pontos (3 pontos a cada R$ 1)",
      "25% de desconto em vinhos selecionados",
      "Experiências gastronômicas exclusivas",
      "Convites para eventos VIP",
      "Atendimento do chef executivo",
      "Reserva de dry aged personalizado",
    ],
  },
]

const recompensasDestaque = [
  {
    id: 1,
    nome: "Entrada Gratuita",
    descricao: "Uma entrada à sua escolha grátis em sua próxima visita",
    pontos: 500,
    imagem: "/provoleta-cheese.png",
    disponivel: true,
  },
  {
    id: 2,
    nome: "Garrafa de Vinho",
    descricao: "Uma garrafa de vinho tinto selecionado pelo sommelier",
    pontos: 1200,
    imagem: "/wine-bottle.png",
    disponivel: true,
  },
  {
    id: 3,
    nome: "Jantar para Dois",
    descricao: "Jantar completo para duas pessoas com entrada, prato principal e sobremesa",
    pontos: 3500,
    imagem: "/dinner-for-two.png",
    disponivel: true,
  },
  {
    id: 4,
    nome: "Experiência Dry Aged",
    descricao: "Escolha um corte para maturação dry aged personalizada por 45 dias",
    pontos: 5000,
    imagem: "/dry-aged-experience.png",
    disponivel: true,
  },
]

export default function ProgramaFidelidadePage() {
  const { user, isLoading } = useAuth()
  const [nivelAtivo, setNivelAtivo] = useState(1)

  // Dados simulados do usuário
  const pontosUsuario = user?.points || 1250
  const nivelUsuario = user?.loyalty_level?.name || "Prata"
  const nivelUsuarioId = niveisPrograma.findIndex((nivel) => nivel.nome === nivelUsuario) + 1

  // Cálculo do próximo nível
  const nivelAtual = niveisPrograma.find((nivel) => nivel.nome === nivelUsuario) || niveisPrograma[0]
  const proximoNivel = niveisPrograma.find((nivel) => nivel.id === nivelAtual.id + 1) || nivelAtual
  const pontosParaProximoNivel = proximoNivel.pontos - pontosUsuario
  const progressoProximoNivel =
    nivelAtual.id === proximoNivel.id
      ? 100
      : Math.round(((pontosUsuario - nivelAtual.pontos) / (proximoNivel.pontos - nivelAtual.pontos)) * 100)

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
            <h1 className="text-xl font-bold">Programa de Fidelidade</h1>
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
            src="/banners/loyalty-rewards-banner.jpg"
            alt="Programa de Fidelidade"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit mb-2 bg-primary/90 hover:bg-primary">Club OX</Badge>
            <div className="mb-1 animate-slide-up">
              <h2 className="text-2xl font-bold text-white">Programa de Fidelidade</h2>
              <p className="text-sm text-white/90">Acumule pontos e desfrute de benefícios exclusivos</p>
            </div>
          </div>
        </div>

        {/* Status do usuário */}
        <Card className="card-shadow overflow-hidden">
          <div className="bg-primary/10 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Seu Status</h3>
              <LevelBadge level={nivelUsuario} />
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span>
                Pontos acumulados: <strong>{pontosUsuario}</strong>
              </span>
              {nivelAtual.id < niveisPrograma.length && (
                <span>
                  Próximo nível: <strong>{proximoNivel.nome}</strong>
                </span>
              )}
            </div>
            {nivelAtual.id < niveisPrograma.length ? (
              <>
                <Progress value={progressoProximoNivel} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground text-right">
                  Faltam <strong>{pontosParaProximoNivel}</strong> pontos para o próximo nível
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-right">
                Parabéns! Você atingiu o nível máximo do programa.
              </p>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Seus Benefícios Atuais</h4>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/perfil">
                  Ver Histórico
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ul className="space-y-2">
              {nivelAtual.beneficios.map((beneficio, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Award className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>{beneficio}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tabs de informações */}
        <Tabs defaultValue="niveis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="niveis">Níveis</TabsTrigger>
            <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
            <TabsTrigger value="info">Como Funciona</TabsTrigger>
          </TabsList>
          <TabsContent value="niveis" className="space-y-4 mt-4">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
              {niveisPrograma.map((nivel) => (
                <Card
                  key={nivel.id}
                  className={`min-w-[200px] card-shadow transition-all ${
                    nivelAtivo === nivel.id ? "border-primary" : "border-border"
                  } ${nivel.id === nivelUsuarioId ? "shine" : ""}`}
                  onClick={() => setNivelAtivo(nivel.id)}
                >
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-full ${nivel.bgCor} flex items-center justify-center mb-3`}>
                      <Trophy className={`h-5 w-5 ${nivel.cor}`} />
                    </div>
                    <h4 className="font-bold mb-1">{nivel.nome}</h4>
                    <p className="text-xs text-muted-foreground mb-2">A partir de {nivel.pontos} pontos</p>
                    {nivel.id === nivelUsuarioId && (
                      <Badge className="bg-primary/90 hover:bg-primary">Seu nível atual</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">Benefícios do Nível {niveisPrograma[nivelAtivo - 1].nome}</h3>
                <ul className="space-y-2">
                  {niveisPrograma[nivelAtivo - 1].beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Award className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {nivelAtivo > nivelUsuarioId && (
                <CardFooter className="p-4 pt-0 border-t border-border mt-4">
                  <div className="w-full">
                    <p className="text-sm mb-2">
                      Faltam <strong>{niveisPrograma[nivelAtivo - 1].pontos - pontosUsuario}</strong> pontos para
                      atingir este nível
                    </p>
                    <Button className="w-full">Fazer Reserva</Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="recompensas" className="space-y-4 mt-4">
            <h3 className="text-lg font-bold">Recompensas em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recompensasDestaque.map((recompensa) => (
                <Card key={recompensa.id} className="overflow-hidden card-shadow">
                  <div className="relative h-40">
                    <ResponsiveImage
                      src={recompensa.imagem}
                      alt={recompensa.nome}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/90 hover:bg-primary">{recompensa.pontos} pontos</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-1">{recompensa.nome}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{recompensa.descricao}</p>
                    <Button
                      className="w-full"
                      variant={pontosUsuario >= recompensa.pontos ? "default" : "outline"}
                      disabled={pontosUsuario < recompensa.pontos}
                    >
                      {pontosUsuario >= recompensa.pontos
                        ? "Resgatar"
                        : `Faltam ${recompensa.pontos - pontosUsuario} pontos`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/recompensas">
                Ver Todas as Recompensas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </TabsContent>
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card className="card-shadow">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-bold">Como Funciona</h3>
                <p className="text-sm text-muted-foreground">
                  O Club OX é o programa de fidelidade da OX Steakhouse, criado para recompensar nossos clientes mais
                  fiéis com benefícios exclusivos e experiências únicas.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Acumule Pontos</h4>
                      <p className="text-xs text-muted-foreground">
                        Ganhe pontos a cada compra na OX Steakhouse. O valor de pontos varia de acordo com seu nível no
                        programa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Suba de Nível</h4>
                      <p className="text-xs text-muted-foreground">
                        Quanto mais pontos acumular, mais alto será seu nível no programa, desbloqueando benefícios cada
                        vez melhores.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Resgate Recompensas</h4>
                      <p className="text-xs text-muted-foreground">
                        Use seus pontos para resgatar recompensas exclusivas, desde entradas gratuitas até experiências
                        gastronômicas completas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                      <Utensils className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Aproveite Benefícios</h4>
                      <p className="text-xs text-muted-foreground">
                        Desfrute de benefícios exclusivos de acordo com seu nível, como reservas prioritárias, descontos
                        em vinhos e muito mais.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-bold">Perguntas Frequentes</h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                      Como me cadastro no programa?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      O cadastro é automático ao criar sua conta no aplicativo Club OX. Todos os clientes começam no
                      nível Bronze.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                      Os pontos expiram?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      Sim, os pontos têm validade de 12 meses a partir da data em que foram acumulados. Pontos não
                      utilizados expiram após esse período.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                      Como faço para subir de nível?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      O nível é determinado pela quantidade de pontos acumulados nos últimos 12 meses. Ao atingir a
                      pontuação necessária, você sobe automaticamente de nível.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                      Posso perder meu nível?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      Sim, os níveis são reavaliados a cada 6 meses. Se sua pontuação nos últimos 12 meses estiver
                      abaixo do necessário para seu nível atual, você pode ser rebaixado para o nível correspondente.
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/perfil/ajuda">
                    Ver Todas as Perguntas
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
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
