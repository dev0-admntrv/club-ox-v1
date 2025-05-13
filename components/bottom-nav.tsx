"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Award, ShoppingBag, User, CalendarClock, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/desafios", label: "Desafios", icon: Award },
  {
    href: "/embedded?url=https://menudigital.lexsis.com.br/?l=UMthdgF1&title=Pedidos Online",
    label: "Pedidos",
    icon: ShoppingCart,
  },
  { href: "/reservas", label: "Reservas", icon: CalendarClock },
  { href: "/loja", label: "Loja", icon: ShoppingBag },
  { href: "/perfil", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/90 backdrop-blur-lg border border-border/50 rounded-full shadow-lg px-2 w-auto">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href.split("?")[0]}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-full relative rounded-full transition-all",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                isActive && "after:absolute after:bottom-3 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-10 h-10 mb-1 transition-all",
                  isActive ? "bg-primary/10" : "bg-transparent",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
