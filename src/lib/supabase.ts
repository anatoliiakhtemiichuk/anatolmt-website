import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
// These values should be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured (not using placeholder values)
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Lazy-loaded Supabase client for client-side operations
let _supabaseClient: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Using local JSON storage.');
      return undefined;
    }
    if (!_supabaseClient) {
      _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return (_supabaseClient as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Create Supabase client for server-side operations
export const createServerSupabaseClient = (): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !serviceKey || url.includes('placeholder') || serviceKey.includes('placeholder')) {
    throw new Error('Supabase is not configured for server-side operations');
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
