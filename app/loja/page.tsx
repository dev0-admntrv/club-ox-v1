"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { productService } from "@/lib/services/product-service"
import { orderService } from "@/lib/services/order-service"
import type { Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"

export default function LojaPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [experiences, setExperiences] = useState<Product[]>([])
  const [vouchers, setVouchers] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<{ id: string; quantity: number }[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Buscar produtos por tipo
        const productsData = await productService.getProductsByType("REWARD", user.loyalty_level_id)
        setProducts(productsData)

        // Buscar experiências
        const experiencesData = await productService.getProductsByType("EXPERIENCE", user.loyalty_level_id)
        setExperiences(experiencesData)

        // Buscar vouchers
        const vouchersData = await productService.getProductsByType("VOUCHER", user.loyalty_level_id)
        setVouchers(vouchersData)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) {
      setSearchResults([])
      return
    }

    try {
      const results = await productService.searchProducts(searchQuery, user.loyalty_level_id)
      setSearchResults(results)
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const addToCart = (productId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId)

      if (existingItem) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { id: productId, quantity: 1 }]
      }
    })

    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado ao carrinho.",
    })
  }

  const redeemProduct = async (productId: string, pointsCost: number) => {
    if (!user) return

    try {
      await orderService.createRewardOrder(user.id, productId, 1, pointsCost)

      toast({
        title: "Resgate realizado com sucesso!",
        description: "Sua recompensa foi resgatada.",
      })
    } catch (error) {
      console.error("Erro ao resgatar produto:", error)

      toast({
        title: "Erro ao resgatar",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Loja</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Seus pontos:</span>
            <span className="text-primary font-bold">{user.points_balance}</span>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Resultados da Pesquisa */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Resultados da Pesquisa</h2>
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRedeem={redeemProduct}
                  userPoints={user.points_balance}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categorias */}
        {!searchQuery && (
          <Tabs defaultValue="produtos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="experiencias">Experiências</TabsTrigger>
              <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
            </TabsList>

            <TabsContent value="produtos" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onRedeem={redeemProduct}
                      userPoints={user.points_balance}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum produto disponível.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="experiencias" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-80 rounded-lg" />
                    ))}
                </div>
              ) : experiences.length > 0 ? (
                <div className="grid gap-4">
                  {experiences.map((experience) => (
                    <ExperienceCard
                      key={experience.id}
                      experience={experience}
                      onRedeem={redeemProduct}
                      userPoints={user.points_balance}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhuma experiência disponível.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="vouchers" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
              ) : vouchers.length > 0 ? (
                <div className="grid gap-4">
                  {vouchers.map((voucher) => (
                    <VoucherCard
                      key={voucher.id}
                      voucher={voucher}
                      onRedeem={redeemProduct}
                      userPoints={user.points_balance}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum voucher disponível.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onRedeem: (productId: string, pointsCost: number) => void
  userPoints: number
}

function ProductCard({ product, onRedeem, userPoints }: ProductCardProps) {
  const hasEnoughPoints = userPoints >= (product.points_cost || 0)

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <ResponsiveImage
          src={product.image_url || "/placeholder.svg?height=300&width=300&query=premium%20steak%20knife%20set"}
          alt={product.name}
          fill
          className="transition-transform hover:scale-105 duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {product.points_cost && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            {product.points_cost} pts
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={() => product.points_cost && onRedeem(product.id, product.points_cost)}
          disabled={!hasEnoughPoints}
        >
          {hasEnoughPoints ? "Resgatar" : "Pontos insuficientes"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface ExperienceCardProps {
  experience: Product
  onRedeem: (productId: string, pointsCost: number) => void
  userPoints: number
}

function ExperienceCard({ experience, onRedeem, userPoints }: ExperienceCardProps) {
  const hasEnoughPoints = userPoints >= (experience.points_cost || 0)

  return (
    <Card className="overflow-hidden">
      <div className="relative h-60">
        <ResponsiveImage
          src={
            experience.image_url || "/placeholder.svg?height=400&width=600&query=luxury%20wine%20tasting%20experience"
          }
          alt={experience.name}
          fill
          className="transition-transform hover:scale-105 duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {experience.points_cost && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            {experience.points_cost} pts
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{experience.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{experience.description}</p>
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={() => experience.points_cost && onRedeem(experience.id, experience.points_cost)}
          disabled={!hasEnoughPoints}
        >
          {hasEnoughPoints ? "Resgatar" : "Pontos insuficientes"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface VoucherCardProps {
  voucher: Product
  onRedeem: (productId: string, pointsCost: number) => void
  userPoints: number
}

function VoucherCard({ voucher, onRedeem, userPoints }: VoucherCardProps) {
  const hasEnoughPoints = userPoints >= (voucher.points_cost || 0)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{voucher.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{voucher.description}</p>
        {voucher.points_cost && (
          <div className="mb-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded inline-block">
            {voucher.points_cost} pts
          </div>
        )}
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={() => voucher.points_cost && onRedeem(voucher.id, voucher.points_cost)}
          disabled={!hasEnoughPoints}
        >
          {hasEnoughPoints ? "Resgatar" : "Pontos insuficientes"}
        </Button>
      </CardContent>
    </Card>
  )
}
