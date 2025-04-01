import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Si no hay token y no estamos en la página de login, redirigir al login
  if (!token && !isLoginPage) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('redirectMessage', 'Por favor inicia sesión para acceder a esta página')
    return response
  }

  // Si hay token y estamos en la página de login, redirigir al inicio
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 