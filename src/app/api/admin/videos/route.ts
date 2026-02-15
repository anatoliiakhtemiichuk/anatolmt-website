/**
 * Admin Videos API
 * GET /api/admin/videos - List all videos with optional filters
 * POST /api/admin/videos - Create a new video
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getVideos, createVideo } from '@/lib/admin-data';
import { VideoFilters, BODY_PARTS } from '@/types/video';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse filters
    const filters: VideoFilters = {};

    const bodyPart = searchParams.get('bodyPart');
    const search = searchParams.get('search');
    const isPublished = searchParams.get('isPublished');

    if (bodyPart && BODY_PARTS.includes(bodyPart as typeof BODY_PARTS[number])) {
      filters.bodyPart = bodyPart;
    }
    if (search) filters.search = search;
    if (isPublished !== null && isPublished !== '') {
      filters.isPublished = isPublished === 'true';
    }

    const videos = await getVideos(filters);

    return NextResponse.json({
      success: true,
      data: videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania filmów' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const requiredFields = ['title', 'description', 'bodyPart', 'priceEur', 'videoUrl'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { success: false, error: `Brakuje wymaganego pola: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate bodyPart
    if (!BODY_PARTS.includes(body.bodyPart)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowa część ciała' },
        { status: 400 }
      );
    }

    // Validate priceEur
    if (typeof body.priceEur !== 'number' || body.priceEur < 0) {
      return NextResponse.json(
        { success: false, error: 'Cena musi być liczbą nieujemną' },
        { status: 400 }
      );
    }

    const video = await createVideo({
      title: body.title,
      description: body.description,
      bodyPart: body.bodyPart,
      durationMin: body.durationMin || undefined,
      priceEur: body.priceEur,
      includedInPackage: body.includedInPackage ?? false,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || undefined,
      isPublished: body.isPublished ?? false,
    });

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia filmu' },
      { status: 500 }
    );
  }
}
