/**
 * Video Stripe Configuration
 * Payment configuration for "Wideo Pomoc" video products
 */

import Stripe from 'stripe';
import { VIDEO_PRICES, VIDEO_CURRENCY, ACCESS_DURATION_DAYS, ProductType } from '@/types/video';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  typescript: true,
});

// Product names and descriptions
export const VIDEO_PRODUCTS = {
  single: {
    name: 'Wideo Pomoc – Pojedynczy film',
    description: 'Dostęp do wybranego filmu edukacyjnego przez 30 dni',
  },
  standard: {
    name: 'Wideo Pomoc – Pakiet Standard',
    description: 'Dostęp do 10-12 wybranych filmów edukacyjnych przez 30 dni',
  },
  full: {
    name: 'Wideo Pomoc – Pakiet Pełny',
    description: 'Dostęp do wszystkich filmów edukacyjnych przez 30 dni',
  },
} as const;

// Payment methods for EUR
export const VIDEO_PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card',
  'p24', // Przelewy24 (includes BLIK)
];

/**
 * Generate a secure access token
 * Uses crypto.randomBytes for security
 */
export function generateAccessToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(64);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 64; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  return token;
}

/**
 * Calculate expiration date (30 days from now)
 */
export function calculateExpirationDate(): Date {
  const now = new Date();
  now.setDate(now.getDate() + ACCESS_DURATION_DAYS);
  return now;
}

/**
 * Create Stripe checkout session for video purchase
 */
export async function createVideoCheckoutSession(options: {
  productType: ProductType;
  videoSlug?: string;
  videoTitle?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const { productType, videoSlug, videoTitle, customerEmail, successUrl, cancelUrl } = options;

  const product = VIDEO_PRODUCTS[productType];
  const price = VIDEO_PRICES[productType];

  // Build line item name/description
  const itemName = productType === 'single' && videoTitle
    ? `${product.name}: ${videoTitle}`
    : product.name;

  // Metadata for webhook processing
  const metadata: Record<string, string> = {
    product_type: productType,
  };

  if (videoSlug) {
    metadata.video_slug = videoSlug;
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: VIDEO_PAYMENT_METHODS,
    line_items: [
      {
        price_data: {
          currency: VIDEO_CURRENCY,
          product_data: {
            name: itemName,
            description: product.description,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    locale: 'pl',
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  };

  // Add customer email if provided
  if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Retrieve Stripe checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Format price for display
 */
export function formatVideoPrice(priceInCents: number): string {
  return `${(priceInCents / 100).toFixed(0)}€`;
}

/**
 * Check if a purchase is expired
 */
export function isPurchaseExpired(expiresAt: string | Date): boolean {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expiration < new Date();
}

/**
 * Calculate days remaining for a purchase
 */
export function getDaysRemaining(expiresAt: string | Date): number {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
