import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  User,
  Shield,
  ClipboardCheck,
  Clock,
  Star,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Container, Card, CardContent } from '@/components/ui';
import { getSiteSettings } from '@/lib/site-settings';

// External booking URL (Booksy) - temporary redirect while internal booking is disabled
const BOOKSY_URL = 'https://anatolmt.booksy.com/a/';

// SEO Metadata for homepage
export const metadata: Metadata = {
  title: 'Terapeuta manualny Warszawa | M&T Anatol',
  description:
    'Pozbądź się bólu pleców i napięcia mięśniowego. Profesjonalna terapia manualna w Warszawie – indywidualne podejście i skuteczne wsparcie.',
  openGraph: {
    title: 'Terapeuta manualny Warszawa | M&T Anatol',
    description:
      'Pozbądź się bólu pleców i napięcia mięśniowego. Profesjonalna terapia manualna w Warszawie – indywidualne podejście i skuteczne wsparcie.',
  },
};

// Conditions treated
const conditions = [
  'Ból kręgosłupa',
  'Napięcia szyi i barków',
  'Praca siedząca i stres',
  'Dolegliwości mięśni pośladkowych',
  'Rwa kulszowa',
  'Kontuzje sportowe',
  'Zamrożony bark',
  'Łokieć tenisisty',
  'Bruksizm i napięcia twarzy',
];

// Services offered
const servicesOffered = [
  {
    title: 'Terapia manualna',
    description: 'Praca z napięciami mięśniowymi i ograniczeniami ruchomości',
  },
  {
    title: 'Terapia czaszkowo-krzyżowa',
    description: 'Delikatna technika wspierająca naturalne mechanizmy regulacyjne organizmu',
  },
  {
    title: 'Praca z twarzą i stawem skroniowo-żuchwowym',
    description: 'Wsparcie w napięciach twarzy, bruksizmie i dysfunkcjach stawu',
  },
  {
    title: 'Masaż liftingujący twarzy',
    description: 'Technika wspierająca napięcie i elastyczność tkanek twarzy',
  },
  {
    title: 'Wsparcie po urazach',
    description: 'Bezpieczna praca wspierająca powrót do sprawności',
  },
  {
    title: 'Praca ze sportowcami',
    description: 'Wsparcie w przeciążeniach i regeneracji po aktywności fizycznej',
  },
];

// Benefits
const benefits = [
  {
    icon: User,
    title: 'Indywidualne podejście',
    description: 'Każda sesja dostosowana do Twoich potrzeb i możliwości',
  },
  {
    icon: ClipboardCheck,
    title: 'Dokładny wywiad i ocena funkcjonalna',
    description: 'Zrozumienie przyczyn dolegliwości przed rozpoczęciem terapii',
  },
  {
    icon: Shield,
    title: 'Bezpieczna praca z ciałem',
    description: 'Techniki dobierane z uwzględnieniem bezpieczeństwa i komfortu',
  },
  {
    icon: Calendar,
    title: 'Możliwość rezerwacji online',
    description: 'Wygodna rezerwacja terminu 24/7 przez internet',
  },
];

// Testimonials
const testimonials = [
  {
    text: 'Profesjonalne podejście i duża ulga po wizycie.',
    author: 'Klient gabinetu',
  },
  {
    text: 'Świetna atmosfera, dokładny wywiad i skuteczna terapia.',
    author: 'Klient gabinetu',
  },
  {
    text: 'Polecam każdemu, kto ma napięcia po pracy przy komputerze.',
    author: 'Klient gabinetu',
  },
];

// Revalidate every 60 seconds to pick up settings changes
export const revalidate = 60;

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '—';
  }
  return `${price}`;
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const activeServices = settings.services.filter(s => s.isActive);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container>
          <div className="relative py-20 lg:py-32">
            <div className="max-w-3xl">
              {/* Promo Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-2 rounded-full mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold text-white">
                  -10% na pierwszą wizytę dla nowych klientów
                </span>
              </div>

              {/* Main H1 for SEO */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Pozbądź się bólu pleców i napięcia mięśniowego
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                Profesjonalna terapia manualna w Warszawie – indywidualne podejście,
                skuteczne wsparcie i bezpieczny powrót do sprawności.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary CTA */}
                <a
                  href={BOOKSY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105"
                >
                  <Calendar className="w-5 h-5" />
                  Umów wizytę teraz
                </a>
                {/* Secondary CTA */}
                <Link
                  href="/prices"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10 hover:border-white/50"
                >
                  Zobacz cennik
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Dla kogo jest terapia Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Dla kogo jest terapia?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wspieram osoby zmagające się z różnorodnymi dolegliwościami i napięciami
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {conditions.map((condition, index) => (
              <Card key={index} hover className="group">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB]/20 transition-colors">
                      <CheckCircle className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h3 className="font-semibold text-[#0F172A]">{condition}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* W czym mogę pomóc Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              W czym mogę pomóc?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferuję szeroki zakres technik i metod dostosowanych do indywidualnych potrzeb
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {servicesOffered.map((service, index) => (
              <Card key={index} hover variant="bordered" padding="lg">
                <CardContent>
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* O mnie Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              {/* Photo Placeholder */}
              <div className="lg:col-span-1">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 flex items-center justify-center border-2 border-[#2563EB]/20 shadow-lg">
                  <User className="w-24 h-24 text-[#2563EB]/40" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-6">
                  O mnie
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                  <p>
                    Jestem dyplomowanym terapeutą manualnym z doświadczeniem w pracy
                    z osobami zmagającymi się z bólem kręgosłupa, napięciami mięśniowymi,
                    dolegliwościami barków, kolan oraz przeciążeniami po aktywności fizycznej.
                  </p>
                  <p>
                    Pracuję indywidualnie, dobierając techniki do potrzeb i możliwości każdej osoby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Dlaczego warto Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Dlaczego warto?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesjonalne podejście, które stawia na Twoje bezpieczeństwo i komfort
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} hover className="text-center group">
                <CardContent>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#0F172A] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Co mówią klienci?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover padding="lg">
                <CardContent>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="text-sm text-gray-500 font-medium">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Preview Section - Premium Layout */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container>
          <div className="relative">
            {/* Trust Element */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-sm font-medium text-white">
                  Indywidualna terapia dopasowana do Ciebie
                </span>
              </div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Wybierz rodzaj wizyty
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Wszystkie usługi dostosowane do Twoich indywidualnych potrzeb
              </p>
            </div>

            {/* Two-Column Layout: Image + Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left: Image with Overlay */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
                {/* Placeholder for therapy image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#2563EB]/30 via-[#3B82F6]/20 to-[#1E293B]/40 backdrop-blur-xl border-2 border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                        <Heart className="w-10 h-10 text-white/80" />
                      </div>
                      <p className="text-white/70 text-sm px-6">
                        Profesjonalna terapia manualna
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Services List (Stacked) */}
              <div className="space-y-4 order-1 lg:order-2">
                {activeServices.map((service, index) => {
                  const hasWeekendPrice = service.priceWeekend !== null;
                  const priceDisplay = hasWeekendPrice
                    ? `od ${formatPrice(service.priceWeekday)} PLN`
                    : `${formatPrice(service.priceWeekday)} PLN`;

                  // Check if this is the primary service (usually "Wizyta standardowa")
                  const isPrimary = service.name.toLowerCase().includes('standardowa');

                  return (
                    <div
                      key={service.id}
                      className={cn(
                        'relative group bg-white/95 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl',
                        isPrimary && 'ring-2 ring-[#2563EB] shadow-xl shadow-blue-500/20'
                      )}
                    >
                      {/* Primary Badge */}
                      {isPrimary && (
                        <div className="absolute -top-3 left-6">
                          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Najczęściej wybierana
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className={cn(
                              'text-xl font-bold text-[#0F172A]',
                              isPrimary && 'text-2xl'
                            )}>
                              {service.name}
                            </h3>
                            {service.showDuration && (
                              <span className="text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                                {service.durationMinutes} min
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-2xl font-bold text-[#0F172A]">
                                {priceDisplay}
                              </p>
                            </div>
                            <a
                              href={BOOKSY_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200',
                                isPrimary
                                  ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-blue-500/30'
                                  : 'bg-gray-100 text-[#0F172A] hover:bg-gray-200'
                              )}
                            >
                              <Calendar className="w-4 h-4" />
                              Zarezerwuj termin
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View Full Pricing CTA */}
            <div className="text-center mt-12">
              <Link
                href="/prices"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10 hover:border-white/50 hover:scale-105"
              >
                Zobacz pełny cennik
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0F172A] to-[#1E293B] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container>
          <div className="relative text-center text-white">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">-10% na pierwszą wizytę</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Gotowy na pierwszą wizytę?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
              Zarezerwuj termin online w mniej niż 2 minuty i skorzystaj z -10% na pierwszą wizytę.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Sprawdź dostępne terminy
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10 hover:border-white/50"
              >
                Zadaj pytanie
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-t border-gray-100">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">Dyplomowany terapeuta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-sm font-medium">Indywidualne podejście</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Rezerwacja online 24/7</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
