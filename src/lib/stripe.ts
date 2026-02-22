import Stripe from 'stripe';

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!(key && !key.includes('placeholder'));
}

// Lazy-loaded Stripe client
let _stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) {
    return null;
  }
  if (!_stripeClient) {
    _stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripeClient;
}

// For backwards compatibility - use getStripeClient() instead
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const client = getStripeClient();
    if (!client) {
      console.warn('Stripe is not configured');
      return undefined;
    }
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
