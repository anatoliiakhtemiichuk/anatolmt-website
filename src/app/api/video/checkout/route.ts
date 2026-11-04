/**
 * Video Checkout API
 * POST /api/video/checkout
 *
 * Creates a Stripe checkout session for video purchases
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
  createVideoCheckoutSession,
  generateAccessToken,
  calculateExpirationDate,
  isVideoStripeConfigured,
} from '@/lib/video-stripe';
import { getVideoBySlug } from '@/data/videos';
import { VIDEO_PRICES, ProductType } from '@/types/video';
import { getSiteUrl } from '@/lib/config';

interface ConsentData {
  terms_accepted: boolean;
  terms_accepted_at: string;
  withdrawal_accepted: boolean;
  withdrawal_accepted_at: string;
}

interface CheckoutRequestBody {
  product_type: ProductType;
  video_slug?: string;
  customer_email?: string;
  consents?: ConsentData;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isVideoStripeConfigured()) {
      return NextResponse.json(
        { error: 'Płatności są tymczasowo niedostępne' },
        { status: 503 }
      );
    }

    const body: CheckoutRequestBody = await request.json();
    const { product_type, video_slug, customer_email, consents } = body;

    // Validate consents are provided
    if (!consents?.terms_accepted || !consents?.withdrawal_accepted) {
      return NextResponse.json(
        { error: 'Wymagana jest akceptacja regulaminu i zgoda na dostarczenie treści' },
        { status: 400 }
      );
    }

    // Validate product type
    if (!product_type || !['single', 'standard', 'full'].includes(product_type)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy typ produktu' },
        { status: 400 }
      );
    }

    // For single video purchase, validate video exists
    let videoTitle: string | undefined;
    let videoId: string | undefined;

    if (product_type === 'single') {
      if (!video_slug) {
        return NextResponse.json(
          { error: 'Brak identyfikatora filmu' },
          { status: 400 }
        );
      }

      const video = getVideoBySlug(video_slug);
      if (!video) {
        return NextResponse.json(
          { error: 'Film nie istnieje' },
          { status: 404 }
        );
      }

      videoTitle = video.title;
      videoId = video.id;
    }

    // Generate access token and expiration
    const accessToken = generateAccessToken();
    const expiresAt = calculateExpirationDate();

    // Get base URL
    const baseUrl = getSiteUrl();

    // Create Stripe checkout session with consent metadata
    const session = await createVideoCheckoutSession({
      productType: product_type,
      videoSlug: video_slug,
      videoTitle,
      customerEmail: customer_email,
      successUrl: `${baseUrl}/video-pomoc/success?token=${accessToken}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/video-pomoc${video_slug ? `/${video_slug}` : ''}?canceled=true`,
      metadata: {
        terms_accepted: 'true',
        terms_accepted_at: consents.terms_accepted_at,
        withdrawal_accepted: 'true',
        withdrawal_accepted_at: consents.withdrawal_accepted_at,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Nie udało się utworzyć sesji płatności' },
        { status: 500 }
      );
    }

    // Create pending purchase record in database
    const supabase = createServerSupabaseClient();

    // First, get video ID from database if it's a single purchase
    let dbVideoId: string | null = null;
    if (product_type === 'single' && video_slug) {
      const { data: videoData } = await supabase
        .from('videos')
        .select('id')
        .eq('slug', video_slug)
        .single();

      dbVideoId = videoData?.id || null;
    }

    const { error: insertError } = await supabase.from('video_purchases').insert({
      stripe_session_id: session.id,
      product_type,
      video_id: dbVideoId,
      access_token: accessToken,
      customer_email: customer_email || null,
      amount_paid: VIDEO_PRICES[product_type],
      currency: 'eur',
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Continue anyway - webhook will handle this
    }

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia płatności' },
      { status: 500 }
    );
  }
}
