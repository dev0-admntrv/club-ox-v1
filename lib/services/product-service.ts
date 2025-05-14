"use client"

import { BaseService } from "./base-service"
import type { Product, ProductCategory } from "@/lib/types"

class ProductService extends BaseService {
  async getProductCategories(): Promise<ProductCategory[]> {
    try {
      const { data, error } = await this.supabase.from("product_categories").select("*")

      if (error) throw error

      return data
    } catch (error) {
      this.handleError(error, "getProductCategories")
    }
  }

  async getProductsByCategory(categoryId: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    try {
      let query = this.supabase
        .from("products")
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq("category_id", categoryId)
        .eq("is_active", true)

      // Filter by loyalty level
      if (userLoyaltyLevelId) {
        query = query.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
      } else {
        query = query.is("min_loyalty_level_id_to_view", null)
      }

      const { data, error } = await query

      if (error) throw error

      return data as unknown as Product[]
    } catch (error) {
      this.handleError(error, "getProductsByCategory")
    }
  }

  async getProductsByType(type: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    try {
      let query = this.supabase
        .from("products")
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq("type", type)
        .eq("is_active", true)

      // Filter by loyalty level
      if (userLoyaltyLevelId) {
        query = query.or(`min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`)
      } else {
        query = query.is("min_loyalty_level_id_to_view", null)
      }

      const { data, error } = await query

      if (error) throw error

      return data as unknown as Product[]
    } catch (error) {
      this.handleError(error, "getProductsByType")
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq("id", productId)
        .single()

      if (error) throw error

      return data as unknown as Product
    } catch (error) {
      this.handleError(error, "getProductById")
    }
  }

  async searchProducts(query: string, userLoyaltyLevelId: string | null): Promise<Product[]> {
    try {
      let dbQuery = this.supabase
        .from("products")
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      // Filter by loyalty level
      if (userLoyaltyLevelId) {
        dbQuery = dbQuery.or(
          `min_loyalty_level_id_to_view.is.null,min_loyalty_level_id_to_view.eq.${userLoyaltyLevelId}`,
        )
      } else {
        dbQuery = dbQuery.is("min_loyalty_level_id_to_view", null)
      }

      const { data, error } = await dbQuery

      if (error) throw error

      return data as unknown as Product[]
    } catch (error) {
      this.handleError(error, "searchProducts")
    }
  }
}

export const productService = new ProductService()
