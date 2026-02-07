/**
 * Next.js Middleware
 * Handles admin route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Get the auth token from cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Get all Supabase auth cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    // Also check for the combined auth token cookie that Supabase uses
    const authCookieName = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
    const authCookie = request.cookies.get(authCookieName)?.value;

    // If no auth cookies, redirect to login
    if (!accessToken && !authCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: Full admin role verification is done in the layout component
    // because middleware cannot make async database calls reliably
    // The layout will redirect non-admins appropriately
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
