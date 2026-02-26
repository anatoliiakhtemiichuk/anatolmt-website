/**
 * Admin Blocked Slots API
 * GET /api/admin/blocked-slots - List blocked slots
 * POST /api/admin/blocked-slots - Create a blocked slot
 *
 * SECURITY: All writes use server-side Supabase client with SERVICE_ROLE_KEY
 * which bypasses RLS. Frontend cannot write directly to blocked_slots table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlockedSlots, createBlockedSlot } from '@/lib/admin-data';
import { CreateBlockedSlotRequest } from '@/types/admin';

/**
 * Validate ISO date format (YYYY-MM-DD)
 */
function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Validate time format (HH:MM)
 */
function isValidTimeFormat(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

/**
 * Compare two times (returns true if start < end)
 */
function isStartBeforeEnd(start: string, end: string): boolean {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  return startH * 60 + startM < endH * 60 + endM;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const dateFrom = searchParams.get('date_from') || undefined;
    const dateTo = searchParams.get('date_to') || undefined;

    const slots = await getBlockedSlots(dateFrom, dateTo);

    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('[admin/blocked-slots] GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania zablokowanych terminów' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBlockedSlotRequest = await request.json();

    // ===========================================
    // Validation
    // ===========================================

    // Validate date is provided
    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'Data jest wymagana' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidDateFormat(body.date)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format daty. Użyj YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    const isFullDay = body.is_full_day ?? !body.time_start;

    // Validate time fields if not full day
    if (!isFullDay) {
      if (!body.time_start || !body.time_end) {
        return NextResponse.json(
          { success: false, error: 'Godziny rozpoczęcia i zakończenia są wymagane' },
          { status: 400 }
        );
      }

      // Validate time formats (HH:MM)
      if (!isValidTimeFormat(body.time_start) || !isValidTimeFormat(body.time_end)) {
        return NextResponse.json(
          { success: false, error: 'Nieprawidłowy format godziny. Użyj HH:MM.' },
          { status: 400 }
        );
      }

      // Validate start < end
      if (!isStartBeforeEnd(body.time_start, body.time_end)) {
        return NextResponse.json(
          { success: false, error: 'Godzina rozpoczęcia musi być wcześniejsza niż zakończenia' },
          { status: 400 }
        );
      }
    }

    // ===========================================
    // Create blocked slot (uses service role key)
    // ===========================================
    console.log('[admin/blocked-slots] Creating blocked slot:', {
      date: body.date,
      is_full_day: isFullDay,
      time_start: body.time_start,
      time_end: body.time_end,
      reason: body.reason,
    });

    const slot = await createBlockedSlot({
      date: body.date,
      time_start: isFullDay ? null : body.time_start,
      time_end: isFullDay ? null : body.time_end,
      is_full_day: isFullDay,
      reason: body.reason || null,
    });

    console.log('[admin/blocked-slots] Created successfully:', { id: slot.id });

    return NextResponse.json({
      success: true,
      data: slot,
    });
  } catch (error: unknown) {
    // Extract error details for better debugging
    const err = error as Record<string, unknown>;
    const errorMessage =
      (err?.message as string) ||
      (error instanceof Error ? error.message : null) ||
      'Nieznany błąd';
    const errorCode = (err?.code as string) || null;

    // Handle overlap conflict (23P01) as business logic, not system error
    if (errorCode === '23P01') {
      console.warn('[admin/blocked-slots] Overlap conflict (expected business case):', {
        code: errorCode,
        date: (await request.clone().json().catch(() => ({}))).date,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Ten termin nakłada się z istniejącą blokadą lub dzień jest już zablokowany w całości.',
          code: errorCode,
          isConflict: true,
        },
        { status: 409 }
      );
    }

    // Handle duplicate key (23505) as conflict
    if (errorCode === '23505') {
      console.warn('[admin/blocked-slots] Duplicate slot:', { code: errorCode });

      return NextResponse.json(
        {
          success: false,
          error: 'Taka blokada już istnieje.',
          code: errorCode,
          isConflict: true,
        },
        { status: 409 }
      );
    }

    // Log actual errors
    console.error('[admin/blocked-slots] Create failed:', {
      message: errorMessage,
      code: errorCode,
      details: err?.details,
      hint: err?.hint,
    });

    // Provide user-friendly error messages for system errors
    let userMessage = 'Wystąpił błąd podczas tworzenia blokady.';
    if (errorCode === '42501') {
      userMessage = 'Brak uprawnień do zapisu. Uruchom migrację 009_fix_blocked_slots_rls.sql w Supabase.';
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}
