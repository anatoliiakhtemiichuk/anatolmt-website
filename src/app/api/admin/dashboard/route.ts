/**
 * Admin Dashboard API
 * GET /api/admin/dashboard - Get dashboard stats
 */

import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/admin-data';

export async function GET() {
  try {
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
