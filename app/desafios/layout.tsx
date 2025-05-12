import type { ReactNode } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function DesafiosLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header title="Desafios" />
        <main className="flex-1 container max-w-lg mx-auto px-4 pb-20">{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
