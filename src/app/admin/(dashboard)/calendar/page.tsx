'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { List, Loader2 } from 'lucide-react';

// Dynamically import the calendar component to avoid SSR issues with FullCalendar
const BookingCalendar = dynamic(
  () => import('@/components/admin/BookingCalendar'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    ),
  }
);

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Kalendarz</h1>
          <p className="text-gray-500 mt-1">Zarządzaj wizytami w widoku kalendarza</p>
        </div>
        <Link
          href="/admin/appointments"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <List className="w-5 h-5" />
          Widok listy
        </Link>
      </div>

      {/* Calendar component */}
      <BookingCalendar />
    </div>
  );
}
