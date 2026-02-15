/**
 * Admin Settings API
 * GET /api/admin/settings - Get clinic settings
 * PUT /api/admin/settings - Update clinic settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/admin-data';

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updated = await updateSettings(body);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas aktualizacji ustawień' },
      { status: 500 }
    );
  }
}
