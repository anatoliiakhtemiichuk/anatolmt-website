/**
 * Admin Booking by ID API
 * GET /api/admin/bookings/[id] - Get booking details
 * PATCH /api/admin/bookings/[id] - Update booking (with slot validation for reschedule)
 * DELETE /api/admin/bookings/[id] - Delete booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking, validateBookingSlot } from '@/lib/admin-data';
import { UpdateBookingData } from '@/types/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Rezerwacja nie istnieje' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania rezerwacji' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateBookingData = await request.json();

    // Only allow updating specific fields
    const allowedFields: (keyof UpdateBookingData)[] = ['status', 'date', 'time', 'notes'];
    const updateData: Partial<UpdateBookingData> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Brak danych do aktualizacji' },
        { status: 400 }
      );
    }

    // Get current booking to check duration and validate reschedule
    const currentBooking = await getBookingById(id);
    if (!currentBooking) {
      return NextResponse.json(
        { success: false, error: 'Rezerwacja nie istnieje' },
        { status: 404 }
      );
    }

    // If date or time is being changed, validate the new slot
    if (updateData.date || updateData.time) {
      const newDate = updateData.date || currentBooking.date;
      const newTime = updateData.time || currentBooking.time;

      // Only validate if actual change
      if (newDate !== currentBooking.date || newTime !== currentBooking.time) {
        // Validate the new slot (exclude current booking from collision check)
        const validation = await validateBookingSlot(
          newDate,
          newTime,
          currentBooking.duration_minutes,
          id // exclude this booking from collision check
        );

        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: validation.error || 'Termin jest niedostępny' },
            { status: 409 }
          );
        }
      }
    }

    const booking = await updateBooking(id, updateData);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Nie udało się zaktualizować rezerwacji' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas aktualizacji rezerwacji' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteBooking(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Rezerwacja nie istnieje' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rezerwacja została usunięta',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas usuwania rezerwacji' },
      { status: 500 }
    );
  }
}
