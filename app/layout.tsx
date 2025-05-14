import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { registerServiceWorker } from "@/lib/register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Club OX - Programa de Fidelidade",
  description: "Aplicativo de fidelidade premium da OX Steakhouse",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Register service worker
  if (typeof window !== "undefined") {
    registerServiceWorker()
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextThemeProvider attribute="class" defaultTheme="dark">
          <ThemeProvider>
            <AuthProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
}
