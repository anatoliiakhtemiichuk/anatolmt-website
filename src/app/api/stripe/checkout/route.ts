import { NextResponse } from 'next/server';
import {
  stripe,
  AI_CONSULTATION_PRICE,
  AI_CONSULTATION_CURRENCY,
  AI_CONSULTATION_NAME,
  AI_CONSULTATION_DESCRIPTION,
} from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:1000';
    const supabase = createServerSupabaseClient();

    // Create a new AI session in database (unpaid)
    const { data: session, error: dbError } = await supabase
      .from('ai_sessions')
      .insert({
        status: 'unpaid',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select()
      .single();

    if (dbError || !session) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Nie udało się utworzyć sesji.' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [
        {
          price_data: {
            currency: AI_CONSULTATION_CURRENCY,
            product_data: {
              name: AI_CONSULTATION_NAME,
              description: AI_CONSULTATION_DESCRIPTION,
            },
            unit_amount: AI_CONSULTATION_PRICE,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/ai/success?session_id=${session.id}`,
      cancel_url: `${siteUrl}/ai?canceled=true`,
      metadata: {
        ai_session_id: session.id,
      },
      locale: 'pl',
    });

    // Update session with Stripe session ID
    await supabase
      .from('ai_sessions')
      .update({ stripe_session_id: checkoutSession.id })
      .eq('id', session.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia płatności.' },
      { status: 500 }
    );
  }
}
