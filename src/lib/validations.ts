import { z } from 'zod';

// Polish phone validation regex
const polishPhoneRegex = /^(\+48)?[0-9]{9}$/;

// Client form validation schema
export const clientFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(50, 'Imię może mieć maksymalnie 50 znaków'),
  lastName: z
    .string()
    .min(2, 'Nazwisko musi mieć minimum 2 znaki')
    .max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ''))
    .refine((val) => polishPhoneRegex.test(val), {
      message: 'Nieprawidłowy numer telefonu (format: 123456789 lub +48123456789)',
    }),
  notes: z.string().max(500, 'Notatka może mieć maksymalnie 500 znaków').optional(),
});

// Booking form validation schema
export const bookingFormSchema = z.object({
  serviceId: z.string().uuid('Wybierz usługę'),
  date: z.string().min(1, 'Wybierz datę'),
  time: z.string().min(1, 'Wybierz godzinę'),
  client: clientFormSchema,
});

// Admin booking edit schema
export const adminBookingEditSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().max(500).optional(),
});

// Service form schema (for admin)
export const serviceFormSchema = z.object({
  name: z.string().min(2, 'Nazwa musi mieć minimum 2 znaki'),
  name_pl: z.string().min(2, 'Polska nazwa musi mieć minimum 2 znaki'),
  duration_minutes: z
    .number()
    .min(15, 'Minimalna długość to 15 minut')
    .max(240, 'Maksymalna długość to 4 godziny'),
  price_weekday: z.number().min(0, 'Cena musi być większa lub równa 0'),
  price_weekend: z.number().min(0, 'Cena musi być większa lub równa 0'),
  description: z.string().max(500).optional(),
  is_active: z.boolean(),
});

// Availability block schema (for admin)
export const availabilityBlockSchema = z.object({
  date: z.string().min(1, 'Wybierz datę'),
  start_time: z.string().min(1, 'Wybierz godzinę rozpoczęcia'),
  end_time: z.string().min(1, 'Wybierz godzinę zakończenia'),
  reason: z.string().max(200).optional(),
});

// Types inferred from schemas
export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type AdminBookingEditValues = z.infer<typeof adminBookingEditSchema>;
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
export type AvailabilityBlockValues = z.infer<typeof availabilityBlockSchema>;
