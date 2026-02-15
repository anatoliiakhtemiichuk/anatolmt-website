/**
 * Settings Types
 * Types for clinic settings management
 * All prices are stored as integers in PLN (not groszy/cents)
 */

export interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
    isClosed: boolean;
  };
}

/**
 * Service pricing in PLN (integer values)
 * - consultation: 50 PLN (always, no weekend variation)
 * - visit1hWeekday: 200 PLN (Tue-Fri)
 * - visit1hWeekend: 250 PLN (Sat-Sun)
 * - visit15hWeekday: 250 PLN (Tue-Fri)
 * - visit15hWeekend: 300 PLN (Sat-Sun)
 */
export interface ServicePricing {
  consultation: number;
  visit1hWeekday: number;
  visit1hWeekend: number;
  visit15hWeekday: number;
  visit15hWeekend: number;
}

export interface ContactDetails {
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface ClinicSettings {
  openingHours: OpeningHours;
  pricing: ServicePricing;
  contact: ContactDetails;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: ClinicSettings = {
  openingHours: {
    monday: { open: '00:00', close: '00:00', isClosed: true },
    tuesday: { open: '11:00', close: '22:00', isClosed: false },
    wednesday: { open: '11:00', close: '22:00', isClosed: false },
    thursday: { open: '11:00', close: '22:00', isClosed: false },
    friday: { open: '11:00', close: '22:00', isClosed: false },
    saturday: { open: '10:00', close: '18:00', isClosed: false },
    sunday: { open: '11:00', close: '15:00', isClosed: false },
  },
  pricing: {
    consultation: 50,
    visit1hWeekday: 200,
    visit1hWeekend: 250,
    visit15hWeekday: 250,
    visit15hWeekend: 300,
  },
  contact: {
    address: 'ul. Przykładowa 123',
    city: 'Warszawa',
    phone: '+48 123 456 789',
    email: 'kontakt@mt-anatol.pl',
  },
  updatedAt: new Date().toISOString(),
};

export const DAY_NAMES: Record<string, string> = {
  monday: 'Poniedziałek',
  tuesday: 'Wtorek',
  wednesday: 'Środa',
  thursday: 'Czwartek',
  friday: 'Piątek',
  saturday: 'Sobota',
  sunday: 'Niedziela',
};

export const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
