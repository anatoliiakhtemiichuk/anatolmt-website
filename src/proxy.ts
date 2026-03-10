/**
 * Next.js Proxy (formerly Middleware)
 * Handles admin route protection with PIN-based cookie authentication
 *
 * Migrated from middleware.ts to proxy.ts for Next.js 16 compatibility
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';
const ADMIN_COOKIE_VALUE = 'authenticated';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for admin session cookie
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const isAuthenticated = sessionCookie?.value === ADMIN_COOKIE_VALUE;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If authenticated user visits login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const isAuthenticated = sessionCookie?.value === ADMIN_COOKIE_VALUE;

    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
