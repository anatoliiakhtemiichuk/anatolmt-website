import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const aiSessionId = session.metadata?.ai_session_id;

      if (aiSessionId) {
        // Update session status to paid
        const { error } = await supabase
          .from('ai_sessions')
          .update({
            status: 'paid',
            stripe_payment_intent: session.payment_intent as string,
            client_email: session.customer_details?.email || null,
          })
          .eq('id', aiSessionId);

        if (error) {
          console.error('Failed to update session:', error);
        } else {
          console.log(`AI session ${aiSessionId} marked as paid`);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
