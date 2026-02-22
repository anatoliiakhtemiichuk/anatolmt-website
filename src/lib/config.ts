/**
 * Site Configuration
 * Single source of truth for site URL and other global config
 */

// Primary production domain - used as default when SITE_URL is not set
const DEFAULT_SITE_URL = 'https://anatolmt.pl';

/**
 * Get the site URL from environment or use default
 * In development, falls back to localhost if not set
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (envUrl && envUrl !== 'http://localhost:1000') {
    return envUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // In production, always use the default domain
  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_SITE_URL;
  }

  // In development, use env var or localhost
  return envUrl || 'http://localhost:1000';
}

/**
 * Site URL constant for use in metadata and other places
 */
export const SITE_URL = getSiteUrl();

/**
 * Build a full URL with the site domain
 */
export function buildUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
