/**
 * Admin Data Layer
 * Provides data access with Supabase primary storage and JSON file fallback
 */

import { createServerSupabaseClient } from './supabase';
import { Booking, BlockedSlot, Client, BookingStatus } from '@/types/admin';
import { ClinicSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { VideoItem, PageText, VideoFilters, DEFAULT_PAGE_TEXTS } from '@/types/video';
import { promises as fs } from 'fs';
import path from 'path';

// Data directory for JSON files (fallback storage)
const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BLOCKS_FILE = path.join(DATA_DIR, 'blocks.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
const PAGE_TEXTS_FILE = path.join(DATA_DIR, 'page-texts.json');

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ============================================
// JSON FILE HELPERS
// ============================================

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// BOOKINGS
// ============================================

export interface BookingFilters {
  date_from?: string;
  date_to?: string;
  status?: BookingStatus;
  search?: string;
}

export async function getBookings(filters?: BookingFilters): Promise<Booking[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase.from('bookings').select('*');

      if (filters?.date_from) {
        query = query.gte('date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('date', filters.date_to);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,service_type.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order('date', { ascending: false }).order('time', { ascending: false });

      if (error) throw error;
      return (data as Booking[]) || [];
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  let bookings = await readJsonFile<Booking[]>(BOOKINGS_FILE, []);

  if (filters?.date_from) {
    bookings = bookings.filter((b) => b.date >= filters.date_from!);
  }
  if (filters?.date_to) {
    bookings = bookings.filter((b) => b.date <= filters.date_to!);
  }
  if (filters?.status) {
    bookings = bookings.filter((b) => b.status === filters.status);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.first_name.toLowerCase().includes(search) ||
        b.last_name.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.phone.includes(search) ||
        b.service_type.toLowerCase().includes(search)
    );
  }

  return bookings.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.time.localeCompare(a.time);
  });
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Booking;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  const bookings = await readJsonFile<Booking[]>(BOOKINGS_FILE, []);
  return bookings.find((b) => b.id === id) || null;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...booking,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const newBooking: Booking = {
    ...booking,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };

  const bookings = await readJsonFile<Booking[]>(BOOKINGS_FILE, []);
  bookings.push(newBooking);
  await writeJsonFile(BOOKINGS_FILE, bookings);

  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const bookings = await readJsonFile<Booking[]>(BOOKINGS_FILE, []);
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index] = { ...bookings[index], ...updates, updated_at: now };
  await writeJsonFile(BOOKINGS_FILE, bookings);

  return bookings[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const bookings = await readJsonFile<Booking[]>(BOOKINGS_FILE, []);
  const newBookings = bookings.filter((b) => b.id !== id);
  if (newBookings.length === bookings.length) return false;

  await writeJsonFile(BOOKINGS_FILE, newBookings);
  return true;
}

// ============================================
// BLOCKED SLOTS
// ============================================

export async function getBlockedSlots(dateFrom?: string, dateTo?: string): Promise<BlockedSlot[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase.from('blocked_slots').select('*');

      if (dateFrom) {
        query = query.gte('date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('date', dateTo);
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return (data as BlockedSlot[]) || [];
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  let blocks = await readJsonFile<BlockedSlot[]>(BLOCKS_FILE, []);

  if (dateFrom) {
    blocks = blocks.filter((b) => b.date >= dateFrom);
  }
  if (dateTo) {
    blocks = blocks.filter((b) => b.date <= dateTo);
  }

  return blocks.sort((a, b) => a.date.localeCompare(b.date));
}

export async function createBlockedSlot(slot: {
  date: string;
  time_start?: string | null;
  time_end?: string | null;
  is_full_day?: boolean;
  reason?: string | null;
}): Promise<BlockedSlot> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('blocked_slots')
        .insert({
          ...slot,
          is_full_day: slot.is_full_day ?? !slot.time_start,
          created_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data as BlockedSlot;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const newSlot: BlockedSlot = {
    id: generateId(),
    date: slot.date,
    time_start: slot.time_start || null,
    time_end: slot.time_end || null,
    is_full_day: slot.is_full_day ?? !slot.time_start,
    reason: slot.reason || null,
    created_at: now,
  };

  const blocks = await readJsonFile<BlockedSlot[]>(BLOCKS_FILE, []);
  blocks.push(newSlot);
  await writeJsonFile(BLOCKS_FILE, blocks);

  return newSlot;
}

export async function deleteBlockedSlot(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from('blocked_slots').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const blocks = await readJsonFile<BlockedSlot[]>(BLOCKS_FILE, []);
  const newBlocks = blocks.filter((b) => b.id !== id);
  if (newBlocks.length === blocks.length) return false;

  await writeJsonFile(BLOCKS_FILE, newBlocks);
  return true;
}

// ============================================
// CLIENTS (derived from bookings)
// ============================================

export async function getClients(): Promise<Client[]> {
  const bookings = await getBookings();

  // Group by email
  const clientMap = new Map<string, Client>();

  for (const booking of bookings) {
    const existing = clientMap.get(booking.email);
    const spent = booking.status !== 'cancelled' ? booking.price_pln : 0;

    if (existing) {
      existing.visit_count++;
      existing.total_spent += spent;
      if (booking.date > existing.last_visit) {
        existing.last_visit = booking.date;
        existing.first_name = booking.first_name;
        existing.last_name = booking.last_name;
        existing.phone = booking.phone;
      }
    } else {
      clientMap.set(booking.email, {
        email: booking.email,
        first_name: booking.first_name,
        last_name: booking.last_name,
        phone: booking.phone,
        visit_count: 1,
        last_visit: booking.date,
        total_spent: spent,
      });
    }
  }

  return Array.from(clientMap.values()).sort((a, b) => b.last_visit.localeCompare(a.last_visit));
}

export async function getClientBookings(email: string): Promise<Booking[]> {
  const bookings = await getBookings();
  return bookings
    .filter((b) => b.email === email)
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const monthStartStr = monthStart.toISOString().split('T')[0];
  const monthEndStr = monthEnd.toISOString().split('T')[0];

  const allBookings = await getBookings();

  // Today's bookings
  const todayBookings = allBookings.filter((b) => b.date === todayStr && b.status !== 'cancelled');

  // This week's bookings
  const weekBookings = allBookings.filter(
    (b) => b.date >= todayStr && b.date <= weekEndStr && b.status !== 'cancelled'
  );

  // Month revenue
  const monthBookings = allBookings.filter(
    (b) =>
      b.date >= monthStartStr &&
      b.date <= monthEndStr &&
      (b.status === 'confirmed' || b.status === 'completed')
  );
  const monthRevenue = monthBookings.reduce((sum, b) => sum + b.price_pln, 0);

  // Unique clients
  const uniqueEmails = new Set(allBookings.map((b) => b.email));

  // Upcoming appointments (next 7 days, excluding today)
  const upcomingAppointments = allBookings
    .filter((b) => b.date > todayStr && b.date <= weekEndStr && b.status !== 'cancelled')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    })
    .slice(0, 10);

  return {
    stats: {
      todayBookings: todayBookings.length,
      weekBookings: weekBookings.length,
      monthRevenue,
      totalClients: uniqueEmails.size,
    },
    todayAppointments: todayBookings.sort((a, b) => a.time.localeCompare(b.time)),
    upcomingAppointments,
  };
}

// ============================================
// SETTINGS
// ============================================

export async function getSettings(): Promise<ClinicSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'clinic')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      if (data) {
        return {
          openingHours: data.opening_hours,
          pricing: data.pricing,
          contact: data.contact,
          updatedAt: data.updated_at,
        };
      }
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  return await readJsonFile<ClinicSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function updateSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
  const current = await getSettings();
  const updated: ClinicSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'clinic',
          opening_hours: updated.openingHours,
          pricing: updated.pricing,
          contact: updated.contact,
          updated_at: updated.updatedAt,
        });

      if (error) throw error;
      return updated;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  await writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// ============================================
// AVAILABILITY & COLLISION CHECKING
// ============================================

/**
 * Check if a date is fully blocked
 */
export async function isDateFullyBlocked(date: string): Promise<boolean> {
  const blocks = await getBlockedSlots(date, date);
  return blocks.some((b) => b.is_full_day);
}

/**
 * Check if a specific time slot is blocked
 */
export async function isTimeSlotBlocked(date: string, time: string, durationMinutes: number): Promise<boolean> {
  const blocks = await getBlockedSlots(date, date);

  // If full day is blocked
  if (blocks.some((b) => b.is_full_day)) {
    return true;
  }

  // Calculate booking end time
  const [hours, minutes] = time.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;
  const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

  // Check if any time-range block overlaps
  for (const block of blocks) {
    if (!block.is_full_day && block.time_start && block.time_end) {
      const blockStart = block.time_start;
      const blockEnd = block.time_end;

      // Check overlap: booking overlaps block if booking starts before block ends AND booking ends after block starts
      if (time < blockEnd && endTime > blockStart) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a booking would overlap with existing bookings
 */
export async function hasBookingCollision(
  date: string,
  time: string,
  durationMinutes: number,
  excludeBookingId?: string
): Promise<{ hasCollision: boolean; conflictingBooking?: Booking }> {
  const bookings = await getBookings({ date_from: date, date_to: date });
  const activeBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && b.id !== excludeBookingId
  );

  // Calculate new booking time range
  const [hours, minutes] = time.split(':').map(Number);
  const newStartMinutes = hours * 60 + minutes;
  const newEndMinutes = newStartMinutes + durationMinutes;

  for (const booking of activeBookings) {
    const [bHours, bMinutes] = booking.time.split(':').map(Number);
    const existingStartMinutes = bHours * 60 + bMinutes;
    const existingEndMinutes = existingStartMinutes + booking.duration_minutes;

    // Check overlap
    if (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes) {
      return { hasCollision: true, conflictingBooking: booking };
    }
  }

  return { hasCollision: false };
}

/**
 * Validate booking can be created (checks blocks and collisions)
 */
export async function validateBookingSlot(
  date: string,
  time: string,
  durationMinutes: number,
  excludeBookingId?: string
): Promise<{ valid: boolean; error?: string }> {
  // Check if date is fully blocked
  if (await isDateFullyBlocked(date)) {
    return { valid: false, error: 'Ten dzień jest zablokowany' };
  }

  // Check if time slot is blocked
  if (await isTimeSlotBlocked(date, time, durationMinutes)) {
    return { valid: false, error: 'Ten termin jest zablokowany' };
  }

  // Check for booking collisions
  const collision = await hasBookingCollision(date, time, durationMinutes, excludeBookingId);
  if (collision.hasCollision) {
    return {
      valid: false,
      error: `Konflikt z istniejącą rezerwacją: ${collision.conflictingBooking?.first_name} ${collision.conflictingBooking?.last_name} o ${collision.conflictingBooking?.time}`,
    };
  }

  return { valid: true };
}

/**
 * Get available time slots for a given date
 */
export async function getAvailableTimeSlots(
  date: string,
  durationMinutes: number,
  settings?: ClinicSettings
): Promise<string[]> {
  const clinicSettings = settings || await getSettings();

  // Get day of week
  const dayOfWeek = new Date(date).getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek];

  const daySettings = clinicSettings.openingHours[dayName];

  // If closed, return empty
  if (!daySettings || daySettings.isClosed) {
    return [];
  }

  // Check if fully blocked
  if (await isDateFullyBlocked(date)) {
    return [];
  }

  // Generate all possible slots
  const [openHour, openMin] = daySettings.open.split(':').map(Number);
  const [closeHour, closeMin] = daySettings.close.split(':').map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  const slots: string[] = [];

  // Generate slots every 30 minutes
  for (let minutes = openMinutes; minutes + durationMinutes <= closeMinutes; minutes += 30) {
    const time = `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;

    // Check if slot is available
    const isBlocked = await isTimeSlotBlocked(date, time, durationMinutes);
    const collision = await hasBookingCollision(date, time, durationMinutes);

    if (!isBlocked && !collision.hasCollision) {
      slots.push(time);
    }
  }

  return slots;
}

// ============================================
// VIDEOS
// ============================================

export async function getVideos(filters?: VideoFilters): Promise<VideoItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase.from('videos').select('*');

      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }
      if (filters?.bodyPart) {
        query = query.eq('body_part', filters.bodyPart);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      let videos = (data || []).map(mapDbToVideo);

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        videos = videos.filter(
          (v) => v.title.toLowerCase().includes(search) || v.description.toLowerCase().includes(search)
        );
      }

      return videos;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  let videos = await readJsonFile<VideoItem[]>(VIDEOS_FILE, []);

  if (filters?.isPublished !== undefined) {
    videos = videos.filter((v) => v.isPublished === filters.isPublished);
  }
  if (filters?.bodyPart) {
    videos = videos.filter((v) => v.bodyPart === filters.bodyPart);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    videos = videos.filter(
      (v) => v.title.toLowerCase().includes(search) || v.description.toLowerCase().includes(search)
    );
  }

  return videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getVideoById(id: string): Promise<VideoItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
      if (error) throw error;
      return mapDbToVideo(data);
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  const videos = await readJsonFile<VideoItem[]>(VIDEOS_FILE, []);
  return videos.find((v) => v.id === id) || null;
}

export async function createVideo(
  video: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<VideoItem> {
  const now = new Date().toISOString();
  const id = `vid_${generateId()}`;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('videos')
        .insert({
          id,
          title: video.title,
          description: video.description,
          body_part: video.bodyPart,
          duration_min: video.durationMin,
          price_eur: video.priceEur,
          included_in_package: video.includedInPackage,
          video_url: video.videoUrl,
          thumbnail_url: video.thumbnailUrl,
          is_published: video.isPublished,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbToVideo(data);
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const newVideo: VideoItem = {
    ...video,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const videos = await readJsonFile<VideoItem[]>(VIDEOS_FILE, []);
  videos.push(newVideo);
  await writeJsonFile(VIDEOS_FILE, videos);

  return newVideo;
}

export async function updateVideo(id: string, updates: Partial<VideoItem>): Promise<VideoItem | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const dbUpdates: Record<string, unknown> = { updated_at: now };

      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.bodyPart !== undefined) dbUpdates.body_part = updates.bodyPart;
      if (updates.durationMin !== undefined) dbUpdates.duration_min = updates.durationMin;
      if (updates.priceEur !== undefined) dbUpdates.price_eur = updates.priceEur;
      if (updates.includedInPackage !== undefined) dbUpdates.included_in_package = updates.includedInPackage;
      if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
      if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl;
      if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;

      const { data, error } = await supabase
        .from('videos')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbToVideo(data);
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const videos = await readJsonFile<VideoItem[]>(VIDEOS_FILE, []);
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;

  videos[index] = { ...videos[index], ...updates, updatedAt: now };
  await writeJsonFile(VIDEOS_FILE, videos);

  return videos[index];
}

export async function deleteVideo(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const videos = await readJsonFile<VideoItem[]>(VIDEOS_FILE, []);
  const newVideos = videos.filter((v) => v.id !== id);
  if (newVideos.length === videos.length) return false;

  await writeJsonFile(VIDEOS_FILE, newVideos);
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToVideo(row: any): VideoItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    bodyPart: row.body_part || 'Ogólne',
    durationMin: row.duration_min,
    priceEur: row.price_eur ?? 3,
    includedInPackage: row.included_in_package ?? true,
    videoUrl: row.video_url || '',
    thumbnailUrl: row.thumbnail_url,
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================
// PAGE TEXTS
// ============================================

export async function getPageTexts(): Promise<PageText[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('page_texts').select('*');

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((row) => ({
          key: row.key,
          title: row.title,
          content: row.content,
          updatedAt: row.updated_at,
        }));
      }
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  return await readJsonFile<PageText[]>(PAGE_TEXTS_FILE, DEFAULT_PAGE_TEXTS);
}

export async function getPageText(key: string): Promise<PageText | null> {
  const texts = await getPageTexts();
  return texts.find((t) => t.key === key) || null;
}

export async function updatePageText(key: string, data: { title?: string; content?: string }): Promise<PageText | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data: updated, error } = await supabase
        .from('page_texts')
        .upsert({
          key,
          title: data.title,
          content: data.content,
          updated_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        key: updated.key,
        title: updated.title,
        content: updated.content,
        updatedAt: updated.updated_at,
      };
    } catch (error) {
      console.error('Supabase error, falling back to JSON:', error);
    }
  }

  // Fallback to JSON
  const texts = await readJsonFile<PageText[]>(PAGE_TEXTS_FILE, DEFAULT_PAGE_TEXTS);
  const index = texts.findIndex((t) => t.key === key);

  if (index === -1) {
    // Create new
    const newText: PageText = {
      key,
      title: data.title || key,
      content: data.content || '',
      updatedAt: now,
    };
    texts.push(newText);
    await writeJsonFile(PAGE_TEXTS_FILE, texts);
    return newText;
  }

  texts[index] = {
    ...texts[index],
    ...data,
    updatedAt: now,
  };

  await writeJsonFile(PAGE_TEXTS_FILE, texts);
  return texts[index];
}
