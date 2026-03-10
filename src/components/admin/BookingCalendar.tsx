'use client';

import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventDropArg, EventClickArg } from '@fullcalendar/core';
import { Booking, BookingStatus } from '@/types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  GripVertical,
} from 'lucide-react';

// Buffer time between appointments (must match server constant)
const BUFFER_MINUTES = 20;

// Status colors for calendar events
const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string }> = {
  confirmed: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF' },
  cancelled: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
  completed: { bg: '#DCFCE7', border: '#16A34A', text: '#166534' },
  no_show: { bg: '#FFEDD5', border: '#EA580C', text: '#9A3412' },
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Potwierdzona',
  cancelled: 'Anulowana',
  completed: 'Zakończona',
  no_show: 'Nieobecność',
};

// Calculate end time of service
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Calculate blocked until time (service + buffer)
const calculateBlockedUntil = (startTime: string, durationMinutes: number): string => {
  return calculateEndTime(startTime, durationMinutes + BUFFER_MINUTES);
};

interface BookingCalendarProps {
  onBookingUpdate?: () => void;
}

export default function BookingCalendar({ onBookingUpdate }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      // Fetch a wide date range for calendar view
      const today = new Date();
      const dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const dateTo = new Date(today.getFullYear(), today.getMonth() + 3, 0);

      const params = new URLSearchParams({
        date_from: format(dateFrom, 'yyyy-MM-dd'),
        date_to: format(dateTo, 'yyyy-MM-dd'),
      });

      const response = await fetch(`/api/admin/bookings?${params}`);
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Nie udało się pobrać rezerwacji');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Convert bookings to FullCalendar events
  const events: EventInput[] = bookings.map((booking) => {
    const colors = STATUS_COLORS[booking.status];
    const endTime = calculateEndTime(booking.time, booking.duration_minutes);

    return {
      id: booking.id,
      title: `${booking.first_name} ${booking.last_name}`,
      start: `${booking.date}T${booking.time}`,
      end: `${booking.date}T${endTime}`,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        booking,
      },
    };
  });

  // Handle event click (open details modal)
  const handleEventClick = (info: EventClickArg) => {
    const booking = info.event.extendedProps.booking as Booking;
    setSelectedBooking(booking);
    setEditDate(booking.date);
    setEditTime(booking.time);
    setIsEditMode(false);
    setIsModalOpen(true);
    setError(null);
  };

  // Handle event drop (drag and drop reschedule)
  const handleEventDrop = async (info: EventDropArg) => {
    const booking = info.event.extendedProps.booking as Booking;
    const newDate = format(info.event.start!, 'yyyy-MM-dd');
    const newTime = format(info.event.start!, 'HH:mm');

    // Don't allow rescheduling cancelled or completed bookings
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      info.revert();
      setError('Nie można przenieść zakończonej lub anulowanej wizyty');
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      const result = await response.json();

      if (!result.success) {
        info.revert();
        setError(result.error || 'Nie udało się przenieść wizyty');
        return;
      }

      // Update local state
      setBookings(bookings.map(b =>
        b.id === booking.id ? { ...b, date: newDate, time: newTime } : b
      ));
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      info.revert();
      setError('Wystąpił błąd podczas przenoszenia wizyty');
    }
  };

  // Handle manual date/time edit
  const handleSaveEdit = async () => {
    if (!selectedBooking) return;

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: editDate, time: editTime }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Nie udało się zaktualizować wizyty');
        return;
      }

      // Update local state
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id ? { ...b, date: editDate, time: editTime } : b
      ));
      setSelectedBooking({ ...selectedBooking, date: editDate, time: editTime });
      setIsEditMode(false);
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Wystąpił błąd podczas aktualizacji wizyty');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle status update
  const updateBookingStatus = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return;

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Nie udało się zaktualizować statusu');
        return;
      }

      // Update local state
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id ? { ...b, status: newStatus } : b
      ));
      setSelectedBooking({ ...selectedBooking, status: newStatus });
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Wystąpił błąd podczas aktualizacji statusu');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (pricePln: number) => `${pricePln} zł`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag hint */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <GripVertical className="w-5 h-5 flex-shrink-0" />
        <span>Przeciągnij wizytę, aby zmienić jej termin. Kliknij, aby zobaczyć szczegóły.</span>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          locale="pl"
          firstDay={1}
          slotMinTime="08:00:00"
          slotMaxTime="23:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          events={events}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
          buttonText={{
            today: 'Dziś',
            month: 'Miesiąc',
            week: 'Tydzień',
            day: 'Dzień',
          }}
          eventContent={(eventInfo) => {
            const booking = eventInfo.event.extendedProps.booking as Booking;
            return (
              <div className="p-1 overflow-hidden cursor-pointer">
                <div className="font-medium text-xs truncate">
                  {booking.first_name} {booking.last_name}
                </div>
                <div className="text-xs opacity-75 truncate">
                  {booking.service_type}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {(Object.keys(STATUS_COLORS) as BookingStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: STATUS_COLORS[status].bg,
                borderWidth: 2,
                borderColor: STATUS_COLORS[status].border,
              }}
            />
            <span className="text-gray-600">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>

      {/* Booking details modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isEditMode ? 'Edytuj termin' : 'Szczegóły wizyty'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setError(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Error in modal */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className="inline-flex px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: STATUS_COLORS[selectedBooking.status].bg,
                    color: STATUS_COLORS[selectedBooking.status].text,
                  }}
                >
                  {STATUS_LABELS[selectedBooking.status]}
                </span>
              </div>

              {/* Date and time - editable or display */}
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Godzina</label>
                    <input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      Zapisz zmiany
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setEditDate(selectedBooking.date);
                        setEditTime(selectedBooking.time);
                        setError(null);
                      }}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        {format(new Date(selectedBooking.date), "EEEE, d MMMM yyyy", { locale: pl })}
                      </p>
                      <p className="text-gray-500">
                        {selectedBooking.time.substring(0, 5)} – {calculateEndTime(selectedBooking.time, selectedBooking.duration_minutes)} • {selectedBooking.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  {/* Edit date/time button (only for confirmed bookings) */}
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Clock className="w-5 h-5" />
                      Zmień termin
                    </button>
                  )}
                </>
              )}

              {/* Buffer info */}
              {!isEditMode && (
                <div className="flex items-center gap-4 bg-amber-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Bufor między wizytami</p>
                    <p className="text-sm text-amber-600">
                      +{BUFFER_MINUTES} min • Zablokowane do {calculateBlockedUntil(selectedBooking.time, selectedBooking.duration_minutes)}
                    </p>
                  </div>
                </div>
              )}

              {/* Service */}
              {!isEditMode && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">{selectedBooking.service_type}</p>
                    <p className="text-gray-500">{formatPrice(selectedBooking.price_pln)}</p>
                  </div>
                </div>
              )}

              {/* Client info */}
              {!isEditMode && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-[#0F172A]">{selectedBooking.first_name} {selectedBooking.last_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${selectedBooking.phone}`} className="text-[#2563EB] hover:underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${selectedBooking.email}`} className="text-[#2563EB] hover:underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Notes */}
              {!isEditMode && selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Notatki</p>
                  <p className="text-[#0F172A] bg-gray-50 rounded-lg p-4">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Status actions */}
              {!isEditMode && selectedBooking.status === 'confirmed' && (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => updateBookingStatus('completed')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      Zakończona
                    </button>
                    <button
                      onClick={() => updateBookingStatus('cancelled')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      Anuluj
                    </button>
                  </div>
                  <button
                    onClick={() => updateBookingStatus('no_show')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
                    Nieobecność
                  </button>
                </>
              )}

              {/* Created at */}
              {!isEditMode && (
                <p className="text-sm text-gray-400 text-center">
                  Utworzono: {format(new Date(selectedBooking.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
