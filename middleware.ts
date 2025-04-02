import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // Allow API routes to pass through
  if (isApiRoute) {
    return NextResponse.next()
  }

  // If no token and not on login page, redirect to login
  if (!token && !isLoginPage) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('redirectMessage', 'Please login to access this page')
    return response
  }

  // If token exists and on login page, redirect to home
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