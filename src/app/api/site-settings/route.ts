/**
 * Public Site Settings API
 * GET /api/site-settings - Get site settings for public pages
 *
 * Returns settings needed for public pages (services, contact, texts, hours)
 */

import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';

export async function GET() {
  try {
    const settings = await getSiteSettings();

    // Return only what's needed for public pages
    // Filter to active services only
    const publicSettings = {
      services: settings.services.filter(s => s.isActive),
      openingHours: settings.openingHours,
      contact: settings.contact,
      texts: settings.texts,
    };

    return NextResponse.json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania ustawień' },
      { status: 500 }
    );
  }
}
