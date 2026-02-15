/**
 * Admin Client Bookings API
 * GET /api/admin/clients/[email]/bookings - Get client's bookings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientBookings } from '@/lib/admin-data';

interface RouteParams {
  params: Promise<{ email: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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
