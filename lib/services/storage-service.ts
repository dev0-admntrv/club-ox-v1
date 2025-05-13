"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

export const storageService = {
  async uploadImage(file: File, bucket = "banners"): Promise<string | null> {
    try {
      const supabase = getSupabaseClient()

      // Gerar um nome de arquivo único
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${bucket}/${fileName}`

      // Fazer upload do arquivo
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        return null
      }

      // Obter a URL pública da imagem
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      return null
    }
  },
}
