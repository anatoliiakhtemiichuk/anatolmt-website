/**
 * Supabase Admin Utilities - Server Side Only
 * For API routes and server components
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '@/types/admin';

// ============================================
// SERVICE ROLE SUPABASE (Admin operations)
// ============================================

export function createAdminSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  // Check if properly configured (not placeholder values)
  if (!supabaseUrl || !supabaseServiceKey ||
      supabaseUrl.includes('placeholder') ||
      supabaseServiceKey.includes('placeholder')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================
// SERVER-SIDE AUTH HELPERS
// ============================================

/**
 * Get user profile by ID (admin only, uses service role)
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    console.warn('Supabase not configured, cannot fetch profile');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
}

/**
 * Verify admin access for API routes
 */
export async function verifyAdminAccess(authHeader: string | null): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAdmin: false, error: 'Missing or invalid authorization header' };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { isAdmin: false, error: 'Supabase not configured' };
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify the JWT token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { isAdmin: false, error: 'Invalid or expired token' };
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return { isAdmin: false, userId: user.id, error: 'Access denied: Admin role required' };
  }

  return { isAdmin: true, userId: user.id };
}
