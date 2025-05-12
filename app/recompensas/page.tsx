"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Gift, Tag, Clock, Utensils, ShoppingBag, Award, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Tipos para as recompensas
interface Reward {
  id: string
  title: string
  description: string
  points_cost: number
  image_url?: string
  expires_at?: string
  category: "discount" | "menu_item" | "experience" | "product"
  availability: "available" | "out_of_stock" | "coming_soon"
}

export default function RecompensasPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)

  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoading(true)
      try {
        // Simulando carregamento de dados
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados de exemplo
        const mockRewards: Reward[] = [
          {
            id: "reward_1",
            title: "15% de desconto",
            description: "Desconto de 15% em qualquer prato do cardápio principal",
            points_cost: 500,
            category: "discount",
            availability: "available",
          },
          {
            id: "reward_2",
            title: "Sobremesa Especial",
            description: "Uma sobremesa exclusiva criada pelo nosso chef",
            points_cost: 300,
            image_url: "/placeholder.svg?key=h2dn2",
            category: "menu_item",
            availability: "available",
          },
          {
            id: "reward_3",
            title: "Degustação de Vinhos",
            description: "Experiência de degustação com nosso sommelier",
            points_cost: 1000,
            image_url: "/wine-tasting.png",
            category: "experience",
            availability: "available",
          },
          {
            id: "reward_4",
            title: "Kit Churrasco OX",
            description: "Kit exclusivo com avental, luva e utensílios personalizados",
            points_cost: 1500,
            image_url: "/placeholder.svg?key=w3fvr",
            category: "product",
            availability: "available",
          },
          {
            id: "reward_5",
            title: "Corte Dry Aged Especial",
            description: "Um corte premium maturado por 30 dias",
            points_cost: 800,
            image_url: "/placeholder.svg?key=jtp1i",
            category: "menu_item",
            availability: "out_of_stock",
          },
          {
            id: "reward_6",
            title: "Jantar Exclusivo com o Chef",
            description: "Experiência gastronômica personalizada com nosso chef executivo",
            points_cost: 2000,
            image_url: "/placeholder.svg?key=ywh42",
            category: "experience",
            availability: "coming_soon",
          },
        ]

        setRewards(mockRewards)
      } catch (error) {
        console.error("Erro ao carregar recompensas:", error)
        toast({
          title: "Erro ao carregar recompensas",
          description: "Não foi possível carregar as recompensas disponíveis. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRewards()
  }, [toast])

  const handleRedeemReward = async (reward: Reward) => {
    if (!user || (user.points_balance || 0) < reward.points_cost) {
      toast({
        title: "Pontos insuficientes",
        description: "Você não possui pontos suficientes para resgatar esta recompensa.",
        variant: "destructive",
      })
      return
    }

    setIsRedeeming(true)
    try {
      // Simulando chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Recompensa resgatada!",
        description: "Sua recompensa foi resgatada com sucesso. Confira os detalhes no seu e-mail.",
        variant: "success",
      })

      // Fechar o diálogo
      setSelectedReward(null)
    } catch (error) {
      console.error("Erro ao resgatar recompensa:", error)
      toast({
        title: "Erro ao resgatar recompensa",
        description: "Não foi possível resgatar a recompensa. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  const filteredRewards = activeCategory ? rewards.filter((reward) => reward.category === activeCategory) : rewards

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "discount":
        return <Tag className="h-5 w-5" />
      case "menu_item":
        return <Utensils className="h-5 w-5" />
      case "experience":
        return <Award className="h-5 w-5" />
      case "product":
        return <ShoppingBag className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "discount":
        return "Descontos"
      case "menu_item":
        return "Menu"
      case "experience":
        return "Experiências"
      case "product":
        return "Produtos"
      default:
        return "Outros"
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Recompensas</h1>
          <p className="text-muted-foreground">Troque seus pontos por recompensas exclusivas</p>
        </div>

        {/* Pontos do usuário */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Seus pontos</p>
                <p className="text-2xl font-bold">{user?.points_balance || 0}</p>
              </div>
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Filtros de categoria */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory(null)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Todos
          </Button>
          <Button
            variant={activeCategory === "discount" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory("discount")}
          >
            <Tag className="h-4 w-4 mr-1" />
            Descontos
          </Button>
          <Button
            variant={activeCategory === "menu_item" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory("menu_item")}
          >
            <Utensils className="h-4 w-4 mr-1" />
            Menu
          </Button>
          <Button
            variant={activeCategory === "experience" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory("experience")}
          >
            <Award className="h-4 w-4 mr-1" />
            Experiências
          </Button>
          <Button
            variant={activeCategory === "product" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory("product")}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Produtos
          </Button>
        </div>

        {/* Lista de recompensas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton loading
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : filteredRewards.length > 0 ? (
            filteredRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                {reward.image_url && (
                  <div className="aspect-video relative">
                    <Image
                      src={reward.image_url || "/placeholder.svg"}
                      alt={reward.title}
                      fill
                      className="object-cover"
                    />
                    {reward.availability !== "available" && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <Badge
                          variant={reward.availability === "coming_soon" ? "secondary" : "outline"}
                          className="text-sm px-3 py-1"
                        >
                          {reward.availability === "coming_soon" ? "Em breve" : "Esgotado"}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center">
                      {getCategoryIcon(reward.category)}
                      <span className="ml-1">{getCategoryName(reward.category)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  {reward.expires_at && (
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Disponível até: {reward.expires_at}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="font-bold text-primary">{reward.points_cost} pontos</div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          reward.availability !== "available" || (user?.points_balance || 0) < reward.points_cost
                        }
                        onClick={() => setSelectedReward(reward)}
                      >
                        Resgatar
                      </Button>
                    </DialogTrigger>
                    {selectedReward && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Resgate</DialogTitle>
                          <DialogDescription>Você está prestes a resgatar a seguinte recompensa:</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h3 className="font-bold text-lg mb-2">{selectedReward.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{selectedReward.description}</p>
                          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                            <span>Custo:</span>
                            <span className="font-bold text-primary">{selectedReward.points_cost} pontos</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 p-3">
                            <span>Seu saldo atual:</span>
                            <span className="font-bold">{user?.points_balance || 0} pontos</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 p-3 border-t">
                            <span>Saldo após resgate:</span>
                            <span className="font-bold">
                              {(user?.points_balance || 0) - selectedReward.points_cost} pontos
                            </span>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedReward(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => handleRedeemReward(selectedReward)} disabled={isRedeeming}>
                            {isRedeeming ? "Processando..." : "Confirmar Resgate"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma recompensa encontrada</h3>
                  <p className="text-muted-foreground">
                    {activeCategory
                      ? `Não há recompensas disponíveis na categoria ${getCategoryName(activeCategory)} no momento.`
                      : "Não há recompensas disponíveis no momento. Volte em breve para conferir as novidades!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
