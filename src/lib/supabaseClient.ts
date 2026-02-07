/**
 * Supabase Browser Client
 * Client-side Supabase instance for authentication and data fetching
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Runtime validation
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl) {
    return 'Brak NEXT_PUBLIC_SUPABASE_URL w pliku .env.local';
  }
  if (!supabaseAnonKey) {
    return 'Brak NEXT_PUBLIC_SUPABASE_ANON_KEY w pliku .env.local';
  }
  return null;
}

// Singleton client instance
let supabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase browser client
 * Returns null if environment variables are missing
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}

/**
 * Get the Supabase client or throw an error
 * Use this when you need to ensure the client exists
 */
export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(getSupabaseConfigError() || 'Supabase nie jest skonfigurowany');
  }
  return client;
}

// Export the client directly for simple usage
// This will be null if env vars are missing
export const supabase = getSupabaseClient();
