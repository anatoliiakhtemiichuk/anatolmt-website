'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';

const openingHours = [
  { day: 'Poniedziałek', hours: 'Zamknięte', closed: true },
  { day: 'Wtorek', hours: '11:00 - 22:00', closed: false },
  { day: 'Środa', hours: '11:00 - 22:00', closed: false },
  { day: 'Czwartek', hours: '11:00 - 22:00', closed: false },
  { day: 'Piątek', hours: '11:00 - 22:00', closed: false },
  { day: 'Sobota', hours: '10:00 - 18:00', closed: false },
  { day: 'Niedziela', hours: '11:00 - 15:00', closed: false },
];

const contactInfo = [
  {
    icon: Phone,
    label: 'Telefon',
    value: '+48 123 456 789',
    href: 'tel:+48123456789',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'kontakt@mt-anatol.pl',
    href: 'mailto:kontakt@mt-anatol.pl',
  },
  {
    icon: MapPin,
    label: 'Adres',
    value: 'ul. Przykładowa 123, 00-000 Warszawa',
    href: null,
  },
];

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Imię jest wymagane';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Imię musi mieć minimum 2 znaki';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy adres email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Wiadomość jest wymagana';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Wiadomość musi mieć minimum 10 znaków';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Kontakt</h1>
            <p className="text-lg text-gray-300">
              Masz pytania? Skontaktuj się z nami. Odpowiemy najszybciej jak to możliwe.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info & Hours */}
            <div>
              {/* Contact Details */}
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Dane kontaktowe</h2>
              <div className="space-y-4 mb-10">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[#0F172A] font-medium hover:text-[#2563EB] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[#0F172A] font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Opening Hours */}
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#2563EB]" />
                Godziny otwarcia
              </h2>
              <Card variant="bordered">
                <CardContent>
                  <div className="space-y-3">
                    {openingHours.map((item) => (
                      <div
                        key={item.day}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{item.day}</span>
                        <span
                          className={`font-medium ${
                            item.closed ? 'text-red-500' : 'text-[#0F172A]'
                          }`}
                        >
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Napisz do nas</h2>

              {isSubmitted ? (
                <Card variant="bordered" className="bg-green-50 border-green-200">
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Wiadomość wysłana!
                      </h3>
                      <p className="text-green-700">
                        Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4 text-[#2563EB] font-medium hover:underline"
                      >
                        Wyślij kolejną wiadomość
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card variant="bordered">
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Imię i nazwisko *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all`}
                          placeholder="Jan Kowalski"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Adres email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all`}
                          placeholder="jan@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Wiadomość *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.message ? 'border-red-500' : 'border-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all resize-none`}
                          placeholder="Twoja wiadomość..."
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                        <Send className="w-4 h-4 mr-2" />
                        Wyślij wiadomość
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Lokalizacja</h2>
          <Card variant="bordered" padding="none" className="overflow-hidden">
            <div className="bg-gray-200 h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Mapa Google</p>
                <p className="text-gray-400 text-sm mt-1">
                  ul. Przykładowa 123, 00-000 Warszawa
                </p>
                <p className="text-gray-400 text-xs mt-4">
                  (Miejsce na osadzenie mapy Google Maps)
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
