"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReservasNovaRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/reservas-nova")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  )
}
