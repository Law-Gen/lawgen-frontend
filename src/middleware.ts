import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Allow access to public pages
    const publicPages = [
      '/',
      '/auth/signin',
      '/auth/signup',
      '/auth/forgot-password',
      '/categories',
      '/chat/guest',
    ]

    if (publicPages.some(page => pathname.startsWith(page))) {
      return NextResponse.next()
    }

    // Redirect to signin if not authenticated
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  }
)

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