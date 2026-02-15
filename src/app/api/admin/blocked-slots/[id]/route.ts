/**
 * Admin Blocked Slot by ID API
 * DELETE /api/admin/blocked-slots/[id] - Delete blocked slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteBlockedSlot } from '@/lib/admin-data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteBlockedSlot(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Blokada nie istnieje' },
        { status: 404 }
      );
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
