import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// AI Consultation product details
export const AI_CONSULTATION_PRICE = 1000; // 10.00 PLN in grosze (cents)
export const AI_CONSULTATION_CURRENCY = 'pln';
export const AI_CONSULTATION_NAME = 'AI Konsultacja Wstępna';
export const AI_CONSULTATION_DESCRIPTION = 'Jednorazowa konsultacja z asystentem AI (informacyjna, bez diagnozy medycznej)';
