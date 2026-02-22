'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { format, addDays, isWeekend, getDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  FileText,
  Loader2,
} from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Service, SiteSettings, OpeningHoursMap } from '@/types/site-settings';
import { JS_DAY_TO_KEY } from '@/types/site-settings';

interface ClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  acceptTerms?: string;
}

interface AvailabilityData {
  date: string;
  isBlocked: boolean;
  isClosed: boolean;
  availableSlots: string[];
}

const steps = [
  { id: 1, name: 'Usługa', icon: FileText },
  { id: 2, name: 'Data', icon: Calendar },
  { id: 3, name: 'Godzina', icon: Clock },
  { id: 4, name: 'Dane', icon: User },
  { id: 5, name: 'Potwierdzenie', icon: CheckCircle },
];

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '— zł';
  }
  return `${price} zł`;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientData, setClientData] = useState<ClientData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Settings and availability state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [availabilityCache, setAvailabilityCache] = useState<Record<string, AvailabilityData>>({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Fetch site settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        const data = await res.json();
        if (data.success) {
          setSiteSettings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Get active services
  const services: Service[] = useMemo(() => {
    if (!siteSettings?.services) {
      return [];
    }
    return siteSettings.services.filter((s) => s.isActive);
  }, [siteSettings]);

  // Check if a date is closed or blocked
  const isDateDisabled = useCallback((date: Date): { disabled: boolean; reason?: string } => {
    if (!siteSettings) return { disabled: false };

    const dayKey = JS_DAY_TO_KEY[getDay(date)];
    const daySettings = siteSettings.openingHours[dayKey as keyof OpeningHoursMap];

    // Check if day is closed
    if (daySettings?.closed) {
      return { disabled: true, reason: 'Zamknięte' };
    }

    // Check availability cache for blocked days
    const dateStr = format(date, 'yyyy-MM-dd');
    const cached = availabilityCache[dateStr];
    if (cached?.isBlocked) {
      return { disabled: true, reason: 'Zablokowane' };
    }

    return { disabled: false };
  }, [siteSettings, availabilityCache]);

  // Generate available dates (next 14 working days)
  const availableDates = useMemo(() => {
    if (!siteSettings) return [];

    const dates: Date[] = [];
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate = addDays(currentDate, 1); // Start from tomorrow

    while (dates.length < 21) { // Generate more to account for closed days
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    return dates.slice(0, 14); // Return first 14 dates
  }, [siteSettings]);

  // Pre-fetch availability for visible dates
  useEffect(() => {
    if (!availableDates.length || !selectedService) return;

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const fetchAvailability = async (dateStr: string, duration: number) => {
      if (availabilityCache[dateStr]) return;

      try {
        const res = await fetch(`/api/availability?date=${dateStr}&duration=${duration}`);
        const data = await res.json();
        if (data.success) {
          setAvailabilityCache(prev => ({
            ...prev,
            [dateStr]: data.data,
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch availability for ${dateStr}:`, error);
      }
    };

    // Fetch availability for all visible dates
    availableDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      fetchAvailability(dateStr, service.durationMinutes);
    });
  }, [availableDates, selectedService, services, availabilityCache]);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (!selectedDate || !selectedService) {
      setAvailableSlots([]);
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    // Check cache first
    const cached = availabilityCache[dateStr];
    if (cached) {
      setAvailableSlots(cached.availableSlots);
      return;
    }

    // Fetch from API
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/availability?date=${dateStr}&duration=${service.durationMinutes}`);
        const data = await res.json();
        if (data.success) {
          setAvailabilityCache(prev => ({
            ...prev,
            [dateStr]: data.data,
          }));
          setAvailableSlots(data.data.availableSlots);
        }
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedService, services, availabilityCache]);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const getPrice = () => {
    if (!selectedServiceData || !selectedDate) return 0;
    const weekend = isWeekend(selectedDate);
    if (weekend && selectedServiceData.priceWeekend !== null) {
      return selectedServiceData.priceWeekend;
    }
    return selectedServiceData.priceWeekday;
  };

  // Filter services based on selected date (no consultation on weekends)
  const availableServices = useMemo(() => {
    if (!selectedDate) return services;
    const weekend = isWeekend(selectedDate);
    if (weekend) {
      return services.filter((s) => s.priceWeekend !== null);
    }
    return services;
  }, [selectedDate, services]);

  const validateClientData = (): boolean => {
    const newErrors: FormErrors = {};

    if (!clientData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    if (!clientData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }
    if (!clientData.phone.trim()) {
      newErrors.phone = 'Numer telefonu jest wymagany';
    } else if (!/^(\+48)?[0-9]{9}$/.test(clientData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Nieprawidłowy numer telefonu';
    }
    if (!clientData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors.email = 'Nieprawidłowy adres email';
    }
    if (!clientData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zapoznać się z Regulaminem i Polityką Prywatności';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 4) {
      if (!validateClientData()) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: selectedServiceData.name,
          duration_minutes: selectedServiceData.durationMinutes,
          price_pln: getPrice(),
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          first_name: clientData.firstName,
          last_name: clientData.lastName,
          phone: clientData.phone,
          email: clientData.email,
          notes: clientData.notes || null,
          status: 'confirmed',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsBooked(true);
      } else {
        setBookingError(data.error || 'Wystąpił błąd podczas rezerwacji');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError('Wystąpił błąd podczas rezerwacji. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== null && !isDateDisabled(selectedDate).disabled;
      case 3:
        return selectedTime !== null;
      case 4:
        return clientData.firstName && clientData.lastName && clientData.phone && clientData.email && clientData.acceptTerms;
      default:
        return true;
    }
  };

  if (settingsLoading) {
    return (
      <section className="py-16 lg:py-24">
        <Container size="sm">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-4" />
            <p className="text-gray-500">Ładowanie...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (isBooked) {
    return (
      <section className="py-16 lg:py-24">
        <Container size="sm">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Rezerwacja potwierdzona!</h1>
              <p className="text-gray-600 mb-6">
                Dziękujemy za rezerwację. Potwierdzenie zostało wysłane na adres {clientData.email}
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-[#0F172A] mb-3">Szczegóły wizyty:</h3>
                <p className="text-gray-600">
                  <strong>Usługa:</strong> {selectedServiceData?.name}
                </p>
                <p className="text-gray-600">
                  <strong>Data:</strong> {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: pl })}
                </p>
                <p className="text-gray-600">
                  <strong>Godzina:</strong> {selectedTime}
                </p>
                <p className="text-gray-600">
                  <strong>Cena:</strong> {formatPrice(getPrice())}
                </p>
              </div>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Zarezerwuj kolejną wizytę
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-12 lg:py-16">
        <Container>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Rezerwacja wizyty</h1>
          <p className="text-gray-300">Zarezerwuj wizytę w kilku prostych krokach</p>
        </Container>
      </section>

      {/* Steps Indicator */}
      <section className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <Container>
          <div className="py-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px]">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      currentStep === step.id && 'bg-[#2563EB]/10',
                      currentStep > step.id && 'text-green-600'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        currentStep === step.id && 'bg-[#2563EB] text-white',
                        currentStep > step.id && 'bg-green-100 text-green-600',
                        currentStep < step.id && 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium hidden sm:block',
                        currentStep === step.id && 'text-[#2563EB]',
                        currentStep > step.id && 'text-green-600',
                        currentStep < step.id && 'text-gray-400'
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-8 lg:w-16 h-0.5 mx-2',
                        currentStep > step.id ? 'bg-green-300' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Step Content */}
      <section className="py-8 lg:py-12">
        <Container size="md">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Wybierz usługę</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    variant="bordered"
                    padding="none"
                    hover
                    className={cn(
                      'cursor-pointer transition-all',
                      selectedService === service.id && 'ring-2 ring-[#2563EB] border-[#2563EB]'
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-[#0F172A]">{service.name}</h3>
                            {service.showDuration && (
                              <span className="text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-full">
                                {service.durationMinutes} min
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-[#0F172A]">
                            {formatPrice(service.priceWeekday)}
                          </p>
                          {service.priceWeekend !== null && (
                            <p className="text-xs text-gray-500">
                              weekend: {formatPrice(service.priceWeekend)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Wybierz datę</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableDates.map((date) => {
                  const dayName = format(date, 'EEEE', { locale: pl });
                  const dayNum = format(date, 'd');
                  const month = format(date, 'MMM', { locale: pl });
                  const isSelected = selectedDate?.getTime() === date.getTime();
                  const weekend = isWeekend(date);
                  const { disabled, reason } = isDateDisabled(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        if (!disabled) {
                          setSelectedDate(date);
                          setSelectedTime(null); // Reset time when date changes
                        }
                      }}
                      disabled={disabled}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        disabled
                          ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'border-[#2563EB] bg-[#2563EB]/5'
                            : 'border-gray-200 hover:border-gray-300',
                        weekend && !disabled && 'bg-amber-50'
                      )}
                    >
                      <p className="text-xs text-gray-500 capitalize mb-1">{dayName}</p>
                      <p className={cn(
                        'text-2xl font-bold',
                        disabled ? 'text-gray-400' : 'text-[#0F172A]'
                      )}>{dayNum}</p>
                      <p className="text-sm text-gray-500">{month}</p>
                      {disabled && reason && (
                        <span className="text-xs text-red-500 font-medium">{reason}</span>
                      )}
                      {!disabled && weekend && (
                        <span className="text-xs text-amber-600 font-medium">weekend</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedDate && selectedServiceData?.priceWeekend === null && isWeekend(selectedDate) && (
                <p className="mt-4 text-amber-600 text-sm">
                  Uwaga: Konsultacje nie są dostępne w weekendy. Proszę wybrać inny dzień lub usługę.
                </p>
              )}
            </div>
          )}

          {/* Step 3: Time Selection */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Wybierz godzinę</h2>
              <p className="text-gray-500 mb-6">
                {selectedDate && format(selectedDate, 'd MMMM yyyy (EEEE)', { locale: pl })}
              </p>
              {slotsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-4" />
                  <p className="text-gray-500">Sprawdzam dostępność...</p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'py-3 px-4 rounded-lg border-2 font-medium transition-all',
                        selectedTime === time
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-gray-200 hover:border-[#2563EB] text-[#0F172A]'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <Card variant="bordered" className="text-center py-8">
                  <CardContent>
                    <p className="text-gray-500">Brak dostępnych terminów w wybranym dniu.</p>
                    <button
                      onClick={handleBack}
                      className="mt-4 text-[#2563EB] font-medium hover:underline"
                    >
                      Wybierz inną datę
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Client Data */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Twoje dane</h2>
              <Card variant="bordered">
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię *
                      </label>
                      <input
                        type="text"
                        value={clientData.firstName}
                        onChange={(e) => setClientData({ ...clientData, firstName: e.target.value })}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all',
                          errors.firstName ? 'border-red-500' : 'border-gray-200'
                        )}
                        placeholder="Jan"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwisko *
                      </label>
                      <input
                        type="text"
                        value={clientData.lastName}
                        onChange={(e) => setClientData({ ...clientData, lastName: e.target.value })}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all',
                          errors.lastName ? 'border-red-500' : 'border-gray-200'
                        )}
                        placeholder="Kowalski"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        value={clientData.phone}
                        onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all',
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        )}
                        placeholder="+48 123 456 789"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all',
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        )}
                        placeholder="jan@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Uwagi (opcjonalnie)
                      </label>
                      <textarea
                        value={clientData.notes}
                        onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all resize-none"
                        placeholder="Dodatkowe informacje o wizycie..."
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <label className={cn(
                        'flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all',
                        clientData.acceptTerms
                          ? 'border-[#2563EB] bg-[#2563EB]/5'
                          : errors.acceptTerms
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                      )}>
                        <input
                          type="checkbox"
                          checked={clientData.acceptTerms}
                          onChange={(e) => setClientData({ ...clientData, acceptTerms: e.target.checked })}
                          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          Zapoznałem/am się z{' '}
                          <a
                            href="/regulamin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Regulaminem
                          </a>
                          {' '}i{' '}
                          <a
                            href="/polityka-prywatnosci"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Polityką Prywatności
                          </a>
                          {' '}i akceptuję ich postanowienia *
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="mt-2 text-sm text-red-500">{errors.acceptTerms}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Podsumowanie</h2>
              <Card variant="bordered">
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Usługa</span>
                      <span className="font-medium text-[#0F172A]">
                        {selectedServiceData?.name}
                        {selectedServiceData?.showDuration && ` (${selectedServiceData?.durationMinutes} min)`}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Data</span>
                      <span className="font-medium text-[#0F172A]">
                        {selectedDate && format(selectedDate, 'd MMMM yyyy (EEEE)', { locale: pl })}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Godzina</span>
                      <span className="font-medium text-[#0F172A]">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Imię i nazwisko</span>
                      <span className="font-medium text-[#0F172A]">
                        {clientData.firstName} {clientData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Telefon</span>
                      <span className="font-medium text-[#0F172A]">{clientData.phone}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-[#0F172A]">{clientData.email}</span>
                    </div>
                    {clientData.notes && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Uwagi</span>
                        <span className="font-medium text-[#0F172A] text-right max-w-xs">
                          {clientData.notes}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-4 bg-gray-50 -mx-6 px-6 rounded-lg mt-4">
                      <span className="text-lg font-semibold text-[#0F172A]">Do zapłaty</span>
                      <span className="text-2xl font-bold text-[#2563EB]">{formatPrice(getPrice())}</span>
                    </div>
                  </div>
                  {bookingError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{bookingError}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'invisible' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wstecz
            </Button>

            {currentStep < 5 ? (
              <Button variant="primary" onClick={handleNext} disabled={!canProceed()}>
                Dalej
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="min-w-[200px]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Potwierdź rezerwację
              </Button>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
