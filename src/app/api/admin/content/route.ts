/**
 * Admin Content API
 * GET /api/admin/content - List all page texts
 * PATCH /api/admin/content - Update a page text by key
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getPageTexts, getPageText, updatePageText } from '@/lib/admin-data';

export async function GET() {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    console.log('[admin/content] GET - Fetching page texts');
    const pageTexts = await getPageTexts();
    console.log('[admin/content] GET - Found', pageTexts.length, 'texts');

    return NextResponse.json({
      success: true,
      data: pageTexts,
      total: pageTexts.length,
    });
  } catch (error) {
    console.error('[admin/content] GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania tekstów' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    body = await request.json();

    // Validate required fields
    if (!body.key) {
      return NextResponse.json(
        { success: false, error: 'Brakuje klucza tekstu' },
        { status: 400 }
      );
    }

    // Check if page text exists
    const existingText = await getPageText(body.key as string);
    if (!existingText) {
      return NextResponse.json(
        { success: false, error: 'Tekst o podanym kluczu nie istnieje' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updates: { title?: string; content?: string } = {};
    if (body.title !== undefined) updates.title = body.title as string;
    if (body.content !== undefined) updates.content = body.content as string;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Brak danych do aktualizacji' },
        { status: 400 }
      );
    }

    console.log('[admin/content] PATCH - Updating:', { key: body.key, updates: { ...updates, content: updates.content?.slice(0, 50) } });

    const updatedText = await updatePageText(body.key as string, updates);

    console.log('[admin/content] PATCH - Success:', { key: body.key });

    return NextResponse.json({
      success: true,
      data: updatedText,
    });
  } catch (error: unknown) {
    // Extract error details for better debugging
    const err = error as Record<string, unknown>;
    const errorMessage =
      (err?.message as string) ||
      (error instanceof Error ? error.message : null) ||
      'Nieznany błąd';
    const errorCode = (err?.code as string) || null;

    console.error('[admin/content] Update failed:', {
      key: body?.key,
      message: errorMessage,
      code: errorCode,
      details: err?.details,
      hint: err?.hint,
    });

    // Provide user-friendly error messages
    let userMessage = 'Wystąpił błąd podczas aktualizacji tekstu';
    if (errorCode === '42501') {
      userMessage = 'Brak uprawnień do zapisu. Uruchom migrację 011_fix_page_texts_rls.sql w Supabase.';
    } else if (errorCode === '23505') {
      userMessage = 'Tekst o tym kluczu już istnieje.';
    } else if (errorCode === 'PGRST301') {
      userMessage = 'Tabela page_texts nie istnieje. Uruchom migrację 007_create_page_texts.sql w Supabase.';
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
