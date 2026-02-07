/**
 * Video System Types
 * Types for the "Wideo Pomoc" educational video feature
 */

// ============================================
// VIDEO TYPES
// ============================================

export interface Video {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  when_to_do: string | null;
  when_not_to_do: string | null;
  embed_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

// ============================================
// PURCHASE TYPES
// ============================================

export type ProductType = 'single' | 'standard' | 'full';
export type PurchaseStatus = 'pending' | 'paid' | 'expired' | 'refunded';

export interface VideoPurchase {
  id: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  product_type: ProductType;
  video_id: string | null;
  access_token: string;
  customer_email: string | null;
  amount_paid: number;
  currency: string;
  status: PurchaseStatus;
  expires_at: string;
  accessed_at: string | null;
  access_count: number;
  created_at: string;
  updated_at: string;
}

// Extended purchase with video details
export interface VideoPurchaseWithVideo extends VideoPurchase {
  video?: Video | null;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CheckoutRequest {
  product_type: ProductType;
  video_slug?: string; // Required for single video purchase
  customer_email?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  purchase?: {
    product_type: ProductType;
    video_id: string | null;
    expires_at: string;
    days_remaining: number;
  };
  videos?: Video[];
  error?: string;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface VideoCardProps {
  video: Video;
  locked?: boolean;
  onPurchase?: () => void;
}

export interface CategoryCardProps {
  category: VideoCategory;
  videoCount: number;
  onClick?: () => void;
}

export interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean;
}

export interface PurchaseButtonProps {
  productType: ProductType;
  videoSlug?: string;
  price: number;
  label?: string;
  className?: string;
}

export interface DisclaimerProps {
  variant?: 'full' | 'compact';
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================

export const VIDEO_PRICES = {
  single: 300,    // 3.00 EUR in cents
  standard: 1200, // 12.00 EUR in cents
  full: 1500,     // 15.00 EUR in cents
} as const;

// Package video counts
export const PACKAGE_VIDEO_COUNTS = {
  standard: 10, // 10-12 videos in standard package
  full: 0,      // 0 means all videos
} as const;

export const VIDEO_CURRENCY = 'eur';

export const ACCESS_DURATION_DAYS = 30;

export const CATEGORY_ICONS: Record<string, string> = {
  'kregoslup-szyjny': 'activity',
  'odcinek-piersiowy': 'heart',
  'odcinek-ledźwiowy': 'move',
  'bark': 'hand',
  'biodro': 'footprints',
  'kolano': 'circle-dot',
} as const;

export const CATEGORY_NAMES: Record<string, string> = {
  'kregoslup-szyjny': 'Kręgosłup szyjny',
  'odcinek-piersiowy': 'Odcinek piersiowy',
  'odcinek-ledźwiowy': 'Odcinek lędźwiowy',
  'bark': 'Bark',
  'biodro': 'Biodro',
  'kolano': 'Kolano',
} as const;
