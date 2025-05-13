import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { CacheDetector } from "@/components/cache-detector"
import { SessionRecovery } from "@/components/session-recovery"
import { ServiceWorkerWrapper } from "@/components/service-worker-wrapper"

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
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta tags para prevenir cache */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <CacheDetector />
            <SessionRecovery />
            <ServiceWorkerWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
