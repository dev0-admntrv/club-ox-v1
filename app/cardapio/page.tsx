"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Logo } from "@/components/logo"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, Star } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { LevelBadge } from "@/components/ui/level-badge"
import { useAuth } from "@/contexts/auth-context"
import { productService } from "@/lib/services/product-service"
import type { Product, ProductCategory } from "@/lib/types"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { OfflineBanner } from "@/components/offline-banner"
import { useOffline } from "@/hooks/use-offline"
import { getOptimizedImageUrl } from "@/lib/image-utils"
import { useToast } from "@/hooks/use-toast"

export default function CardapioPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isOffline = useOffline()

  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Record<string, Product[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState({
    categories: true,
    products: true,
    search: false,
  })
  const [errors, setErrors] = useState({
    categories: null as Error | null,
    products: null as Error | null,
    search: null as Error | null,
  })
  const [activeCategory, setActiveCategory] = useState("")

  // Fetch categories and products
  const fetchData = useCallback(async () => {
    try {
      // Fetch product categories
      setIsLoading((prev) => ({ ...prev, categories: true }))
      setErrors((prev) => ({ ...prev, categories: null }))

      const productCategories = await productService.getProductCategories()
      setCategories(productCategories)

      if (productCategories.length > 0) {
        setActiveCategory(productCategories[0].id)

        // Fetch products for each category
        setIsLoading((prev) => ({ ...prev, products: true }))
        setErrors((prev) => ({ ...prev, products: null }))

        const productsData: Record<string, Product[]> = {}

        for (const category of productCategories) {
          try {
            const categoryProducts = await productService.getProductsByCategory(
              category.id,
              user?.loyalty_level_id || null,
            )
            productsData[category.id] = categoryProducts
          } catch (error) {
            console.error(`Error loading products for category ${category.id}:`, error)
            // Continue with other categories even if one fails
            productsData[category.id] = []
          }
        }

        setProducts(productsData)
        setIsLoading((prev) => ({ ...prev, products: false }))
      }

      setIsLoading((prev) => ({ ...prev, categories: false }))
    } catch (error) {
      console.error("Error loading menu data:", error)
      setErrors({
        categories: error as Error,
        products: error as Error,
        search: null,
      })

      if (!isOffline) {
        toast({
          title: "Erro ao carregar cardápio",
          description: "Não foi possível carregar os dados do cardápio. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        categories: false,
        products: false,
      }))
    }
  }, [user, toast, isOffline])

  // Initial data load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle search with debounce
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsLoading((prev) => ({ ...prev, search: true }))
      setErrors((prev) => ({ ...prev, search: null }))

      const results = await productService.searchProducts(searchQuery, user?.loyalty_level_id || null)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching products:", error)
      setErrors((prev) => ({ ...prev, search: error as Error }))

      if (!isOffline) {
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, search: false }))
    }
  }, [searchQuery, user?.loyalty_level_id, toast, isOffline])

  // Debounce search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchQuery, handleSearch])

  // Memoize active category products
  const activeCategoryProducts = useMemo(() => {
    return activeCategory ? products[activeCategory] || [] : []
  }, [activeCategory, products])

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Offline banner */}
      <OfflineBanner />

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
            aria-label="Buscar no cardápio"
          />
        </div>

        {/* Resultados da Pesquisa */}
        {searchQuery && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Resultados da Pesquisa</h2>

            {isLoading.search ? (
              <LoadingSkeleton type="list" count={3} />
            ) : errors.search ? (
              <ErrorMessage
                title="Erro na busca"
                message="Não foi possível realizar a busca. Tente novamente."
                onRetry={handleSearch}
              />
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} userLoyaltyLevelId={user?.loyalty_level_id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado para "{searchQuery}".
              </div>
            )}
          </div>
        )}

        {/* Categorias */}
        {!searchQuery && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="relative overflow-x-auto -mx-4 px-4">
              <TabsList className="w-max flex" style={{ minWidth: "100%" }} aria-label="Categorias de produtos">
                {isLoading.categories
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => <LoadingSkeleton key={i} type="card" className="h-10 w-24" />)
                  : categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))}
              </TabsList>
            </div>

            {errors.categories ? (
              <ErrorMessage title="Erro ao carregar categorias" onRetry={fetchData} />
            ) : isLoading.products ? (
              <div className="mt-4 space-y-4">
                <LoadingSkeleton type="list" count={3} />
              </div>
            ) : (
              categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                  {errors.products ? (
                    <ErrorMessage title={`Erro ao carregar produtos de ${category.name}`} onRetry={fetchData} />
                  ) : products[category.id]?.length > 0 ? (
                    <div className="grid gap-4">
                      {products[category.id].map((product) => (
                        <ProductCard key={product.id} product={product} userLoyaltyLevelId={user?.loyalty_level_id} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum produto disponível nesta categoria.
                    </div>
                  )}
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

  // Optimize image URL
  const imageUrl = useMemo(() => {
    return getOptimizedImageUrl(product.image_url, {
      width: 96,
      height: 96,
      fallback: `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(product.name)}`,
    })
  }, [product.image_url, product.name])

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-24 h-24">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-l-lg"
              sizes="96px"
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
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium">
                {product.price ? `R$ ${product.price.toFixed(2)}` : "Preço sob consulta"}
              </span>
              <Button size="sm" aria-label={`Adicionar ${product.name} ao pedido`}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
