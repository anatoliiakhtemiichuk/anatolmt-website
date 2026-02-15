/**
 * Video Content Types
 * Types for video management and page content
 */

// ============================================
// LEGACY TYPES (for existing video-pomoc page)
// ============================================

export interface Video {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  when_to_do: string;
  when_not_to_do: string;
  embed_url: string;
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
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

// Video prices in cents (EUR)
export const VIDEO_PRICES = {
  single: 300,      // 3 EUR per single video
  standard: 1200,   // 12 EUR for standard package
  full: 1500,       // 15 EUR for full package
} as const;

// ============================================
// ADMIN VIDEO MANAGEMENT TYPES
// ============================================

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  bodyPart: string;
  durationMin?: number;
  priceEur: number;
  includedInPackage: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageText {
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface VideoFilters {
  bodyPart?: string;
  search?: string;
  isPublished?: boolean;
}

export const BODY_PARTS = [
  'Kark',
  'Plecy',
  'Bark',
  'Biodra',
  'Kolana',
  'Stopy',
  'Nadgarstki',
  'Łokcie',
  'Ogólne',
] as const;

export type BodyPart = typeof BODY_PARTS[number];

export const DEFAULT_PAGE_TEXTS: PageText[] = [
  {
    key: 'video_help_intro',
    title: 'Wideo Pomoc - Wprowadzenie',
    content: 'Materiały wideo opracowane przez doświadczonych terapeutów, które pomogą Ci w codziennej pielęgnacji ciała i redukcji dolegliwości bólowych.',
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'video_help_disclaimer',
    title: 'Zastrzeżenie',
    content: 'Materiały wideo mają charakter edukacyjny i nie zastępują profesjonalnej konsultacji medycznej. Przed rozpoczęciem ćwiczeń skonsultuj się z lekarzem lub fizjoterapeutą.',
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'video_help_package',
    title: 'Pakiet Wideo',
    content: 'Wykup dostęp do wszystkich materiałów wideo w atrakcyjnej cenie pakietowej.',
    updatedAt: new Date().toISOString(),
  },
];
