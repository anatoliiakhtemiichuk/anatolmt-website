/**
 * Admin Authentication Library
 * Simple PIN-based authentication with cookie session
 */

import { cookies } from 'next/headers';

// Cookie configuration
export const ADMIN_COOKIE_NAME = 'admin_session';
export const ADMIN_COOKIE_VALUE = 'authenticated';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

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
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return sessionCookie?.value === ADMIN_COOKIE_VALUE;
}

/**
 * Get cookie options for setting admin session
 */
export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
}
