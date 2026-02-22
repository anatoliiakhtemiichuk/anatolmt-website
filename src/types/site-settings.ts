/**
 * Site Settings Types
 * Comprehensive types for site-wide settings management
 */

// Service definition with individual pricing
export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  showDuration: boolean; // false for consultation
  priceWeekday: number;
  priceWeekend: number | null; // null = not available on weekends
  isActive: boolean;
}

// Opening hours per day
export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface OpeningHoursMap {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

// Contact information
export interface ContactSettings {
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

// Site texts (hero, about, etc.)
export interface SiteTexts {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  bookingInfoText: string;
  footerText: string;
}

// Booking configuration
export interface BookingConfig {
  bufferMinutes: number;
}

// Complete site settings
export interface SiteSettings {
  services: Service[];
  openingHours: OpeningHoursMap;
  contact: ContactSettings;
  texts: SiteTexts;
  booking: BookingConfig;
  updatedAt: string;
}

// Day names in Polish
export const DAY_NAMES_PL: Record<keyof OpeningHoursMap, string> = {
  mon: 'Poniedziałek',
  tue: 'Wtorek',
  wed: 'Środa',
  thu: 'Czwartek',
  fri: 'Piątek',
  sat: 'Sobota',
  sun: 'Niedziela',
};

// Day order for display
export const DAY_ORDER: (keyof OpeningHoursMap)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// Map JS Date.getDay() to our day keys
export const JS_DAY_TO_KEY: Record<number, keyof OpeningHoursMap> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

// Default settings
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  services: [
    {
      id: 'consultation',
      slug: 'konsultacja',
      name: 'Konsultacja',
      description: 'Wstępna konsultacja i ocena potrzeb terapeutycznych',
      durationMinutes: 20,
      showDuration: false,
      priceWeekday: 50,
      priceWeekend: null,
      isActive: true,
    },
    {
      id: 'visit_60',
      slug: 'wizyta-1h',
      name: 'Wizyta standardowa',
      description: 'Pełna sesja terapii manualnej',
      durationMinutes: 60,
      showDuration: true,
      priceWeekday: 200,
      priceWeekend: 250,
      isActive: true,
    },
    {
      id: 'visit_90',
      slug: 'wizyta-1.5h',
      name: 'Wizyta rozszerzona',
      description: 'Rozszerzona sesja dla kompleksowej terapii',
      durationMinutes: 90,
      showDuration: true,
      priceWeekday: 250,
      priceWeekend: 300,
      isActive: true,
    },
  ],
  openingHours: {
    mon: { open: '00:00', close: '00:00', closed: true },
    tue: { open: '11:00', close: '22:00', closed: false },
    wed: { open: '11:00', close: '22:00', closed: false },
    thu: { open: '11:00', close: '22:00', closed: false },
    fri: { open: '11:00', close: '22:00', closed: false },
    sat: { open: '10:00', close: '18:00', closed: false },
    sun: { open: '11:00', close: '15:00', closed: false },
  },
  contact: {
    phone: '+48 123 456 789',
    email: 'kontakt@mt-anatol.pl',
    addressLine1: 'ul. Przykładowa 123',
    addressLine2: '00-000 Warszawa',
    googleMapsUrl: '',
    instagramUrl: '',
    facebookUrl: '',
  },
  texts: {
    heroTitle: 'M&T ANATOL - Profesjonalna Terapia Manualna',
    heroSubtitle: 'Doświadczony terapeuta, wsparcie w dolegliwościach bólowych kręgosłupa, napięciach mięśniowych oraz powrocie do sprawności po urazach.',
    aboutTitle: 'O nas',
    aboutText: 'Profesjonalna terapia manualna i masaż. Indywidualne podejście do każdego pacjenta.',
    bookingInfoText: 'Zarezerwuj wizytę online w kilka minut. Wybierz usługę i dogodną godzinę.',
    footerText: 'M&T ANATOL',
  },
  booking: {
    bufferMinutes: 20,
  },
  updatedAt: new Date().toISOString(),
};

// Validation helpers
export function validateSiteSettings(settings: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!settings || typeof settings !== 'object') {
    return { valid: false, errors: ['Settings must be an object'] };
  }

  const s = settings as Record<string, unknown>;

  // Validate services
  if (!Array.isArray(s.services)) {
    errors.push('Services must be an array');
  } else {
    for (const service of s.services as Service[]) {
      if (!service.id || !service.name) {
        errors.push('Each service must have id and name');
      }
      if (typeof service.priceWeekday !== 'number' || service.priceWeekday < 0) {
        errors.push(`Invalid weekday price for service ${service.name}`);
      }
      if (service.priceWeekend !== null && (typeof service.priceWeekend !== 'number' || service.priceWeekend < 0)) {
        errors.push(`Invalid weekend price for service ${service.name}`);
      }
      if (typeof service.durationMinutes !== 'number' || service.durationMinutes <= 0) {
        errors.push(`Invalid duration for service ${service.name}`);
      }
    }
  }

  // Validate opening hours
  if (!s.openingHours || typeof s.openingHours !== 'object') {
    errors.push('Opening hours must be an object');
  }

  // Validate contact
  if (!s.contact || typeof s.contact !== 'object') {
    errors.push('Contact must be an object');
  }

  // Validate texts
  if (!s.texts || typeof s.texts !== 'object') {
    errors.push('Texts must be an object');
  }

  // Validate booking config
  if (!s.booking || typeof s.booking !== 'object') {
    errors.push('Booking config must be an object');
  } else {
    const booking = s.booking as BookingConfig;
    if (typeof booking.bufferMinutes !== 'number' || booking.bufferMinutes < 0) {
      errors.push('Buffer minutes must be a non-negative number');
    }
  }

  return { valid: errors.length === 0, errors };
}
