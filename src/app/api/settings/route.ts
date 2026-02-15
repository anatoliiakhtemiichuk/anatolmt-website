/**
 * Public Settings API
 * GET /api/settings - Get public clinic settings (for booking page)
 */

import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/admin-data';

export async function GET() {
  try {
    const settings = await getSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania ustawień' },
      { status: 500 }
    );
  }
}
