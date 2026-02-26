/**
 * Admin Blocked Slot by ID API
 * DELETE /api/admin/blocked-slots/[id] - Delete blocked slot
 *
 * SECURITY: Uses server-side Supabase client with SERVICE_ROLE_KEY
 * which bypasses RLS. Frontend cannot delete directly from blocked_slots table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteBlockedSlot } from '@/lib/admin-data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format ID' },
        { status: 400 }
      );
    }

    console.log('[admin/blocked-slots] Deleting blocked slot:', { id });

    const deleted = await deleteBlockedSlot(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Blokada nie istnieje' },
        { status: 404 }
      );
    }

    console.log('[admin/blocked-slots] Deleted successfully:', { id });

    return NextResponse.json({
      success: true,
      message: 'Blokada została usunięta',
    });
  } catch (error: unknown) {
    const err = error as Record<string, unknown>;
    const errorMessage =
      (err?.message as string) ||
      (error instanceof Error ? error.message : null) ||
      'Nieznany błąd';
    const errorCode = (err?.code as string) || null;

    console.error('[admin/blocked-slots] Delete failed:', {
      message: errorMessage,
      code: errorCode,
      details: err?.details,
    });

    // Provide user-friendly error messages
    let userMessage = errorMessage;
    if (errorCode === '42501') {
      userMessage = 'Brak uprawnień do usunięcia. Uruchom migrację 009_fix_blocked_slots_rls.sql w Supabase.';
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
