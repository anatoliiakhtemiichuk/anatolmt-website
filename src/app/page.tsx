import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Clock,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Container, Card, CardContent } from '@/components/ui';
import { getSiteSettings } from '@/lib/site-settings';

// SEO Metadata for homepage
export const metadata: Metadata = {
  title: 'Terapeuta manualny Warszawa | M&T Anatol',
  description:
    'Wsparcie w dolegliwościach bólowych kręgosłupa i napięciach mięśniowych w Warszawie. Umów wizytę u M&T Anatol.',
  openGraph: {
    title: 'Terapeuta manualny Warszawa | M&T Anatol',
    description:
      'Wsparcie w dolegliwościach bólowych kręgosłupa i napięciach mięśniowych w Warszawie. Umów wizytę u M&T Anatol.',
  },
};

// Features/benefits (static)
const features = [
  {
    icon: Award,
    title: 'Doświadczenie',
    description: 'Wieloletnia praktyka w terapii manualnej',
  },
  {
    icon: Heart,
    title: 'Indywidualne podejście',
    description: 'Każdy pacjent traktowany jest indywidualnie',
  },
  {
    icon: Clock,
    title: 'Elastyczne godziny',
    description: 'Wizyty również w weekendy',
  },
  {
    icon: Calendar,
    title: 'Łatwa rezerwacja',
    description: 'Wygodny system rezerwacji online',
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
              {/* Brand name */}
              <p className="text-[#2563EB] text-xl font-semibold mb-3">
                {settings.texts.footerText || 'M&T ANATOL'}
              </p>
              {/* Main H1 for SEO */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Terapeuta manualny w Warszawie
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                {settings.texts.heroSubtitle || 'Doświadczony terapeuta, wsparcie w dolegliwościach bólowych kręgosłupa, napięciach mięśniowych oraz powrocie do sprawności po urazach.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <Calendar className="w-5 h-5" />
                  Umów wizytę
                </Link>
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

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature) => (
              <Card key={feature.title} hover className="text-center">
                <CardContent>
                  <div className="w-14 h-14 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#0F172A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Usługi terapii manualnej w Warszawie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferujemy szeroki zakres usług terapeutycznych dostosowanych do
              Twoich indywidualnych potrzeb
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {activeServices.map((service) => {
              const hasWeekendPrice = service.priceWeekend !== null;
              const priceDisplay = hasWeekendPrice
                ? `od ${formatPrice(service.priceWeekday)} PLN`
                : `${formatPrice(service.priceWeekday)} PLN`;

              return (
                <Card key={service.id} hover variant="bordered" padding="lg">
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      {service.showDuration ? (
                        <span className="text-sm font-medium text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full">
                          {service.durationMinutes} min
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-lg font-bold text-[#0F172A]">
                        {priceDisplay}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link
                      href="/booking"
                      className="inline-flex items-center text-[#2563EB] font-medium hover:underline"
                    >
                      Zarezerwuj
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/prices"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#2563EB] text-[#2563EB] px-7 py-3.5 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-[#2563EB] hover:text-white"
            >
              Zobacz pełny cennik
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#2563EB]">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Gotowy na wizytę?
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              {settings.texts.bookingInfoText || 'Umów się na wizytę online w kilka minut. Wybierz dogodny termin i zacznij swoją drogę do lepszego samopoczucia.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#2563EB] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Zarezerwuj termin
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10"
              >
                Skontaktuj się
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-8 text-center">
              Terapeuta manualny Warszawa – kiedy warto się zgłosić?
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Ból kręgosłupa to jedna z najczęstszych dolegliwości, z którą zgłaszają się pacjenci
                do gabinetu terapii manualnej w Warszawie. Może być wynikiem przeciążeń, nieprawidłowej
                postawy ciała lub długotrwałego stresu. Profesjonalna terapia manualna pomaga zmniejszyć
                napięcie mięśniowe i przywrócić prawidłową ruchomość kręgosłupa.
              </p>

              <p>
                Napięcia szyi i barków często towarzyszą osobom pracującym przy komputerze lub
                spędzającym wiele godzin w jednej pozycji. Objawy takie jak sztywność karku, bóle głowy
                czy ograniczona ruchomość mogą znacząco wpływać na codzienne funkcjonowanie.
                Regularne wizyty u terapeuty manualnego pomagają zapobiegać narastaniu dolegliwości.
              </p>

              <p>
                Siedzący tryb pracy to wyzwanie dla współczesnego organizmu. Długie godziny spędzone
                przy biurku prowadzą do osłabienia mięśni stabilizujących, przykurczów i zaburzeń
                postawy. Terapia manualna w połączeniu z odpowiednimi ćwiczeniami może skutecznie
                przeciwdziałać tym negatywnym skutkom.
              </p>

              <p>
                Powrót do sprawności po urazach wymaga odpowiedniego wsparcia specjalisty. Niezależnie
                od tego, czy mierzysz się z kontuzją sportową, czy skutkami przeciążenia, terapeuta
                manualny pomoże Ci bezpiecznie odzyskać pełną funkcjonalność ciała i zapobiec
                nawrotom dolegliwości.
              </p>

              <p>
                W gabinecie M&T Anatol w Warszawie każdy pacjent traktowany jest indywidualnie.
                Przed rozpoczęciem terapii przeprowadzamy dokładny wywiad i ocenę funkcjonalną,
                aby dobrać odpowiednie techniki do Twoich potrzeb i celów.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-t border-gray-100">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Dyplomowany terapeuta manualny</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Indywidualne podejście do każdego pacjenta</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Rezerwacja online 24/7</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
