// Database Types for Supabase

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  name_pl: string; // Polish name
  duration_minutes: number;
  price_weekday: number;
  price_weekend: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  client_id: string;
  service_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: BookingStatus;
  notes?: string;
  total_price: number;
  is_weekend: boolean;
  created_at: string;
  updated_at: string;
}

// Booking with joined data
export interface BookingWithDetails extends Booking {
  client: Client;
  service: Service;
}

export interface Availability {
  id: string;
  date: string; // YYYY-MM-DD - for specific date blocks
  day_of_week?: number; // 0-6 for recurring schedule
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  is_blocked: boolean; // true = blocked, false = available
  reason?: string; // e.g., "Holiday", "Personal"
  created_at: string;
}

// Opening hours configuration
export interface OpeningHours {
  [key: number]: {
    // day of week (0 = Sunday, 1 = Monday, etc.)
    isOpen: boolean;
    start: string;
    end: string;
  };
}

// Default opening hours
export const DEFAULT_OPENING_HOURS: OpeningHours = {
  0: { isOpen: true, start: '11:00', end: '15:00' }, // Sunday
  1: { isOpen: false, start: '', end: '' }, // Monday - closed
  2: { isOpen: true, start: '11:00', end: '22:00' }, // Tuesday
  3: { isOpen: true, start: '11:00', end: '22:00' }, // Wednesday
  4: { isOpen: true, start: '11:00', end: '22:00' }, // Thursday
  5: { isOpen: true, start: '11:00', end: '22:00' }, // Friday
  6: { isOpen: true, start: '10:00', end: '18:00' }, // Saturday
};

// Check if a day is a weekend (Saturday = 6, Sunday = 0)
export const isWeekend = (dayOfWeek: number): boolean => {
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// Services data with both weekday and weekend pricing
export const SERVICES: Omit<Service, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Consultation',
    name_pl: 'Konsultacja',
    duration_minutes: 30,
    price_weekday: 50,
    price_weekend: 50,
    description: 'Initial consultation to discuss your needs',
    is_active: true,
  },
  {
    name: '1-hour Visit (Weekday)',
    name_pl: 'Wizyta 1h (dzień roboczy)',
    duration_minutes: 60,
    price_weekday: 200,
    price_weekend: 250,
    description: 'Standard 1-hour therapy session',
    is_active: true,
  },
  {
    name: '1.5-hour Visit (Weekday)',
    name_pl: 'Wizyta 1.5h (dzień roboczy)',
    duration_minutes: 90,
    price_weekday: 250,
    price_weekend: 300,
    description: 'Extended 1.5-hour therapy session',
    is_active: true,
  },
];

// Client form data
export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

// Booking form data
export interface BookingFormData {
  serviceId: string;
  date: string;
  time: string;
  client: ClientFormData;
}

// Time slot for calendar
export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  reason?: string; // If not available, why
}
