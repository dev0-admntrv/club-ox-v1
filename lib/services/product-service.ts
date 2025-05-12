"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Product, ProductCategory } from "@/lib/types"

export const productService = {
  async getProductCategories(): Promise<ProductCategory[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("product_categories").select("*")

    if (error) throw error

    return data
  },

  async getProductsByCategory(categoryId: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    const supabase = getSupabaseClient()

    let query = supabase
      .from("products")
      .select(`
        *,
        category:product_categories(*)
      `)
      .eq("category_id", categoryId)
      .eq("is_active", true)

    // Se o usuário tiver um nível de fidelidade, filtrar produtos visíveis para esse nível
    if (userLoyaltyLevelId) {
      // Obter produtos sem restrição de nível OU com nível mínimo menor ou igual ao do usuário
      query = query.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
    } else {
      // Se o usuário não tiver nível, mostrar apenas produtos sem restrição
      query = query.is("min_loyalty_level_id_to_view", null)
    }

    const { data, error } = await query

    if (error) throw error

    return data as unknown as Product[]
  },

  async getProductsByType(type: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    const supabase = getSupabaseClient()

    let query = supabase
      .from("products")
      .select(`
        *,
        category:product_categories(*)
      `)
      .eq("type", type)
      .eq("is_active", true)

    // Filtrar por nível de fidelidade
    if (userLoyaltyLevelId) {
      query = query.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
    } else {
      query = query.is("min_loyalty_level_id_to_view", null)
    }

    const { data, error } = await query

    if (error) throw error

    return data as unknown as Product[]
  },

  async getProductById(productId: string): Promise<Product> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:product_categories(*)
      `)
      .eq("id", productId)
      .single()

    if (error) throw error

    return data as unknown as Product
  },

  async searchProducts(query: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    const supabase = getSupabaseClient()

    let dbQuery = supabase
      .from("products")
      .select(`
        *,
        category:product_categories(*)
      `)
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Filtrar por nível de fidelidade
    if (userLoyaltyLevelId) {
      dbQuery = dbQuery.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
    } else {
      dbQuery = dbQuery.is("min_loyalty_level_id_to_view", null)
    }

    const { data, error } = await dbQuery

    if (error) throw error

    return data as unknown as Product[]
  },
}
