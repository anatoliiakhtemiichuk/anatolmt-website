/**
 * Admin Login API Route
 * POST /api/admin/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPin, ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, getAdminCookieOptions } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'PIN jest wymagany' },
        { status: 400 }
      );
    }

    // Verify PIN
    const isValid = verifyAdminPin(pin);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy PIN' },
        { status: 401 }
      );
    }

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, message: 'Zalogowano pomyślnie' },
      { status: 200 }
    );

    // Set the admin session cookie
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, getAdminCookieOptions());

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
