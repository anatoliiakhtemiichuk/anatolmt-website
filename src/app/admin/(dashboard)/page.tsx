'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Booking, DashboardStats } from '@/types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Calendar,
  CalendarDays,
  Users,
  TrendingUp,
  Clock,
  Phone,
  ArrowRight,
  Loader2,
  CalendarPlus,
  CalendarOff,
} from 'lucide-react';

interface DashboardData {
  stats: DashboardStats;
  todayAppointments: Booking[];
  upcomingAppointments: Booking[];
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    stats: {
      todayBookings: 0,
      weekBookings: 0,
      monthRevenue: 0,
      totalClients: 0,
    },
    todayAppointments: [],
    upcomingAppointments: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  // Price is stored in PLN (not grosze) - standardized across all admin pages
  const formatPrice = (pricePln: number) => {
    return `${pricePln} zł`;
  };

  // Buffer time between appointments
  const BUFFER_MINUTES = 20;

  // Calculate blocked until time (service + buffer)
  const calculateBlockedUntil = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes + BUFFER_MINUTES;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: pl })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dziś</p>
              <p className="text-2xl font-bold text-[#0F172A]">{data.stats.todayBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ten tydzień</p>
              <p className="text-2xl font-bold text-[#0F172A]">{data.stats.weekBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Przychód (miesiąc)</p>
              <p className="text-2xl font-bold text-[#0F172A]">{formatPrice(data.stats.monthRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Klienci</p>
              <p className="text-2xl font-bold text-[#0F172A]">{data.stats.totalClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/appointments"
          className="bg-[#2563EB] text-white rounded-xl p-6 flex items-center justify-between hover:bg-[#1D4ED8] transition-colors"
        >
          <div className="flex items-center gap-4">
            <CalendarPlus className="w-6 h-6" />
            <div>
              <p className="font-semibold">Zobacz wszystkie wizyty</p>
              <p className="text-white/70 text-sm">Zarządzaj rezerwacjami</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/admin/availability"
          className="bg-[#0F172A] text-white rounded-xl p-6 flex items-center justify-between hover:bg-[#1E293B] transition-colors"
        >
          <div className="flex items-center gap-4">
            <CalendarOff className="w-6 h-6" />
            <div>
              <p className="font-semibold">Zarządzaj dostępnością</p>
              <p className="text-white/70 text-sm">Blokuj terminy</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F172A]">Dzisiejsze wizyty</h2>
            <Link
              href="/admin/appointments"
              className="text-sm text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Zobacz wszystkie <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {data.todayAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Brak wizyt na dziś</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.todayAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {formatTime(appointment.time)} - {appointment.first_name} {appointment.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.service_type} • Do {calculateBlockedUntil(appointment.time, appointment.duration_minutes)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{appointment.phone}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0F172A]">
                      {formatPrice(appointment.price_pln)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F172A]">Nadchodzące wizyty</h2>
            <span className="text-sm text-gray-500">Następne 7 dni</span>
          </div>

          {data.upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Brak zaplanowanych wizyt</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        {appointment.first_name} {appointment.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.service_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0F172A]">
                        {format(new Date(appointment.date), 'd MMM', { locale: pl })}
                      </p>
                      <p className="text-sm text-gray-500">{formatTime(appointment.time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
