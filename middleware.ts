import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criar uma resposta que podemos modificar
  const res = NextResponse.next()

  // Adicionar headers para evitar cache de páginas autenticadas
  res.headers.set("Cache-Control", "no-store, max-age=0")
  res.headers.set("Pragma", "no-cache")
  res.headers.set("Expires", "0")

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!session && !req.nextUrl.pathname.startsWith("/login") && !req.nextUrl.pathname.startsWith("/esqueci-senha")) {
    // Adicionar timestamp para evitar cache
    const redirectUrl = new URL(`/login?t=${Date.now()}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver autenticado e tentar acessar a página de login
  if (session && (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/")) {
    // Adicionar timestamp para evitar cache
    const redirectUrl = new URL(`/home?t=${Date.now()}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
