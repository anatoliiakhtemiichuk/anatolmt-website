/**
 * Admin Authentication Library
 * Simple PIN-based authentication with cookie session
 */

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Cookie configuration
export const ADMIN_COOKIE_NAME = 'admin_session';
export const ADMIN_COOKIE_VALUE = 'authenticated';
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds (was 7 days)

/**
 * Verify if the provided PIN matches the admin PIN
 */
export function verifyAdminPin(pin: string): boolean {
  const adminPin = process.env.ADMIN_PIN;

  if (!adminPin) {
    console.error('ADMIN_PIN not configured in environment variables');
    return false;
  }

  return pin === adminPin;
}

/**
 * Check if the admin session cookie exists and is valid (server-side)
 * For use in Server Components and API routes
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return sessionCookie?.value === ADMIN_COOKIE_VALUE;
}

/**
 * Check if the admin session cookie exists and is valid from a request
 * For use in middleware where we can't use the cookies() function
 */
export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  return sessionCookie?.value === ADMIN_COOKIE_VALUE;
}

/**
 * Get cookie options for setting admin session
 * - httpOnly: prevents JavaScript access (XSS protection)
 * - secure: only sent over HTTPS in production
 * - sameSite: strict prevents CSRF attacks
 * - maxAge: 24 hours session duration
 */
export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // Changed from 'lax' to 'strict' for better CSRF protection
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
}
