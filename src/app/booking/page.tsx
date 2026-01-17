'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Service types with pricing
const services = [
  {
    id: 'consultation',
    name: 'Konsultacja',
    duration: 30,
    priceWeekday: 50,
    priceWeekend: null, // Not available on weekends
    description: 'Wstępna konsultacja i ocena potrzeb',
  },
  {
    id: 'visit-1h',
    name: 'Wizyta 1h',
    duration: 60,
    priceWeekday: 200,
    priceWeekend: 250,
    description: 'Standardowa sesja terapii manualnej',
  },
  {
    id: 'visit-1.5h',
    name: 'Wizyta 1.5h',
    duration: 90,
    priceWeekday: 250,
    priceWeekend: 300,
    description: 'Rozszerzona sesja terapii',
  },
];

// Opening hours by day of week (0 = Sunday, 1 = Monday, etc.)
const openingHours: Record<number, { start: string; end: string } | null> = {
  0: { start: '11:00', end: '15:00' }, // Sunday
  1: null, // Monday - closed
  2: { start: '11:00', end: '22:00' }, // Tuesday
  3: { start: '11:00', end: '22:00' }, // Wednesday
  4: { start: '11:00', end: '22:00' }, // Thursday
  5: { start: '11:00', end: '22:00' }, // Friday
  6: { start: '10:00', end: '18:00' }, // Saturday
};

// Generate mock time slots
const generateTimeSlots = (date: Date, duration: number): string[] => {
  const dayOfWeek = getDay(date);
  const hours = openingHours[dayOfWeek];

  if (!hours) return [];

  const slots: string[] = [];
  const [startHour, startMin] = hours.start.split(':').map(Number);
  const [endHour, endMin] = hours.end.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    // Check if slot + duration fits before closing
    const slotEndMin = currentMin + duration;
    const slotEndHour = currentHour + Math.floor(slotEndMin / 60);
    const slotEndMinutes = slotEndMin % 60;

    if (slotEndHour < endHour || (slotEndHour === endHour && slotEndMinutes <= endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

      // Mock: randomly mark some slots as unavailable
      const isAvailable = Math.random() > 0.3;
      if (isAvailable) {
        slots.push(timeStr);
      }
    }

    // Move to next 30-minute slot
    currentMin += 30;
    if (currentMin >= 60) {
      currentHour += 1;
      currentMin = 0;
    }
  }

  return slots;
};

// Generate next 14 available days
const generateAvailableDates = (): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Start from tomorrow
  currentDate = addDays(currentDate, 1);

  while (dates.length < 14) {
    const dayOfWeek = getDay(currentDate);
    // Skip Mondays (closed)
    if (dayOfWeek !== 1) {
      dates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

interface ClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

const steps = [
  { id: 1, name: 'Usługa', icon: FileText },
  { id: 2, name: 'Data', icon: Calendar },
  { id: 3, name: 'Godzina', icon: Clock },
  { id: 4, name: 'Dane', icon: User },
  { id: 5, name: 'Potwierdzenie', icon: CheckCircle },
];

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
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const availableDates = useMemo(() => generateAvailableDates(), []);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedService) return [];
    const service = services.find((s) => s.id === selectedService);
    if (!service) return [];
    return generateTimeSlots(selectedDate, service.duration);
  }, [selectedDate, selectedService]);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const getPrice = () => {
    if (!selectedServiceData || !selectedDate) return 0;
    const weekend = isWeekend(selectedDate);
    if (weekend && selectedServiceData.priceWeekend) {
      return selectedServiceData.priceWeekend;
    }
    return selectedServiceData.priceWeekday;
  };

  // Filter services based on selected date
  const availableServices = useMemo(() => {
    if (!selectedDate) return services;
    const weekend = isWeekend(selectedDate);
    if (weekend) {
      return services.filter((s) => s.priceWeekend !== null);
    }
    return services;
  }, [selectedDate]);

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
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsBooked(true);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== null;
      case 3:
        return selectedTime !== null;
      case 4:
        return clientData.firstName && clientData.lastName && clientData.phone && clientData.email;
      default:
        return true;
    }
  };

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
                  <strong>Cena:</strong> {getPrice()} zł
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
                            <span className="text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-full">
                              {service.duration} min
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-[#0F172A]">
                            {service.priceWeekday} zł
                          </p>
                          {service.priceWeekend && (
                            <p className="text-xs text-gray-500">
                              weekend: {service.priceWeekend} zł
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

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null); // Reset time when date changes
                      }}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB]/5'
                          : 'border-gray-200 hover:border-gray-300',
                        weekend && 'bg-amber-50'
                      )}
                    >
                      <p className="text-xs text-gray-500 capitalize mb-1">{dayName}</p>
                      <p className="text-2xl font-bold text-[#0F172A]">{dayNum}</p>
                      <p className="text-sm text-gray-500">{month}</p>
                      {weekend && (
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
              {availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableTimeSlots.map((time) => (
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
                        {selectedServiceData?.name} ({selectedServiceData?.duration} min)
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
                      <span className="text-2xl font-bold text-[#2563EB]">{getPrice()} zł</span>
                    </div>
                  </div>
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
