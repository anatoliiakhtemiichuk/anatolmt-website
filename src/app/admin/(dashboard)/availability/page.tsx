'use client';

import { useState, useEffect } from 'react';
import { BlockedSlot } from '@/types/admin';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  CalendarOff,
  Plus,
  X,
  Trash2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function AvailabilityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    is_full_day: true,
    time_start: '09:00',
    time_end: '17:00',
    reason: '',
  });

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const fetchBlockedSlots = async () => {
    try {
      const response = await fetch(`/api/admin/blocked-slots?date_from=${format(new Date(), 'yyyy-MM-dd')}`);
      const result = await response.json();

      if (result.success) {
        setBlockedSlots(result.data);
      }
    } catch (error) {
      console.error('Error fetching blocked slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          is_full_day: formData.is_full_day,
          time_start: formData.is_full_day ? null : formData.time_start,
          time_end: formData.is_full_day ? null : formData.time_end,
          reason: formData.reason || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchBlockedSlots();
        setIsModalOpen(false);
        setFormData({
          date: format(new Date(), 'yyyy-MM-dd'),
          is_full_day: true,
          time_start: '09:00',
          time_end: '17:00',
          reason: '',
        });
      } else {
        alert(result.error || 'Wystąpił błąd podczas zapisywania');
      }
    } catch (error) {
      console.error('Error creating blocked slot:', error);
      alert('Wystąpił błąd podczas zapisywania');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę blokadę?')) return;

    try {
      const response = await fetch(`/api/admin/blocked-slots/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setBlockedSlots(blockedSlots.filter(slot => slot.id !== id));
      } else {
        alert(result.error || 'Wystąpił błąd podczas usuwania');
      }
    } catch (error) {
      console.error('Error deleting blocked slot:', error);
      alert('Wystąpił błąd podczas usuwania');
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const isDateBlocked = (date: Date) => {
    return blockedSlots.some(slot =>
      isSameDay(new Date(slot.date), date) && slot.is_full_day
    );
  };

  const getBlockedSlotsForDate = (date: Date) => {
    return blockedSlots.filter(slot => isSameDay(new Date(slot.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const selectDateFromCalendar = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
    }));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Dostępność</h1>
          <p className="text-gray-500 mt-1">Zarządzaj zablokowanymi terminami</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Zablokuj termin
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#0F172A]">
              {format(currentMonth, 'LLLL yyyy', { locale: pl })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 mb-2">
            {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Padding for first week */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {daysInMonth.map(day => {
              const isBlocked = isDateBlocked(day);
              const hasSlots = getBlockedSlotsForDate(day).length > 0;
              const isPastDay = isPast(day) && !isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !isPastDay && selectDateFromCalendar(day)}
                  disabled={isPastDay}
                  className={`aspect-square rounded-lg text-sm font-medium relative transition-colors ${
                    isToday(day)
                      ? 'bg-[#2563EB] text-white'
                      : isBlocked
                      ? 'bg-red-100 text-red-700'
                      : hasSlots
                      ? 'bg-orange-100 text-orange-700'
                      : isPastDay
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                  {hasSlots && !isBlocked && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#2563EB] rounded" />
              <span className="text-gray-600">Dzisiaj</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded" />
              <span className="text-gray-600">Cały dzień zablokowany</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 rounded" />
              <span className="text-gray-600">Częściowo zablokowany</span>
            </div>
          </div>
        </div>

        {/* Blocked slots list */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F172A]">Zablokowane terminy</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            </div>
          ) : blockedSlots.length === 0 ? (
            <div className="text-center py-20">
              <CalendarOff className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Brak zablokowanych terminów</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {blockedSlots.map((slot) => (
                <div key={slot.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        slot.is_full_day ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        {slot.is_full_day ? (
                          <CalendarOff className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {format(new Date(slot.date), 'EEEE, d MMMM yyyy', { locale: pl })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {slot.is_full_day
                            ? 'Cały dzień zablokowany'
                            : `${slot.time_start?.substring(0, 5)} - ${slot.time_end?.substring(0, 5)}`}
                        </p>
                        {slot.reason && (
                          <p className="text-sm text-gray-400 mt-1">{slot.reason}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add blocked slot modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">Zablokuj termin</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Full day toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Zablokuj cały dzień</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_full_day: !prev.is_full_day }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_full_day ? 'bg-[#2563EB]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_full_day ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time range (if not full day) */}
              {!formData.is_full_day && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Od
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.time_start}
                        onChange={(e) => setFormData(prev => ({ ...prev, time_start: e.target.value }))}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Do
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.time_end}
                        onChange={(e) => setFormData(prev => ({ ...prev, time_end: e.target.value }))}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Powód (opcjonalnie)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="np. Urlop, Święto, Konferencja..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    'Zapisz blokadę'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
