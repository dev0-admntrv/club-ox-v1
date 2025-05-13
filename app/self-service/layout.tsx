import type React from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"

export default function SelfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <main className="flex flex-col min-h-screen pb-24">
        {children}
        <BottomNav />
      </main>
    </ProtectedRoute>
  )
}
