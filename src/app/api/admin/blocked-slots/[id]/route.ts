/**
 * Admin Blocked Slot by ID API
 * DELETE /api/admin/blocked-slots/[id] - Delete blocked slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createAdminSupabaseClient();

    const { error } = await supabase
      .from('blocked_slots')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Blokada została usunięta',
    });
  } catch (error) {
    console.error('Error deleting blocked slot:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas usuwania blokady' },
      { status: 500 }
    );
  }
}
