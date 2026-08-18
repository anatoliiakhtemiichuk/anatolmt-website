/**
 * Admin Client Bookings API
 * GET /api/admin/clients/[email]/bookings - Get client's bookings
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getClientBookings } from '@/lib/admin-data';

interface RouteParams {
  params: Promise<{ email: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    const bookings = await getClientBookings(decodedEmail);

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania wizyt klienta' },
      { status: 500 }
    );
  }
}
