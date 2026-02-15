/**
 * Public Videos API
 * GET /api/videos - List published videos with optional filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideos, getPageTexts } from '@/lib/admin-data';
import { VideoFilters, BODY_PARTS } from '@/types/video';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const filters: VideoFilters = {
      isPublished: true, // Only return published videos
    };

    const bodyPart = searchParams.get('bodyPart');
    const search = searchParams.get('search');

    if (bodyPart && BODY_PARTS.includes(bodyPart as typeof BODY_PARTS[number])) {
      filters.bodyPart = bodyPart;
    }
    if (search) filters.search = search;

    const videos = await getVideos(filters);
    const pageTexts = await getPageTexts();

    // Group videos by body part for category counts
    const bodyCounts: Record<string, number> = {};
    const allPublishedVideos = await getVideos({ isPublished: true });

    for (const video of allPublishedVideos) {
      bodyCounts[video.bodyPart] = (bodyCounts[video.bodyPart] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      data: {
        videos,
        pageTexts,
        bodyCounts,
        totalCount: allPublishedVideos.length,
      },
    });
  } catch (error) {
    console.error('Error fetching public videos:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania filmów' },
      { status: 500 }
    );
  }
}
