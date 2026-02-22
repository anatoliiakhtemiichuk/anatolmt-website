/**
 * Site Settings Server Helpers
 * Server-only functions for reading/writing site settings
 * Uses atomic writes for data safety
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

// Path to the settings file
const DATA_DIR = path.join(process.cwd(), 'data');
const SITE_SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json');

/**
 * Ensure the data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

/**
 * Read site settings from JSON file
 * Returns defaults if file doesn't exist or is corrupt
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SITE_SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Validate and merge with defaults to ensure all fields exist
    const validation = validateSiteSettings(parsed);
    if (!validation.valid) {
      console.warn('Site settings validation warnings:', validation.errors);
    }

    // Merge with defaults to ensure all required fields exist
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      services: parsed.services || DEFAULT_SITE_SETTINGS.services,
      openingHours: { ...DEFAULT_SITE_SETTINGS.openingHours, ...parsed.openingHours },
      contact: { ...DEFAULT_SITE_SETTINGS.contact, ...parsed.contact },
      texts: { ...DEFAULT_SITE_SETTINGS.texts, ...parsed.texts },
      booking: { ...DEFAULT_SITE_SETTINGS.booking, ...parsed.booking },
    };
  } catch (error) {
    console.warn('Failed to read site settings, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Write site settings to JSON file atomically
 * Writes to a temp file first, then renames (atomic on most filesystems)
 */
export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  await ensureDataDir();

  // Validate before saving
  const validation = validateSiteSettings(settings);
  if (!validation.valid) {
    throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
  }

  // Update timestamp
  const updatedSettings: SiteSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // Write to temp file first
  const tempFile = `${SITE_SETTINGS_FILE}.tmp.${Date.now()}`;
  const content = JSON.stringify(updatedSettings, null, 2);

  try {
    await fs.writeFile(tempFile, content, 'utf-8');
    // Atomic rename
    await fs.rename(tempFile, SITE_SETTINGS_FILE);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }

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
    };
  }

  return result;
}
