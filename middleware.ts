import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criar uma resposta que podemos modificar
  const res = NextResponse.next()

  // Adicionar headers para prevenir cache em todas as páginas da aplicação
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
  res.headers.set("Pragma", "no-cache")
  res.headers.set("Expires", "0")
  res.headers.set("Surrogate-Control", "no-store")

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Adicionar timestamp para cache-busting nas URLs de redirecionamento
  const timestamp = Date.now()

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!session && !req.nextUrl.pathname.startsWith("/login") && !req.nextUrl.pathname.startsWith("/esqueci-senha")) {
    const redirectUrl = new URL(`/login?t=${timestamp}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver autenticado e tentar acessar a página de login
  if (session && (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/")) {
    const redirectUrl = new URL(`/home?t=${timestamp}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
