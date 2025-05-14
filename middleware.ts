import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes that require authentication
  const protectedRoutes = ["/home", "/perfil", "/desafios", "/reservas", "/recompensas"]

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/cadastro", "/esqueci-senha"]

  const url = req.nextUrl.clone()
  const { pathname } = url

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Handle offline fallback
  const isOffline = req.headers.get("x-offline") === "true"
  if (isOffline && pathname !== "/offline") {
    url.pathname = "/offline"
    return NextResponse.rewrite(url)
  }

  // Redirect logic
  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access protected route without session
    url.pathname = "/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  if (isPublicRoute && session) {
    // Redirect to home if trying to access public route with session
    url.pathname = "/home"
    return NextResponse.redirect(url)
  }

  // Special case for root path
  if (pathname === "/" && session) {
    url.pathname = "/home"
    return NextResponse.redirect(url)
  }

  if (pathname === "/" && !session) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image files)
     * - icons (public icon files)
     * - manifest.json (PWA manifest)
     * - service-worker.js (Service Worker)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|manifest.json|service-worker.js).*)",
  ],
}
