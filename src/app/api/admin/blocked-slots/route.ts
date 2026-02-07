/**
 * Admin Blocked Slots API
 * GET /api/admin/blocked-slots - List blocked slots
 * POST /api/admin/blocked-slots - Create a blocked slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { BlockedSlot, CreateBlockedSlotRequest } from '@/types/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(request.url);

    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    let query = supabase
      .from('blocked_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('time_start', { ascending: true });

    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('date', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data as BlockedSlot[],
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
    const supabase = createAdminSupabaseClient();
    const body: CreateBlockedSlotRequest = await request.json();

    // Validate required fields
    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'Data jest wymagana' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: Partial<BlockedSlot> = {
      date: body.date,
      is_full_day: body.is_full_day ?? true,
      reason: body.reason || null,
    };

    // Add time fields if not full day
    if (!insertData.is_full_day) {
      if (!body.time_start || !body.time_end) {
        return NextResponse.json(
          { success: false, error: 'Godziny rozpoczęcia i zakończenia są wymagane' },
          { status: 400 }
        );
      }
      insertData.time_start = body.time_start;
      insertData.time_end = body.time_end;
    }

    const { data, error } = await supabase
      .from('blocked_slots')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data as BlockedSlot,
    });
  } catch (error) {
    console.error('Error creating blocked slot:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia blokady' },
      { status: 500 }
    );
  }
}
