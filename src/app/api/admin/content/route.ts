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

    const pageTexts = await getPageTexts();

    return NextResponse.json({
      success: true,
      data: pageTexts,
      total: pageTexts.length,
    });
  } catch (error) {
    console.error('Error fetching page texts:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania tekstów' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.key) {
      return NextResponse.json(
        { success: false, error: 'Brakuje klucza tekstu' },
        { status: 400 }
      );
    }

    // Check if page text exists
    const existingText = await getPageText(body.key);
    if (!existingText) {
      return NextResponse.json(
        { success: false, error: 'Tekst o podanym kluczu nie istnieje' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updates: { title?: string; content?: string } = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Brak danych do aktualizacji' },
        { status: 400 }
      );
    }

    const updatedText = await updatePageText(body.key, updates);

    return NextResponse.json({
      success: true,
      data: updatedText,
    });
  } catch (error) {
    console.error('Error updating page text:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas aktualizacji tekstu' },
      { status: 500 }
    );
  }
}
