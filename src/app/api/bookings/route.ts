/**
 * Public Bookings API
 * POST /api/bookings - Create a new booking (public)
 *
 * SECURITY: Price is calculated server-side from service data.
 * Frontend MUST NOT send price_pln - it will be ignored.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBooking, validateBookingSlot } from '@/lib/admin-data';
import { getSiteSettings } from '@/lib/site-settings';
import { Service } from '@/types/site-settings';

/**
 * Check if a date is a weekend (Saturday = 6, Sunday = 0)
 */
function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Calculate the final price for a service based on the booking date
 */
function calculateServicePrice(service: Service, dateString: string): number {
  const weekend = isWeekend(dateString);

  if (weekend && service.priceWeekend !== null) {
    return service.priceWeekend;
  }

  return service.priceWeekday;
}

/**
 * Minimum allowed price (safety check against data corruption)
 */
const MIN_PRICE_PLN = 50;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ===========================================
    // STEP 1: Validate required fields from client
    // ===========================================
    // NOTE: price_pln is intentionally NOT in this list
    const requiredFields = ['service_id', 'date', 'time', 'first_name', 'last_name', 'phone', 'email'];
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

    // ===========================================
    // STEP 2: Fetch service and calculate price SERVER-SIDE
    // ===========================================
    const settings = await getSiteSettings();
    const service = settings.services.find(
      (s) => s.id === body.service_id && s.isActive
    );

    if (!service) {
      console.error('[bookings] Service not found:', {
        requested_service_id: body.service_id,
        available_services: settings.services.map((s) => ({ id: s.id, name: s.name, isActive: s.isActive })),
      });
      return NextResponse.json(
        { success: false, error: 'Wybrana usługa nie istnieje lub jest nieaktywna' },
        { status: 400 }
      );
    }

    // Calculate price based on service and date
    const calculatedPrice = calculateServicePrice(service, body.date);

    // Log calculated price for debugging
    console.log('[bookings] Price calculated server-side:', {
      service_id: service.id,
      service_name: service.name,
      date: body.date,
      isWeekend: isWeekend(body.date),
      priceWeekday: service.priceWeekday,
      priceWeekend: service.priceWeekend,
      calculatedPrice,
    });

    // ===========================================
    // STEP 3: Safety checks
    // ===========================================
    if (calculatedPrice < MIN_PRICE_PLN) {
      console.error('[bookings] Price below minimum:', {
        calculatedPrice,
        minPrice: MIN_PRICE_PLN,
        service,
      });
      return NextResponse.json(
        { success: false, error: 'Błąd kalkulacji ceny. Skontaktuj się z nami.' },
        { status: 500 }
      );
    }

    // Check if service is available on weekends
    if (isWeekend(body.date) && service.priceWeekend === null) {
      return NextResponse.json(
        { success: false, error: 'Ta usługa nie jest dostępna w weekendy' },
        { status: 400 }
      );
    }

    // ===========================================
    // STEP 4: Validate booking slot availability
    // ===========================================
    const validation = await validateBookingSlot(body.date, body.time, service.durationMinutes);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 409 }
      );
    }

    // ===========================================
    // STEP 5: Create booking with server-calculated price
    // ===========================================
    const booking = await createBooking({
      service_type: service.name,           // Store the service name
      duration_minutes: service.durationMinutes,  // From service, not client
      price_pln: calculatedPrice,           // SERVER-CALCULATED, not from client
      date: body.date,
      time: body.time,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      email: body.email,
      notes: body.notes || null,
      status: 'confirmed',
    });

    console.log('[bookings] Booking created successfully:', {
      booking_id: booking.id,
      service: service.name,
      price_pln: calculatedPrice,
      date: body.date,
      time: body.time,
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: unknown) {
    // Extract error details
    const err = error as Record<string, unknown>;
    const errorMessage =
      (err?.message as string) ||
      (error instanceof Error ? error.message : null) ||
      'Nieznany błąd';
    const errorCode = (err?.code as string) || null;

    console.error('[bookings] Create failed:', {
      message: errorMessage,
      code: errorCode,
      details: err?.details,
      hint: err?.hint,
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}
