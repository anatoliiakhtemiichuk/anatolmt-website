/**
 * Admin Site Settings API
 * GET /api/admin/site-settings - Get all site settings
 * PUT /api/admin/site-settings - Update site settings
 *
 * Protected by admin auth middleware
 *
 * Storage: Uses Supabase in production (Vercel filesystem is read-only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';
import { validateSiteSettings, SiteSettings, DAY_ORDER, OpeningHoursMap } from '@/types/site-settings';

/**
 * Validate opening hours format (HH:MM) and logic (open < close)
 */
function validateOpeningHours(hours: OpeningHoursMap): string[] {
  const errors: string[] = [];
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  for (const day of DAY_ORDER) {
    const dayHours = hours[day];
    if (!dayHours) continue;

    if (!dayHours.closed) {
      // Validate time format
      if (!timeRegex.test(dayHours.open)) {
        errors.push(`Nieprawidłowy format godziny otwarcia dla ${day}: ${dayHours.open}`);
      }
      if (!timeRegex.test(dayHours.close)) {
        errors.push(`Nieprawidłowy format godziny zamknięcia dla ${day}: ${dayHours.close}`);
      }

      // Validate that open < close
      if (timeRegex.test(dayHours.open) && timeRegex.test(dayHours.close)) {
        if (dayHours.open >= dayHours.close) {
          errors.push(`Godzina otwarcia musi być wcześniejsza niż zamknięcia dla ${day}`);
        }
      }
    }
  }

  return errors;
}

export async function GET() {
  try {
    const settings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    console.error('Error fetching site settings:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: 'Wystąpił błąd podczas pobierania ustawień',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Diagnostic logging for Supabase env vars (temporary)
  console.log('[site-settings] Environment check:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlStartsWithHttp: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
  });

  try {
    const body = await request.json();

    // Validate the incoming settings
    const validation = validateSiteSettings(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nieprawidłowe dane ustawień',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const settings = body as SiteSettings;

    // Additional validation for opening hours
    const hoursErrors = validateOpeningHours(settings.openingHours);
    if (hoursErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nieprawidłowe godziny otwarcia',
          details: hoursErrors,
        },
        { status: 400 }
      );
    }

    // Ensure consultation always has specific settings
    const consultationService = settings.services.find((s) => s.id === 'consultation');
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
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    console.error('Error updating site settings:', errorMessage);

    // Determine if this is a configuration error vs runtime error
    const isConfigError =
      errorMessage.includes('Supabase') ||
      errorMessage.includes('skonfigurowany') ||
      errorMessage.includes('zmienne');

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        isConfigError,
      },
      { status: isConfigError ? 503 : 500 }
    );
  }
}
