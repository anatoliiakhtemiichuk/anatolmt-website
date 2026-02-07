/**
 * Video Validate API
 * POST /api/video/validate
 *
 * Validates access token and returns purchase info + videos
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { isPurchaseExpired, getDaysRemaining } from '@/lib/video-stripe';
import { ValidateTokenResponse, Video } from '@/types/video';
import { VIDEOS, getAllActiveVideos, getVideoBySlug } from '@/data/videos';

interface ValidateRequestBody {
  token?: string;
  session_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequestBody = await request.json();
    const { token, session_id } = body;

    if (!token && !session_id) {
      return NextResponse.json<ValidateTokenResponse>({
        valid: false,
        error: 'Brak tokenu dostępu',
      });
    }

    const supabase = createServerSupabaseClient();

    // Find purchase by token or session_id
    let query = supabase
      .from('video_purchases')
      .select('*');

    if (token) {
      query = query.eq('access_token', token);
    } else if (session_id) {
      query = query.eq('stripe_session_id', session_id);
    }

    const { data: purchase, error } = await query.single();

    if (error || !purchase) {
      return NextResponse.json<ValidateTokenResponse>({
        valid: false,
        error: 'Nie znaleziono zakupu',
      });
    }

    // Check if purchase is paid
    if (purchase.status !== 'paid') {
      return NextResponse.json<ValidateTokenResponse>({
        valid: false,
        error: 'Płatność nie została zrealizowana',
      });
    }

    // Check if expired
    if (isPurchaseExpired(purchase.expires_at)) {
      // Update status to expired
      await supabase
        .from('video_purchases')
        .update({ status: 'expired' })
        .eq('id', purchase.id);

      return NextResponse.json<ValidateTokenResponse>({
        valid: false,
        error: 'Dostęp wygasł. Możesz zakupić nowy dostęp.',
      });
    }

    // Update access count and first access time
    const updateData: Record<string, unknown> = {
      access_count: (purchase.access_count || 0) + 1,
    };

    if (!purchase.accessed_at) {
      updateData.accessed_at = new Date().toISOString();
    }

    await supabase
      .from('video_purchases')
      .update(updateData)
      .eq('id', purchase.id);

    // Get videos based on purchase type
    let videos: Video[] = [];

    if (purchase.product_type === 'full') {
      // Full package - return all active videos
      // First try to get from database
      const { data: dbVideos } = await supabase
        .from('videos')
        .select('*')
        .eq('active', true)
        .order('category')
        .order('sort_order');

      if (dbVideos && dbVideos.length > 0) {
        videos = dbVideos as Video[];
      } else {
        // Fallback to static data
        videos = getAllActiveVideos();
      }
    } else if (purchase.product_type === 'standard') {
      // Standard package - return 10-12 selected videos (2 per category)
      // First try to get from database
      const { data: dbVideos } = await supabase
        .from('videos')
        .select('*')
        .eq('active', true)
        .order('category')
        .order('sort_order');

      if (dbVideos && dbVideos.length > 0) {
        // Group by category and take first 2 from each
        const videosByCategory = new Map<string, Video[]>();
        for (const video of dbVideos as Video[]) {
          const categoryVideos = videosByCategory.get(video.category) || [];
          if (categoryVideos.length < 2) {
            categoryVideos.push(video);
            videosByCategory.set(video.category, categoryVideos);
          }
        }
        videos = Array.from(videosByCategory.values()).flat();
      } else {
        // Fallback to static data - get 2 videos per category
        const allVideos = getAllActiveVideos();
        const videosByCategory = new Map<string, Video[]>();
        for (const video of allVideos) {
          const categoryVideos = videosByCategory.get(video.category) || [];
          if (categoryVideos.length < 2) {
            categoryVideos.push(video);
            videosByCategory.set(video.category, categoryVideos);
          }
        }
        videos = Array.from(videosByCategory.values()).flat();
      }
    } else {
      // Single video purchase
      if (purchase.video_id) {
        // Try to get from database
        const { data: dbVideo } = await supabase
          .from('videos')
          .select('*')
          .eq('id', purchase.video_id)
          .single();

        if (dbVideo) {
          videos = [dbVideo as Video];
        }
      }

      // Fallback: try to find video by slug from metadata if available
      if (videos.length === 0) {
        // Use static data as fallback
        const allVideos = getAllActiveVideos();
        // If we have a video_id but couldn't find in DB, try static
        if (purchase.video_id) {
          const staticVideo = allVideos.find(v => v.id === purchase.video_id);
          if (staticVideo) {
            videos = [staticVideo];
          }
        }
      }
    }

    const response: ValidateTokenResponse = {
      valid: true,
      purchase: {
        product_type: purchase.product_type,
        video_id: purchase.video_id,
        expires_at: purchase.expires_at,
        days_remaining: getDaysRemaining(purchase.expires_at),
      },
      videos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Validate error:', error);
    return NextResponse.json<ValidateTokenResponse>({
      valid: false,
      error: 'Wystąpił błąd podczas weryfikacji',
    });
  }
}
