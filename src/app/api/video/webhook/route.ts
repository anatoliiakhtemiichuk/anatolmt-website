/**
 * Video Webhook API
 * POST /api/video/webhook
 *
 * Handles Stripe webhook events for video purchases
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
  verifyWebhookSignature,
  generateAccessToken,
  calculateExpirationDate,
} from '@/lib/video-stripe';
import { VIDEO_PRICES } from '@/types/video';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_VIDEO_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event | null;

  try {
    event = verifyWebhookSignature(body, signature, webhookSecret);
    if (!event) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Check if this is a video purchase (check metadata)
    const metadata = session.metadata || {};
    const productType = metadata.product_type;

    if (!productType || !['single', 'full'].includes(productType)) {
      // Not a video purchase, ignore
      return NextResponse.json({ received: true });
    }

    const supabase = createServerSupabaseClient();

    // Try to find existing purchase by session ID
    const { data: existingPurchase } = await supabase
      .from('video_purchases')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (existingPurchase) {
      // Update existing purchase to paid
      const { error: updateError } = await supabase
        .from('video_purchases')
        .update({
          status: 'paid',
          stripe_payment_intent: session.payment_intent as string,
          customer_email: session.customer_email || existingPurchase.customer_email,
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating purchase:', updateError);
        return NextResponse.json(
          { error: 'Failed to update purchase' },
          { status: 500 }
        );
      }
    } else {
      // Create new purchase record (fallback if checkout didn't create it)
      const accessToken = generateAccessToken();
      const expiresAt = calculateExpirationDate();

      // Get video ID if single purchase
      let videoId: string | null = null;
      if (productType === 'single' && metadata.video_slug) {
        const { data: videoData } = await supabase
          .from('videos')
          .select('id')
          .eq('slug', metadata.video_slug)
          .single();

        videoId = videoData?.id || null;
      }

      const { error: insertError } = await supabase.from('video_purchases').insert({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        product_type: productType,
        video_id: videoId,
        access_token: accessToken,
        customer_email: session.customer_email,
        amount_paid: VIDEO_PRICES[productType as 'single' | 'full'],
        currency: 'eur',
        status: 'paid',
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) {
        console.error('Error creating purchase:', insertError);
        return NextResponse.json(
          { error: 'Failed to create purchase' },
          { status: 500 }
        );
      }
    }

    console.log(`Video purchase completed: ${session.id}, type: ${productType}`);
  }

  // Handle payment failed
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;

    const supabase = createServerSupabaseClient();

    // Delete pending purchase if it exists
    await supabase
      .from('video_purchases')
      .delete()
      .eq('stripe_session_id', session.id)
      .eq('status', 'pending');
  }

  return NextResponse.json({ received: true });
}
