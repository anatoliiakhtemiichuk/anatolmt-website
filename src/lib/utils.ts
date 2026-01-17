import { format, parse, addMinutes, isBefore, isAfter, getDay, isWeekend as dateFnsIsWeekend } from 'date-fns';
import { pl } from 'date-fns/locale';
import { DEFAULT_OPENING_HOURS, TimeSlot } from '@/types/database';

// Format price in PLN
export const formatPrice = (price: number): string => {
  return `${price} PLN`;
};

// Format date for display
export const formatDate = (date: Date | string, formatStr: string = 'dd MMMM yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: pl });
};

// Format time for display
export const formatTime = (time: string): string => {
  return time; // Already in HH:mm format
};

// Check if a date is a weekend
export const isWeekend = (date: Date): boolean => {
  return dateFnsIsWeekend(date);
};

// Get day of week (0 = Sunday, 6 = Saturday)
export const getDayOfWeek = (date: Date): number => {
  return getDay(date);
};

// Check if the clinic is open on a given day
export const isOpenOnDay = (date: Date): boolean => {
  const dayOfWeek = getDayOfWeek(date);
  return DEFAULT_OPENING_HOURS[dayOfWeek]?.isOpen ?? false;
};

// Get opening hours for a specific day
export const getOpeningHours = (date: Date): { start: string; end: string } | null => {
  const dayOfWeek = getDayOfWeek(date);
  const hours = DEFAULT_OPENING_HOURS[dayOfWeek];

  if (!hours || !hours.isOpen) {
    return null;
  }

  return { start: hours.start, end: hours.end };
};

// Generate time slots for a day (30-minute intervals)
export const generateTimeSlots = (
  date: Date,
  serviceDurationMinutes: number,
  bookedSlots: { start_time: string; end_time: string }[] = [],
  blockedSlots: { start_time: string; end_time: string }[] = []
): TimeSlot[] => {
  const hours = getOpeningHours(date);

  if (!hours) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const startTime = parse(hours.start, 'HH:mm', date);
  const endTime = parse(hours.end, 'HH:mm', date);

  let currentTime = startTime;

  while (isBefore(currentTime, endTime)) {
    const slotEndTime = addMinutes(currentTime, serviceDurationMinutes);
    const timeStr = format(currentTime, 'HH:mm');

    // Check if service would extend past closing time
    if (isAfter(slotEndTime, endTime)) {
      break;
    }

    // Check if slot is blocked
    const isBlocked = blockedSlots.some((blocked) => {
      const blockedStart = parse(blocked.start_time, 'HH:mm', date);
      const blockedEnd = parse(blocked.end_time, 'HH:mm', date);
      return (
        (isBefore(currentTime, blockedEnd) || currentTime.getTime() === blockedEnd.getTime()) &&
        (isAfter(slotEndTime, blockedStart) || slotEndTime.getTime() === blockedStart.getTime())
      );
    });

    // Check if slot overlaps with existing booking
    const isBooked = bookedSlots.some((booked) => {
      const bookedStart = parse(booked.start_time, 'HH:mm', date);
      const bookedEnd = parse(booked.end_time, 'HH:mm', date);
      return (
        (isBefore(currentTime, bookedEnd) && isAfter(slotEndTime, bookedStart)) ||
        currentTime.getTime() === bookedStart.getTime()
      );
    });

    slots.push({
      time: timeStr,
      available: !isBlocked && !isBooked,
      reason: isBlocked ? 'Blocked' : isBooked ? 'Already booked' : undefined,
    });

    // Move to next 30-minute slot
    currentTime = addMinutes(currentTime, 30);
  }

  return slots;
};

// Calculate end time based on start time and duration
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const baseDate = new Date();
  const start = parse(startTime, 'HH:mm', baseDate);
  const end = addMinutes(start, durationMinutes);
  return format(end, 'HH:mm');
};

// Get price based on date (weekend vs weekday)
export const getServicePrice = (
  priceWeekday: number,
  priceWeekend: number,
  date: Date
): number => {
  return isWeekend(date) ? priceWeekend : priceWeekday;
};

// Validate Polish phone number
export const isValidPolishPhone = (phone: string): boolean => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  // Polish phone numbers: 9 digits, optionally starting with +48
  return /^(\+48)?[0-9]{9}$/.test(cleaned);
};

// Format Polish phone number
export const formatPolishPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+48')) {
    const number = cleaned.slice(3);
    return `+48 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

// CN utility for conditional classnames
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
