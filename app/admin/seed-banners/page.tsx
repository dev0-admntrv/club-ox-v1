"use client"

import SeedBanners from "@/scripts/seed-banners"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SeedBannersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.role === "admin") {
      setIsAdmin(true)
    } else if (!isLoading && user) {
      router.push("/home")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  if (!isAdmin) {
    return <div className="p-6">Acesso negado. Esta página é apenas para administradores.</div>
  }

  return <SeedBanners />
}
