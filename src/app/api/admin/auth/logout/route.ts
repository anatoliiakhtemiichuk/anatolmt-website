/**
 * Admin Logout API Route
 * POST /api/admin/auth/logout
 */

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Wylogowano pomyślnie' },
    { status: 200 }
  );

  // Clear the admin session cookie
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}
