'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Instagram } from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';
import type { SiteSettings } from '@/types/site-settings';
import { DAY_NAMES_PL, DAY_ORDER, DEFAULT_SITE_SETTINGS } from '@/types/site-settings';

// Facebook icon component (lucide-react's Facebook icon is different)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

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
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Build contact info from settings
  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefon',
      value: settings.contact.phone,
      href: `tel:${settings.contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
    },
    {
      icon: MapPin,
      label: 'Adres',
      value: `${settings.contact.addressLine1}${settings.contact.addressLine2 ? ', ' + settings.contact.addressLine2 : ''}`,
      href: settings.contact.googleMapsUrl || null,
    },
  ];

  // Build opening hours from settings
  const openingHours = DAY_ORDER.map((day) => {
    const daySettings = settings.openingHours[day];
    return {
      day: DAY_NAMES_PL[day],
      hours: daySettings.closed ? 'Zamknięte' : `${daySettings.open} - ${daySettings.close}`,
      closed: daySettings.closed,
    };
  });

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

  // Show skeleton while loading
  if (isLoadingSettings) {
    return (
      <>
        <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl">
              <div className="h-12 w-48 bg-gray-600 rounded animate-pulse mb-4" />
              <div className="h-6 w-96 bg-gray-600 rounded animate-pulse" />
            </div>
          </Container>
        </section>
        <section className="py-16 lg:py-24">
          <Container>
            <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
          </Container>
        </section>
      </>
    );
  }

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
                          target={item.label === 'Adres' ? '_blank' : undefined}
                          rel={item.label === 'Adres' ? 'noopener noreferrer' : undefined}
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

              {/* Social Media Links */}
              {(settings.contact.instagramUrl || settings.contact.facebookUrl) && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Znajdź nas</h2>
                  <div className="flex gap-4">
                    {settings.contact.instagramUrl && (
                      <a
                        href={settings.contact.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {settings.contact.facebookUrl && (
                      <a
                        href={settings.contact.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                      >
                        <FacebookIcon className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}

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
                  {settings.contact.addressLine1}{settings.contact.addressLine2 && `, ${settings.contact.addressLine2}`}
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
