"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface HeaderProps {
  showBackButton?: boolean
  title?: string
}

export function Header({ showBackButton = false, title }: HeaderProps) {
  const pathname = usePathname()

  // Determinar se estamos em uma página interna
  const isInternalPage = pathname !== "/home" && pathname !== "/login" && pathname !== "/"

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {(showBackButton || isInternalPage) && (
            <Link href={pathname.includes("/perfil/") ? "/perfil" : "/home"} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          )}
          {title ? <h1 className="text-lg font-semibold">{title}</h1> : <Logo className="h-8" />}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
