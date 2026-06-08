'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowDown,
  CheckCircle,
  Phone,
  Mail,
  Users,
  Building2,
  MapPin,
  Star,
  TrendingDown,
  Target,
  Clock
} from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: string;
  message: string;
  rodoConsent: boolean;
}

interface FormErrors {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  message?: string;
  rodoConsent?: string;
}

export default function DlaFirmPage() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: '',
    rodoConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nazwa firmy jest wymagana';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Nazwa firmy musi mieć minimum 2 znaki';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Osoba kontaktowa jest wymagana';
    } else if (formData.contactPerson.trim().length < 2) {
      newErrors.contactPerson = 'Imię i nazwisko musi mieć minimum 2 znaki';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy adres email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    } else if (!/^[\d\s+()-]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy numer telefonu';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Wiadomość jest wymagana';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Wiadomość musi mieć minimum 10 znaków';
    }

    if (!formData.rodoConsent) {
      newErrors.rodoConsent = 'Zgoda na przetwarzanie danych jest wymagana';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'b2b',
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          employeeCount: formData.employeeCount,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error || 'Wystąpił błąd. Spróbuj ponownie.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employeeCount: '',
        message: '',
        rodoConsent: false,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Mniej bólu pleców w zespole, mniej zwolnień
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 mb-8">
              Terapia manualna od sprawdzonego terapeuty z Saskiej Kępy jako benefit dla pracowników biurowych
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3.5 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-lg"
            >
              Umów rozmowę
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </Container>
      </section>

      {/* Problem Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-12 text-center">
            Problem pracodawcy
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  Absencja chorobowa
                </h3>
                <p className="text-gray-600 text-sm">
                  Ból kręgosłupa i karku od pracy siedzącej prowadzi do zwolnień lekarskich
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  Niższa produktywność
                </h3>
                <p className="text-gray-600 text-sm">
                  Ból utrudnia koncentrację i obniża efektywność pracy zespołu
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  Gorsze samopoczucie
                </h3>
                <p className="text-gray-600 text-sm">
                  Przewlekły dyskomfort wpływa na morale i atmosferę w firmie
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  Stała rotacja
                </h3>
                <p className="text-gray-600 text-sm">
                  Brak wsparcia zdrowotnego może wpływać na retencję talentów
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Collaboration Options Section */}
      <section className="py-16 lg:py-24">
        <Container size="md">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Dwie formy współpracy
            </h2>
            <p className="text-lg text-gray-600">
              Wybierz model, który odpowiada potrzebom Twojej firmy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Test bez ryzyka */}
            <Card variant="bordered" hover className="flex flex-col">
              <CardContent className="flex flex-col h-full">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] px-3 py-1.5 rounded-full text-sm font-medium mb-6 self-start">
                  Na start — sprawdź zainteresowanie
                </span>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-4">
                  Test bez ryzyka
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  Firma nic nie płaci z góry. Pracownicy dostają zniżkę na pierwszą wizytę przez dedykowany kod firmy.
                </p>

                {/* 3 Steps */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Ustalamy kod firmy i zniżkę</h4>
                      <p className="text-sm text-gray-600">
                        Wspólnie tworzymy unikalny kod rabatowy dla Twojej firmy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Firma informuje pracowników</h4>
                      <p className="text-sm text-gray-600">
                        Przekazujesz kod zespołowi. Każdy pracownik może go użyć przy rezerwacji pierwszej wizyty
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Sprawdzamy razem efekt</h4>
                      <p className="text-sm text-gray-600">
                        Po 2-4 tygodniach oceniamy zainteresowanie i decydujemy o dalszej współpracy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlight Box */}
                <div className="bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#0F172A] font-medium text-sm">
                        Zero zobowiązań finansowych na start
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* CTA Button */}
                <button
                  onClick={scrollToForm}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-6 py-3.5 rounded-lg font-medium transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-lg"
                >
                  Umów rozmowę
                  <ArrowDown className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>

            {/* Card 2: Dofinansowanie wizyt */}
            <Card variant="bordered" hover className="flex flex-col">
              <CardContent className="flex flex-col h-full">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6 self-start">
                  Stała współpraca — realny benefit dla zespołu
                </span>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-4">
                  Dofinansowanie wizyt
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  Firma dofinansowuje ustaloną część każdej wizyty, pracownik dopłaca resztę. Proste rozwiązanie z jedną fakturą miesięcznie.
                </p>

                {/* 3 Steps */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Ustalamy podział kosztu</h4>
                      <p className="text-sm text-gray-600">
                        Podpisujemy proste warunki współpracy i ustalamy, ile firma dofinansowuje do każdej wizyty
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Pracownicy rezerwują przez Booksy</h4>
                      <p className="text-sm text-gray-600">
                        Płacą swoją część na miejscu przez dedykowaną usługę partnerską danej firmy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-1">Co miesiąc jedna faktura</h4>
                      <p className="text-sm text-gray-600">
                        Otrzymujesz jedną fakturę za faktyczną liczbę wizyt zespołu. Kwoty i szczegóły ustalamy indywidualnie
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Info Box */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#0F172A] font-medium text-sm">
                        Realny benefit zdrowotny dla pracowników, prosty proces rozliczeń dla firmy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* CTA Button */}
                <button
                  onClick={scrollToForm}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg"
                >
                  Umów rozmowę
                  <ArrowDown className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Dlaczego ja Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container size="sm">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-12 text-center">
            Dlaczego ja
          </h2>

          <div className="space-y-6 mb-8">
            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                      Doświadczenie w terapii manualnej
                    </h3>
                    <p className="text-gray-600">
                      Specjalizuję się w bólu kręgosłupa, karku i przeciążeniach od pracy siedzącej.
                      Indywidualne podejście do każdego pacjenta.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                      Gabinet blisko biura
                    </h3>
                    <p className="text-gray-600">
                      Saska Kępa, Plac Przymierza 2/3 — dogodna lokalizacja, łatwo dostępna
                      komunikacją miejską i samochodem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-white">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                      Zobacz opinie na{' '}
                      <a
                        href="https://maps.app.goo.gl/cUQFbaBuvnUoHX1U6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:underline"
                      >
                        Google
                      </a>
                      {' '}i{' '}
                      <a
                        href="https://booksy.com/pl-pl/217565_anatol-m-t_fizjoterapia_3_warszawa#reviews-section"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:underline"
                      >
                        Booksy
                      </a>
                    </h3>
                    <p className="text-gray-600">
                      Sprawdź sam opinie zadowolonych pacjentów, którzy polecają moje usługi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 lg:py-24 scroll-mt-20">
        <Container size="sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Kontakt B2B
            </h2>
            <p className="text-lg text-gray-600">
              Wypełnij formularz, a odezwę się do Ciebie, żeby ustalić szczegóły
            </p>
          </div>

          {isSubmitted ? (
            <Card variant="bordered" className="bg-green-50 border-green-200">
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Zapytanie wysłane!
                  </h3>
                  <p className="text-green-700">
                    Dziękujemy za kontakt. Odezwę się najszybciej jak to możliwe.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-[#2563EB] font-medium hover:underline"
                  >
                    Wyślij kolejne zapytanie
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card variant="bordered">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa firmy *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.companyName ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all`}
                    placeholder="Nazwa Twojej firmy"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Osoba kontaktowa *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all`}
                    placeholder="Imię i nazwisko"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
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
                    placeholder="kontakt@firma.pl"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all`}
                    placeholder="+48 123 456 789"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Employee Count (Optional) */}
                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Liczba pracowników (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                    placeholder="np. 10-20"
                  />
                </div>

                {/* Message */}
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
                    placeholder="Napisz kilka słów o swoich potrzebach..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* RODO Consent Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rodoConsent"
                      checked={formData.rodoConsent}
                      onChange={handleChange}
                      className={`mt-1 w-5 h-5 rounded border-2 ${
                        errors.rodoConsent ? 'border-red-500' : 'border-gray-300'
                      } text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0 cursor-pointer`}
                    />
                    <span className="text-sm text-gray-600">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                      <Link
                        href="/polityka-prywatnosci"
                        className="text-[#2563EB] hover:underline"
                        target="_blank"
                      >
                        polityką prywatności
                      </Link>
                      {' '}*
                    </span>
                  </label>
                  {errors.rodoConsent && (
                    <p className="mt-1 text-sm text-red-500">{errors.rodoConsent}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                  Wyślij zapytanie
                </Button>
              </form>

              {/* Contact Info Below Form */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Możesz też skontaktować się bezpośrednio:
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                  <a
                    href="tel:+48884844191"
                    className="flex items-center gap-2 text-[#0F172A] hover:text-[#2563EB] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#2563EB]" />
                    <span className="font-medium">+48 884 844 191</span>
                  </a>
                  <a
                    href="mailto:anatolmt.kontakt@gmail.com"
                    className="flex items-center gap-2 text-[#0F172A] hover:text-[#2563EB] transition-colors"
                  >
                    <Mail className="w-5 h-5 text-[#2563EB]" />
                    <span className="font-medium">anatolmt.kontakt@gmail.com</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </Container>
      </section>
    </>
  );
}
