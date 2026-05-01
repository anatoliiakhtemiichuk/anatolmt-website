import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Heart,
  ArrowRight,
  CheckCircle,
  User,
  Shield,
  ClipboardCheck,
  Star,
  Sparkles,
  Users,
  MessageCircle,
  Search,
  Stethoscope,
  FileText,
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

// First visit steps
const visitSteps = [
  {
    icon: MessageCircle,
    title: 'Krótki wywiad',
    description: 'Rozmawiamy o Twoich dolegliwościach i stylu życia',
  },
  {
    icon: Search,
    title: 'Ocena ciała',
    description: 'Sprawdzam napięcia, zakres ruchu i źródło problemu',
  },
  {
    icon: Stethoscope,
    title: 'Terapia manualna',
    description: 'Indywidualnie dobrana praca z ciałem',
  },
  {
    icon: FileText,
    title: 'Zalecenia',
    description: 'Otrzymujesz wskazówki do dalszej pracy',
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();

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

      {/* First Visit Experience Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container>
          <div className="relative max-w-5xl mx-auto">
            {/* Trust Element */}
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#2563EB]/5 border border-[#2563EB]/10 px-4 py-2 rounded-full">
                <Heart className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm font-medium text-gray-700">
                  Indywidualne podejście do każdego pacjenta
                </span>
              </div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#0F172A] mb-4">
                Jak wygląda pierwsza wizyta?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Poznaj proces, który pomoże Ci wrócić do pełnej sprawności
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16">
              {visitSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>

                  {/* Card */}
                  <Card hover className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                    <CardContent className="pt-8">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <step.icon className="w-8 h-8 text-[#2563EB]" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-10 lg:p-12 shadow-2xl">
              <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
                Umów wizytę i sprawdź dostępne terminy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={BOOKSY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                >
                  <Calendar className="w-5 h-5" />
                  Zarezerwuj termin
                </a>
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
