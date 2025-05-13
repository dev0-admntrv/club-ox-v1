"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LevelBadge } from "@/components/ui/level-badge"
import { useAuth } from "@/contexts/auth-context"
import { productService } from "@/lib/services/product-service"
import type { Product, ProductCategory } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResponsiveImage } from "@/components/ui/responsive-image"

export default function CardapioPage() {
  const { user } = useAuth()

  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Record<string, Product[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar categorias de produtos
        const productCategories = await productService.getProductCategories()
        setCategories(productCategories)

        if (productCategories.length > 0) {
          setActiveCategory(productCategories[0].id)

          // Buscar produtos para cada categoria
          const productsData: Record<string, Product[]> = {}

          for (const category of productCategories) {
            const categoryProducts = await productService.getProductsByCategory(
              category.id,
              user?.loyalty_level_id || null,
            )
            productsData[category.id] = categoryProducts
          }

          setProducts(productsData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do cardápio:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const results = await productService.searchProducts(searchQuery, user?.loyalty_level_id || null)
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

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Cardápio</h1>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar no cardápio"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Resultados da Pesquisa */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Resultados da Pesquisa</h2>
            <div className="grid gap-4">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} userLoyaltyLevelId={user?.loyalty_level_id} />
              ))}
            </div>
          </div>
        )}

        {/* Categorias */}
        {!searchQuery && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} className="h-10" />)
                : categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
            </TabsList>

            {isLoading ? (
              <div className="mt-4 space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
              </div>
            ) : (
              categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    {products[category.id]?.length > 0 ? (
                      products[category.id].map((product) => (
                        <ProductCard key={product.id} product={product} userLoyaltyLevelId={user?.loyalty_level_id} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum produto disponível nesta categoria.
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))
            )}
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

interface ProductCardProps {
  product: Product
  userLoyaltyLevelId: string | null | undefined
}

function ProductCard({ product, userLoyaltyLevelId }: ProductCardProps) {
  const isExclusive =
    product.min_loyalty_level_id_to_purchase && product.min_loyalty_level_id_to_purchase === userLoyaltyLevelId

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-24 h-24">
            <ResponsiveImage
              src={product.image_url || "/placeholder.svg?height=200&width=200&query=steak"}
              alt={product.name}
              fill
              className="rounded-l-lg"
              sizes="(max-width: 768px) 96px, 96px"
            />
          </div>
          <div className="flex-1 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{product.name}</h3>
                {isExclusive && (
                  <LevelBadge
                    level={product.min_loyalty_level_id_to_purchase ? "Exclusivo" : ""}
                    className="text-[10px] px-2 py-0.5"
                  />
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs ml-1">4.8</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium">
                {product.price ? `R$ ${product.price.toFixed(2)}` : "Preço sob consulta"}
              </span>
              <Button size="sm">Adicionar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
