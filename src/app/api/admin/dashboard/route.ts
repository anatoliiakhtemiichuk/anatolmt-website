/**
 * Admin Dashboard API
 * GET /api/admin/dashboard - Get dashboard stats
 */

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getDashboardStats } from '@/lib/admin-data';

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

    const data = await getDashboardStats();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania statystyk' },
      { status: 500 }
    );
  }
}
