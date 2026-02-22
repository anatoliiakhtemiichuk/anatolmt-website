import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
