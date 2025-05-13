"use client"

import { getSupabaseClient } from "@/lib/supabase/client"

class StorageService {
  async uploadImage(file: File, bucket: string, path: string): Promise<string> {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        throw new Error(`Erro ao fazer upload da imagem: ${error.message}`)
      }

      // Obter a URL pública da imagem
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

      return publicUrlData.publicUrl
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      throw error
    }
  }
}

export const storageService = new StorageService()
