import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_COOKIE = 'shopify_customer_token';
const EXPIRES_COOKIE = 'shopify_customer_token_expires';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRES_COOKIE)?.value;

  const isExpired =
    !expiresAt || new Date(expiresAt).getTime() <= Date.now();

  const isAuthenticated = !!token && !isExpired;

  // Protect /my-account/* routes
  if (pathname.startsWith('/my-account')) {
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      // Clear stale cookies
      response.cookies.delete(TOKEN_COOKIE);
      response.cookies.delete(EXPIRES_COOKIE);
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/my-account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-account/:path*', '/sign-in', '/sign-up'],
};
