/**
 * Site Settings Server Helpers
 * Server-only functions for reading/writing site settings
 *
 * Storage Strategy:
 * - Production (Vercel): Uses Supabase as primary storage (filesystem is read-only)
 * - Development: Falls back to JSON file if Supabase is not configured
 *
 * Required Environment Variables for Production:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { promises as fs } from 'fs';
import path from 'path';
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  validateSiteSettings,
  Service,
  OpeningHoursMap,
  JS_DAY_TO_KEY,
} from '@/types/site-settings';

// Path to the settings file (fallback for development)
const DATA_DIR = path.join(process.cwd(), 'data');
const SITE_SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json');

// Supabase key for storing site settings
const SITE_SETTINGS_KEY = 'site_settings';

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Simple validation: check that all variables exist and URL starts with http
  const hasUrl = !!url && url.startsWith('http');
  const hasAnonKey = !!anonKey && anonKey.length > 10;
  const hasServiceKey = !!serviceKey && serviceKey.length > 10;

  return hasUrl && hasAnonKey && hasServiceKey;
}

/**
 * Get detailed error about which Supabase env var is missing
 */
function getSupabaseMissingVars(): string[] {
  const missing: string[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !url.startsWith('http')) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!anonKey || anonKey.length <= 10) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!serviceKey || serviceKey.length <= 10) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  return missing;
}

/**
 * Check if running in production (Vercel)
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
}

/**
 * Create Supabase client for server-side operations
 */
async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Ensure the data directory exists (for JSON fallback)
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

/**
 * Read settings from JSON file (fallback for development)
 */
async function readJsonSettings(): Promise<SiteSettings | null> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SITE_SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Write settings to JSON file (fallback for development)
 */
async function writeJsonSettings(settings: SiteSettings): Promise<void> {
  await ensureDataDir();
  const tempFile = `${SITE_SETTINGS_FILE}.tmp.${Date.now()}`;
  const content = JSON.stringify(settings, null, 2);

  try {
    await fs.writeFile(tempFile, content, 'utf-8');
    await fs.rename(tempFile, SITE_SETTINGS_FILE);
  } catch (error) {
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Read site settings from Supabase
 */
async function readSupabaseSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('settings')
      .eq('id', SITE_SETTINGS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found, which is ok
      throw error;
    }

    return data?.settings || null;
  } catch (error) {
    console.error('Error reading from Supabase site_settings:', error);
    throw error;
  }
}

/**
 * Write site settings to Supabase
 */
async function writeSupabaseSettings(settings: SiteSettings): Promise<void> {
  const supabase = await getSupabaseClient();

  console.log('[site-settings] Attempting Supabase upsert...');

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      id: SITE_SETTINGS_KEY,
      settings: settings,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    // Log full error details for debugging
    console.error('[site-settings] Supabase upsert error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    // Re-throw the error object directly (preserves all properties)
    throw error;
  }

  console.log('[site-settings] Supabase upsert successful');
}

/**
 * Merge settings with defaults to ensure all fields exist
 */
function mergeWithDefaults(parsed: Partial<SiteSettings>): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...parsed,
    services: parsed.services || DEFAULT_SITE_SETTINGS.services,
    openingHours: { ...DEFAULT_SITE_SETTINGS.openingHours, ...parsed.openingHours },
    contact: { ...DEFAULT_SITE_SETTINGS.contact, ...parsed.contact },
    texts: { ...DEFAULT_SITE_SETTINGS.texts, ...parsed.texts },
    booking: { ...DEFAULT_SITE_SETTINGS.booking, ...parsed.booking },
  };
}

/**
 * Read site settings
 * Uses Supabase as primary storage, falls back to JSON file in development
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const settings = await readSupabaseSettings();
      if (settings) {
        const validation = validateSiteSettings(settings);
        if (!validation.valid) {
          console.warn('Site settings validation warnings:', validation.errors);
        }
        return mergeWithDefaults(settings);
      }
      // Settings don't exist in Supabase yet, return defaults
      console.info('No site settings found in Supabase, using defaults');
      return DEFAULT_SITE_SETTINGS;
    } catch (error) {
      console.error('Supabase read error, checking fallback:', error);
      // In production, we can't fall back to JSON
      if (isProduction()) {
        console.warn('Supabase error in production, returning defaults');
        return DEFAULT_SITE_SETTINGS;
      }
    }
  }

  // Fallback to JSON file (development only)
  if (!isProduction()) {
    try {
      const parsed = await readJsonSettings();
      if (parsed) {
        const validation = validateSiteSettings(parsed);
        if (!validation.valid) {
          console.warn('Site settings validation warnings:', validation.errors);
        }
        return mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.warn('Failed to read JSON settings:', error);
    }
  }

  return DEFAULT_SITE_SETTINGS;
}

/**
 * Save site settings
 * Uses Supabase as primary storage, falls back to JSON file in development
 *
 * @throws Error if in production and Supabase is not configured
 * @throws Error if validation fails
 * @throws Error if Supabase write fails
 */
export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  // Validate before saving
  const validation = validateSiteSettings(settings);
  if (!validation.valid) {
    throw new Error(`Nieprawidłowe ustawienia: ${validation.errors.join(', ')}`);
  }

  // Update timestamp
  const updatedSettings: SiteSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // In production, Supabase is required
  if (isProduction()) {
    if (!isSupabaseConfigured()) {
      const missing = getSupabaseMissingVars();
      throw new Error(
        `Supabase nie jest skonfigurowany. Brakujące zmienne: ${missing.join(', ')}`
      );
    }

    await writeSupabaseSettings(updatedSettings);
    return updatedSettings;
  }

  // Development: try Supabase first, fall back to JSON
  if (isSupabaseConfigured()) {
    try {
      await writeSupabaseSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.warn('Supabase write failed in development, falling back to JSON:', error);
    }
  }

  // Fallback to JSON file (development only)
  await writeJsonSettings(updatedSettings);
  return updatedSettings;
}

/**
 * Get active services only
 */
export async function getActiveServices(): Promise<Service[]> {
  const settings = await getSiteSettings();
  return settings.services.filter((s) => s.isActive);
}

/**
 * Get a specific service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const settings = await getSiteSettings();
  return settings.services.find((s) => s.id === id) || null;
}

/**
 * Check if a specific day is closed
 */
export async function isDayClosed(date: Date): Promise<boolean> {
  const settings = await getSiteSettings();
  const dayKey = JS_DAY_TO_KEY[date.getDay()];
  return settings.openingHours[dayKey]?.closed ?? true;
}

/**
 * Get opening hours for a specific day
 */
export async function getDayHours(date: Date): Promise<{ open: string; close: string; closed: boolean } | null> {
  const settings = await getSiteSettings();
  const dayKey = JS_DAY_TO_KEY[date.getDay()];
  return settings.openingHours[dayKey] || null;
}

/**
 * Get buffer minutes for booking
 */
export async function getBufferMinutes(): Promise<number> {
  const settings = await getSiteSettings();
  return settings.booking.bufferMinutes;
}

/**
 * Format price safely (never returns NaN)
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '— zł';
  }
  return `${price} zł`;
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekendDay(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get service price for a specific date
 */
export function getServicePriceForDate(service: Service, date: Date): number | null {
  const isWeekend = isWeekendDay(date);
  if (isWeekend) {
    return service.priceWeekend;
  }
  return service.priceWeekday;
}

/**
 * Convert legacy settings format to new format
 * This helps with backward compatibility
 */
export function convertLegacySettings(legacy: {
  openingHours?: Record<string, { open: string; close: string; isClosed: boolean }>;
  pricing?: {
    consultation: number;
    visit1hWeekday: number;
    visit1hWeekend: number;
    visit15hWeekday: number;
    visit15hWeekend: number;
  };
  contact?: {
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}): Partial<SiteSettings> {
  const result: Partial<SiteSettings> = {};

  // Convert opening hours
  if (legacy.openingHours) {
    const dayMap: Record<string, keyof OpeningHoursMap> = {
      monday: 'mon',
      tuesday: 'tue',
      wednesday: 'wed',
      thursday: 'thu',
      friday: 'fri',
      saturday: 'sat',
      sunday: 'sun',
    };

    result.openingHours = {} as OpeningHoursMap;
    for (const [oldKey, value] of Object.entries(legacy.openingHours)) {
      const newKey = dayMap[oldKey];
      if (newKey && value) {
        result.openingHours[newKey] = {
          open: value.open,
          close: value.close,
          closed: value.isClosed,
        };
      }
    }
  }

  // Convert pricing to services
  if (legacy.pricing) {
    result.services = [
      {
        id: 'consultation',
        slug: 'konsultacja',
        name: 'Konsultacja',
        description: 'Wstępna konsultacja i ocena potrzeb terapeutycznych',
        durationMinutes: 20,
        showDuration: false,
        priceWeekday: legacy.pricing.consultation,
        priceWeekend: null,
        isActive: true,
      },
      {
        id: 'visit_60',
        slug: 'wizyta-1h',
        name: 'Wizyta standardowa',
        description: 'Pełna sesja terapii manualnej',
        durationMinutes: 60,
        showDuration: true,
        priceWeekday: legacy.pricing.visit1hWeekday,
        priceWeekend: legacy.pricing.visit1hWeekend,
        isActive: true,
      },
      {
        id: 'visit_90',
        slug: 'wizyta-1.5h',
        name: 'Wizyta rozszerzona',
        description: 'Rozszerzona sesja dla kompleksowej terapii',
        durationMinutes: 90,
        showDuration: true,
        priceWeekday: legacy.pricing.visit15hWeekday,
        priceWeekend: legacy.pricing.visit15hWeekend,
        isActive: true,
      },
    ];
  }

  // Convert contact
  if (legacy.contact) {
    result.contact = {
      phone: legacy.contact.phone,
      email: legacy.contact.email,
      addressLine1: legacy.contact.address,
      addressLine2: legacy.contact.city,
      googleMapsUrl: '',
      instagramUrl: '',
      facebookUrl: '',
    };
  }

  return result;
}
