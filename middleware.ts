import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // O middleware sempre precisa de uma nova instância do cliente
  // pois executa em um contexto isolado
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Rotas públicas que não requerem autenticação
    const publicRoutes = ["/login", "/esqueci-senha"]
    const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Arquivos estáticos e rotas de API devem ser acessíveis
    const isStaticOrApi =
      req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/api") ||
      req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)

    // Se estiver acessando uma rota protegida sem sessão
    if (!session && !isPublicRoute && !isStaticOrApi && req.nextUrl.pathname !== "/") {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Se estiver acessando a página de login com uma sessão ativa
    if (session && (isPublicRoute || req.nextUrl.pathname === "/")) {
      const redirectUrl = new URL("/home", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // Em caso de erro, permitir que a requisição continue
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
