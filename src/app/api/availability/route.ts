/**
 * Public Availability API
 * GET /api/availability - Get available time slots for a date
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTimeSlots, isDateFullyBlocked, getSettings } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const duration = searchParams.get('duration');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const durationMinutes = duration ? parseInt(duration, 10) : 60;
    const settings = await getSettings();

    // Check if date is blocked
    const isBlocked = await isDateFullyBlocked(date);

    // Get available slots
    const slots = await getAvailableTimeSlots(date, durationMinutes, settings);

    // Get day settings
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    const daySettings = settings.openingHours[dayName];

    return NextResponse.json({
      success: true,
      data: {
        date,
        isBlocked,
        isClosed: daySettings?.isClosed ?? true,
        openingHours: daySettings,
        availableSlots: slots,
      },
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania dostępności' },
      { status: 500 }
    );
  }
}
