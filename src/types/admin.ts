/**
 * Admin Types
 * Types for the admin panel and booking management
 */

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  profile: Profile;
}

// ============================================
// BOOKING TYPES
// ============================================

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
  id: string;
  service_type: string;
  duration_minutes: number;
  price_pln: number;
  date: string;
  time: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingWithClient extends Booking {
  client_full_name: string;
}

// ============================================
// BLOCKED SLOTS TYPES
// ============================================

export interface BlockedSlot {
  id: string;
  date: string;
  time_start: string | null;
  time_end: string | null;
  is_full_day: boolean;
  reason: string | null;
  created_at: string;
}

export interface CreateBlockedSlotRequest {
  date: string;
  time_start?: string;
  time_end?: string;
  is_full_day?: boolean;
  reason?: string;
}

// ============================================
// CLIENT TYPES
// ============================================

export interface Client {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  visit_count: number;
  last_visit: string;
  total_spent: number;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthRevenue: number;
  totalClients: number;
}

export interface DashboardData {
  stats: DashboardStats;
  todayAppointments: Booking[];
  upcomingAppointments: Booking[];
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface BookingsFilterParams {
  date_from?: string;
  date_to?: string;
  status?: BookingStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  date?: string;
  time?: string;
  notes?: string;
}
