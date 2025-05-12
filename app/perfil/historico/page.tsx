"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/lib/services/user-service"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, CreditCard, ShoppingBag, Utensils, Gift, Award, Users } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { PointsTransaction, Order, Reservation } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function HistoricoPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoadingData, setIsLoadingData] = useState({
    transactions: true,
    orders: true,
    reservations: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Carregar transações
          setIsLoadingData((prev) => ({ ...prev, transactions: true }))
          const pointsTransactions = await userService.getUserPointsTransactions(user.id)
          setTransactions(pointsTransactions)
          setIsLoadingData((prev) => ({ ...prev, transactions: false }))

          // Carregar pedidos (mock por enquanto)
          setIsLoadingData((prev) => ({ ...prev, orders: true }))
          // const userOrders = await orderService.getUserOrders(user.id)
          const userOrders: Order[] = [] // Mock vazio por enquanto
          setOrders(userOrders)
          setIsLoadingData((prev) => ({ ...prev, orders: false }))

          // Carregar reservas (mock por enquanto)
          setIsLoadingData((prev) => ({ ...prev, reservations: true }))
          // const userReservations = await reservationService.getUserReservations(user.id)
          const userReservations: Reservation[] = [] // Mock vazio por enquanto
          setReservations(userReservations)
          setIsLoadingData((prev) => ({ ...prev, reservations: false }))
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          setIsLoadingData({
            transactions: false,
            orders: false,
            reservations: false,
          })
        }
      }
    }

    fetchData()
  }, [user])

  // Filtrar transações por tipo
  const visits = transactions.filter((t) => t.transaction_type === "VISIT_CONSUMPTION_EARNED")
  const redemptions = transactions.filter((t) => t.transaction_type === "REWARD_REDEMPTION_SPENT")
  const challenges = transactions.filter((t) => t.transaction_type === "CHALLENGE_COMPLETED_EARNED")
  const referrals = transactions.filter((t) => t.transaction_type === "REFERRAL_EARNED")

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "VISIT_CONSUMPTION_EARNED":
        return <Utensils className="h-5 w-5 text-primary" />
      case "REWARD_REDEMPTION_SPENT":
        return <Gift className="h-5 w-5 text-destructive" />
      case "CHALLENGE_COMPLETED_EARNED":
        return <Award className="h-5 w-5 text-amber-500" />
      case "REFERRAL_EARNED":
        return <Users className="h-5 w-5 text-indigo-500" />
      default:
        return <CreditCard className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTransactionColor = (type: string) => {
    if (type.includes("EARNED")) return "text-primary"
    if (type.includes("SPENT")) return "text-destructive"
    return "text-muted-foreground"
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Histórico</h1>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded"></div>
          <div className="h-40 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Histórico</h1>
      </div>

      <Tabs defaultValue="pontos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pontos">Pontos</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="pontos" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Histórico de Pontos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingData.transactions ? (
                <div className="divide-y divide-border">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 space-y-2">
                      <div className="h-5 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                <div className="divide-y divide-border">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-start p-4">
                      <div className="mr-3 mt-1">{getTransactionIcon(transaction.transaction_type)}</div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description || "Transação"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.transaction_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                          {transaction.points_change > 0 ? "+" : ""}
                          {transaction.points_change} pontos
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Nenhuma transação registrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Histórico de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingData.orders ? (
                <div className="divide-y divide-border">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 space-y-2">
                      <div className="h-5 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-start p-4">
                      <div className="mr-3 mt-1">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">Pedido #{order.order_number}</p>
                          <Badge
                            variant={
                              order.status === "DELIVERED"
                                ? "success"
                                : order.status === "PROCESSING"
                                  ? "warning"
                                  : order.status === "CANCELLED"
                                    ? "destructive"
                                    : "outline"
                            }
                            className="ml-2"
                          >
                            {order.status === "DELIVERED"
                              ? "Entregue"
                              : order.status === "PROCESSING"
                                ? "Em preparo"
                                : order.status === "CANCELLED"
                                  ? "Cancelado"
                                  : order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ {order.total_amount.toFixed(2).replace(".", ",")}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 mt-1"
                          onClick={() => router.push(`/pedidos/${order.id}`)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Nenhum pedido registrado.</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push("/cardapio")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Fazer um pedido
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservas" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Histórico de Reservas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingData.reservations ? (
                <div className="divide-y divide-border">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 space-y-2">
                      <div className="h-5 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reservations.length > 0 ? (
                <div className="divide-y divide-border">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-start p-4">
                      <div className="mr-3 mt-1">
                        {reservation.reservation_type === "TABLE" ? (
                          <Utensils className="h-5 w-5 text-primary" />
                        ) : (
                          <Calendar className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">
                            {reservation.reservation_type === "TABLE"
                              ? `Mesa para ${reservation.number_of_people} pessoas`
                              : reservation.title || "Reserva especial"}
                          </p>
                          <Badge
                            variant={
                              reservation.status === "CONFIRMED"
                                ? "success"
                                : reservation.status === "PENDING"
                                  ? "warning"
                                  : reservation.status === "CANCELLED"
                                    ? "destructive"
                                    : "outline"
                            }
                            className="ml-2"
                          >
                            {reservation.status === "CONFIRMED"
                              ? "Confirmada"
                              : reservation.status === "PENDING"
                                ? "Pendente"
                                : reservation.status === "CANCELLED"
                                  ? "Cancelada"
                                  : reservation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.reservation_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                          {reservation.reservation_time && ` às ${reservation.reservation_time}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => router.push(`/reservas/${reservation.id}`)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Nenhuma reserva registrada.</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push("/reservas-nova")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Fazer uma reserva
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
