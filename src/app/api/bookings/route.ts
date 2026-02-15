/**
 * Public Bookings API
 * POST /api/bookings - Create a new booking (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBooking, validateBookingSlot } from '@/lib/admin-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['service_type', 'duration_minutes', 'price_pln', 'date', 'time', 'first_name', 'last_name', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Brakuje wymaganego pola: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy adres email' },
        { status: 400 }
      );
    }

    // Validate phone format (Polish phone number)
    const phoneClean = body.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+48)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneClean)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy numer telefonu' },
        { status: 400 }
      );
    }

    // Validate booking slot (check blocks and collisions)
    const validation = await validateBookingSlot(body.date, body.time, body.duration_minutes);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 409 }
      );
    }

    const booking = await createBooking({
      service_type: body.service_type,
      duration_minutes: body.duration_minutes,
      price_pln: body.price_pln,
      date: body.date,
      time: body.time,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      email: body.email,
      notes: body.notes || null,
      status: 'confirmed',
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia rezerwacji' },
      { status: 500 }
    );
  }
}
