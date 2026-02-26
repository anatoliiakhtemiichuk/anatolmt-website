/**
 * Admin Bookings API
 * GET /api/admin/bookings - List bookings with filters
 * POST /api/admin/bookings - Create a new booking
 *
 * SECURITY: Price is calculated server-side from service data.
 * Even admin cannot send arbitrary prices.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking, validateBookingSlot, BookingFilters } from '@/lib/admin-data';
import { BookingStatus } from '@/types/admin';
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
 * Minimum allowed price (safety check)
 */
const MIN_PRICE_PLN = 50;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const filters: BookingFilters = {};

    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;
    if (status && status !== 'all') filters.status = status as BookingStatus;
    if (search) filters.search = search;

    const bookings = await getBookings(filters);

    return NextResponse.json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania rezerwacji' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ===========================================
    // STEP 1: Validate required fields
    // ===========================================
    // NOTE: price_pln is NOT accepted - calculated server-side
    const requiredFields = ['service_id', 'date', 'time', 'first_name', 'last_name', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Brakuje wymaganego pola: ${field}` },
          { status: 400 }
        );
      }
    }

    // ===========================================
    // STEP 2: Fetch service and calculate price SERVER-SIDE
    // ===========================================
    const settings = await getSiteSettings();
    const service = settings.services.find(
      (s) => s.id === body.service_id && s.isActive
    );

    if (!service) {
      console.error('[admin/bookings] Service not found:', {
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

    console.log('[admin/bookings] Price calculated server-side:', {
      service_id: service.id,
      service_name: service.name,
      date: body.date,
      isWeekend: isWeekend(body.date),
      calculatedPrice,
    });

    // ===========================================
    // STEP 3: Safety checks
    // ===========================================
    if (calculatedPrice < MIN_PRICE_PLN) {
      console.error('[admin/bookings] Price below minimum:', {
        calculatedPrice,
        minPrice: MIN_PRICE_PLN,
        service,
      });
      return NextResponse.json(
        { success: false, error: 'Błąd kalkulacji ceny' },
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
    // STEP 4: Validate booking slot
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
      service_type: service.name,
      duration_minutes: service.durationMinutes,
      price_pln: calculatedPrice,  // SERVER-CALCULATED
      date: body.date,
      time: body.time,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      email: body.email,
      notes: body.notes || null,
      status: body.status || 'confirmed',
    });

    console.log('[admin/bookings] Booking created:', {
      booking_id: booking.id,
      service: service.name,
      price_pln: calculatedPrice,
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
