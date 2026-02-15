/**
 * Admin Single Video API
 * GET /api/admin/videos/[id] - Get a single video
 * PATCH /api/admin/videos/[id] - Update a video
 * DELETE /api/admin/videos/[id] - Delete a video
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getVideoById, updateVideo, deleteVideo } from '@/lib/admin-data';
import { BODY_PARTS } from '@/types/video';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const video = await getVideoById(id);

    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Film nie został znaleziony' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania filmu' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if video exists
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return NextResponse.json(
        { success: false, error: 'Film nie został znaleziony' },
        { status: 404 }
      );
    }

    // Validate bodyPart if provided
    if (body.bodyPart && !BODY_PARTS.includes(body.bodyPart)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowa część ciała' },
        { status: 400 }
      );
    }

    // Validate priceEur if provided
    if (body.priceEur !== undefined && (typeof body.priceEur !== 'number' || body.priceEur < 0)) {
      return NextResponse.json(
        { success: false, error: 'Cena musi być liczbą nieujemną' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    const allowedFields = [
      'title', 'description', 'bodyPart', 'durationMin',
      'priceEur', 'includedInPackage', 'videoUrl',
      'thumbnailUrl', 'isPublished'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const updatedVideo = await updateVideo(id, updates);

    return NextResponse.json({
      success: true,
      data: updatedVideo,
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas aktualizacji filmu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if video exists
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return NextResponse.json(
        { success: false, error: 'Film nie został znaleziony' },
        { status: 404 }
      );
    }

    await deleteVideo(id);

    return NextResponse.json({
      success: true,
      message: 'Film został usunięty',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas usuwania filmu' },
      { status: 500 }
    );
  }
}
