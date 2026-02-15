/**
 * Admin Blocked Slots API
 * GET /api/admin/blocked-slots - List blocked slots
 * POST /api/admin/blocked-slots - Create a blocked slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlockedSlots, createBlockedSlot } from '@/lib/admin-data';
import { CreateBlockedSlotRequest } from '@/types/admin';

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
    console.error('Error fetching blocked slots:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania zablokowanych terminów' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBlockedSlotRequest = await request.json();

    // Validate required fields
    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'Data jest wymagana' },
        { status: 400 }
      );
    }

    const isFullDay = body.is_full_day ?? !body.time_start;

    // Validate time fields if not full day
    if (!isFullDay && (!body.time_start || !body.time_end)) {
      return NextResponse.json(
        { success: false, error: 'Godziny rozpoczęcia i zakończenia są wymagane' },
        { status: 400 }
      );
    }

    const slot = await createBlockedSlot({
      date: body.date,
      time_start: isFullDay ? null : body.time_start,
      time_end: isFullDay ? null : body.time_end,
      is_full_day: isFullDay,
      reason: body.reason || null,
    });

    return NextResponse.json({
      success: true,
      data: slot,
    });
  } catch (error) {
    console.error('Error creating blocked slot:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia blokady' },
      { status: 500 }
    );
  }
}
