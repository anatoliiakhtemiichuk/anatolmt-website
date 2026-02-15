/**
 * Pricing Utilities
 * Helper functions for service pricing calculations
 * All prices are in PLN (integer values, not groszy/cents)
 */

import { isWeekend } from 'date-fns';
import type { ServicePricing } from '@/types/settings';

export type ServiceType = 'consultation' | 'visit-1h' | 'visit-1.5h';

/**
 * Format a price in PLN
 * @param price - Price as integer PLN (e.g., 200)
 * @returns Formatted string (e.g., "200 zł")
 */
export function formatPLN(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '— zł';
  }
  return `${price} zł`;
}

/**
 * Get service price based on service type and date
 * @param serviceType - The service type ID
 * @param selectedDate - The selected date (determines weekend vs weekday pricing)
 * @param pricing - The pricing configuration
 * @returns Price in PLN
 */
export function getServicePrice(
  serviceType: ServiceType,
  selectedDate: Date | null,
  pricing: ServicePricing
): number {
  const weekend = selectedDate ? isWeekend(selectedDate) : false;

  switch (serviceType) {
    case 'consultation':
      return pricing.consultation; // 50 PLN always
    case 'visit-1h':
      return weekend ? pricing.visit1hWeekend : pricing.visit1hWeekday;
    case 'visit-1.5h':
      return weekend ? pricing.visit15hWeekend : pricing.visit15hWeekday;
    default:
      return 0;
  }
}

/**
 * Get weekday and weekend prices for a service
 * @param serviceType - The service type ID
 * @param pricing - The pricing configuration
 * @returns Object with weekday and weekend prices (weekend is null for consultation)
 */
export function getServicePrices(
  serviceType: ServiceType,
  pricing: ServicePricing
): { weekday: number; weekend: number | null } {
  switch (serviceType) {
    case 'consultation':
      return { weekday: pricing.consultation, weekend: null };
    case 'visit-1h':
      return { weekday: pricing.visit1hWeekday, weekend: pricing.visit1hWeekend };
    case 'visit-1.5h':
      return { weekday: pricing.visit15hWeekday, weekend: pricing.visit15hWeekend };
    default:
      return { weekday: 0, weekend: null };
  }
}

/**
 * Default pricing values (used when settings not loaded)
 */
export const DEFAULT_PRICING: ServicePricing = {
  consultation: 50,
  visit1hWeekday: 200,
  visit1hWeekend: 250,
  visit15hWeekday: 250,
  visit15hWeekend: 300,
};

/**
 * Price verification (for dev console / unit tests)
 *
 * Expected values:
 * - Consultation: 50 PLN (always)
 * - Visit 1h weekday: 200 PLN
 * - Visit 1h weekend: 250 PLN
 * - Visit 1.5h weekday: 250 PLN
 * - Visit 1.5h weekend: 300 PLN
 *
 * Console verification:
 * ```
 * import { verifyPricing, DEFAULT_PRICING } from '@/lib/pricing';
 * console.log(verifyPricing(DEFAULT_PRICING));
 * // Should output: { valid: true, errors: [] }
 * ```
 */
export function verifyPricing(pricing: ServicePricing): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (pricing.consultation !== 50) {
    errors.push(`Consultation should be 50, got ${pricing.consultation}`);
  }
  if (pricing.visit1hWeekday !== 200) {
    errors.push(`Visit 1h weekday should be 200, got ${pricing.visit1hWeekday}`);
  }
  if (pricing.visit1hWeekend !== 250) {
    errors.push(`Visit 1h weekend should be 250, got ${pricing.visit1hWeekend}`);
  }
  if (pricing.visit15hWeekday !== 250) {
    errors.push(`Visit 1.5h weekday should be 250, got ${pricing.visit15hWeekday}`);
  }
  if (pricing.visit15hWeekend !== 300) {
    errors.push(`Visit 1.5h weekend should be 300, got ${pricing.visit15hWeekend}`);
  }

  return { valid: errors.length === 0, errors };
}
