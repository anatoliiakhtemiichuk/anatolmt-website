/**
 * Admin Clients API
 * GET /api/admin/clients - Get all clients with stats
 */

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getClients } from '@/lib/admin-data';

export async function GET() {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const clients = await getClients();

    return NextResponse.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania klientów' },
      { status: 500 }
    );
  }
}
