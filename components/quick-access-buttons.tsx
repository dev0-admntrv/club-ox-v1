import Link from "next/link"
import { Award, Calendar, Utensils, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const quickAccessButtons = [
  {
    href: "/cardapio",
    icon: Utensils,
    label: "Cardápio",
    description: "Explore nosso menu completo",
    gradient: "from-stone-800 to-stone-950",
  },
  {
    href: "/reservas/nova",
    icon: Calendar,
    label: "Reserva",
    description: "Agende sua próxima visita",
    gradient: "from-stone-800 to-stone-950",
  },
  {
    href: "/embedded?url=https://menudigital.lexsis.com.br/?l=UMthdgF1&title=Pedidos Online",
    icon: ShoppingCart,
    label: "Pedidos",
    description: "Faça seu pedido online",
    gradient: "from-stone-800 to-stone-950",
  },
  {
    href: "/desafios",
    icon: Award,
    label: "Desafios",
    description: "Complete e ganhe pontos",
    gradient: "from-stone-800 to-stone-950",
  },
]

export function QuickAccessButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickAccessButtons.map((button) => (
        <Link
          key={button.href}
          href={button.href}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
        >
          <div className="p-4 flex flex-col items-center text-center relative z-10">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                "bg-gradient-to-br text-white",
                button.gradient,
              )}
            >
              <button.icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-1">{button.label}</h3>
            <p className="text-xs text-muted-foreground">{button.description}</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity z-0"></div>
        </Link>
      ))}
    </div>
  )
}
