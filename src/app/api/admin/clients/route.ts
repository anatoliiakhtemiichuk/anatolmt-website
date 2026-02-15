/**
 * Admin Clients API
 * GET /api/admin/clients - Get all clients with stats
 */

import { NextResponse } from 'next/server';
import { getClients } from '@/lib/admin-data';

export async function GET() {
  try {
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
