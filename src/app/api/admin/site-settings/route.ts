/**
 * Admin Site Settings API
 * GET /api/admin/site-settings - Get all site settings
 * PUT /api/admin/site-settings - Update site settings
 *
 * Protected by admin auth middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';
import { validateSiteSettings, SiteSettings } from '@/types/site-settings';

export async function GET() {
  try {
    const settings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania ustawień' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming settings
    const validation = validateSiteSettings(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nieprawidłowe dane ustawień',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Ensure consultation always has specific settings
    const settings = body as SiteSettings;
    const consultationService = settings.services.find(s => s.id === 'consultation');
    if (consultationService) {
      // Force consultation to have correct settings
      consultationService.durationMinutes = 20;
      consultationService.showDuration = false;
      consultationService.priceWeekend = null;
    }

    // Save the settings
    const updated = await saveSiteSettings(settings);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas zapisywania ustawień' },
      { status: 500 }
    );
  }
}
