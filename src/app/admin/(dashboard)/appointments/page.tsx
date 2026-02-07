'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-auth';
import { Booking, BookingStatus } from '@/types/admin';
import { format, addDays, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  User,
} from 'lucide-react';

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Potwierdzona',
  cancelled: 'Anulowana',
  completed: 'Zakończona',
  no_show: 'Nieobecność',
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  no_show: 'bg-orange-100 text-orange-700',
};

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFrom, dateTo]);

  const fetchBookings = async () => {
    setIsLoading(true);
    const supabase = createBrowserSupabaseClient();

    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .gte('date', dateFrom)
        .lte('date', dateTo)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings((data as Booking[]) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdating(true);
    const supabase = createBrowserSupabaseClient();

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Wystąpił błąd podczas aktualizacji');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.first_name.toLowerCase().includes(query) ||
      booking.last_name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.includes(query) ||
      booking.service_type.toLowerCase().includes(query)
    );
  });

  const formatTime = (time: string) => time.substring(0, 5);
  const formatPrice = (priceInGroszy: number) => `${(priceInGroszy / 100).toFixed(0)} zł`;

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Wizyty</h1>
          <p className="text-gray-500 mt-1">Zarządzaj wszystkimi rezerwacjami</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj klienta..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="confirmed">Potwierdzone</option>
              <option value="completed">Zakończone</option>
              <option value="cancelled">Anulowane</option>
              <option value="no_show">Nieobecności</option>
            </select>
          </div>

          {/* Date from */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
          </div>

          {/* Date to */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Brak wizyt spełniających kryteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Data i czas</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Klient</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Usługa</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Cena</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {format(new Date(booking.date), 'd MMM yyyy', { locale: pl })}
                        </p>
                        <p className="text-sm text-gray-500">{formatTime(booking.time)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {booking.first_name} {booking.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-[#0F172A]">{booking.service_type}</p>
                        <p className="text-sm text-gray-500">{booking.duration_minutes} min</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-[#0F172A]">{formatPrice(booking.price_pln)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openBookingDetails(booking)}
                        className="text-[#2563EB] hover:underline text-sm font-medium"
                      >
                        Szczegóły
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 text-center">
          Wyświetlono {filteredBookings.length} z {bookings.length} wizyt
        </p>
      )}

      {/* Booking details modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">Szczegóły wizyty</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedBooking.status]}`}>
                  {STATUS_LABELS[selectedBooking.status]}
                </span>
              </div>

              {/* Date and time */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A]">
                    {format(new Date(selectedBooking.date), "EEEE, d MMMM yyyy", { locale: pl })}
                  </p>
                  <p className="text-gray-500">{formatTime(selectedBooking.time)} • {selectedBooking.duration_minutes} min</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A]">{selectedBooking.service_type}</p>
                  <p className="text-gray-500">{formatPrice(selectedBooking.price_pln)}</p>
                </div>
              </div>

              {/* Client info */}
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

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Notatki</p>
                  <p className="text-[#0F172A] bg-gray-50 rounded-lg p-4">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedBooking.status === 'confirmed' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                    disabled={isUpdating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Oznacz jako zakończona
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                    disabled={isUpdating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                    Anuluj wizytę
                  </button>
                </div>
              )}

              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => updateBookingStatus(selectedBooking.id, 'no_show')}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
                  Klient nie pojawił się
                </button>
              )}

              {/* Created at */}
              <p className="text-sm text-gray-400 text-center">
                Utworzono: {format(new Date(selectedBooking.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
