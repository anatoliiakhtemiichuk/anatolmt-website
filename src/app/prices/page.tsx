import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Info } from 'lucide-react';
import { Container, Card, CardContent } from '@/components/ui';
import { getSiteSettings } from '@/lib/site-settings';
import type { Service } from '@/types/site-settings';

export const metadata: Metadata = {
  title: 'Cennik',
  description: 'Cennik usług terapii manualnej i masażu. Sprawdź ceny wizyt w dni robocze i weekendy.',
};

// Revalidate every 60 seconds to pick up settings changes
export const revalidate = 60;

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '—';
  }
  return `${price}`;
}

export default async function PricesPage() {
  const settings = await getSiteSettings();
  const activeServices = settings.services.filter(s => s.isActive);

  // Separate services for weekday and weekend display
  const weekdayServices = activeServices;
  const weekendServices = activeServices.filter(s => s.priceWeekend !== null);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Cennik</h1>
            <p className="text-lg text-gray-300">
              Przejrzyste ceny bez ukrytych kosztów. Wybierz usługę dopasowaną do Twoich potrzeb.
            </p>
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24">
        <Container>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-12 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Ceny w weekendy (sobota-niedziela) są wyższe ze względu na zwiększone zapotrzebowanie.
              Konsultacja dostępna jest wyłącznie w dni robocze.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Weekday Prices */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Dni robocze</h2>
                  <p className="text-gray-500 text-sm">Wtorek - Piątek</p>
                </div>
              </div>

              <div className="space-y-4">
                {weekdayServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    price={service.priceWeekday}
                    variant="weekday"
                  />
                ))}
              </div>
            </div>

            {/* Weekend Prices */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Weekend</h2>
                  <p className="text-gray-500 text-sm">Sobota - Niedziela</p>
                </div>
              </div>

              <div className="space-y-4">
                {weekendServices.map((service) => (
                  <ServiceCard
                    key={`weekend-${service.id}`}
                    service={service}
                    price={service.priceWeekend!}
                    variant="weekend"
                  />
                ))}
              </div>

              {/* Note about consultation */}
              <p className="text-sm text-gray-500 mt-4 italic">
                * Konsultacja ({formatPrice(activeServices.find(s => s.id === 'consultation')?.priceWeekday)} zł) dostępna wyłącznie w dni robocze
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-4">
              Gotowy na wizytę?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {settings.texts.bookingInfoText}
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              Umów wizytę
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function ServiceCard({
  service,
  price,
  variant,
}: {
  service: Service;
  price: number;
  variant: 'weekday' | 'weekend';
}) {
  const isWeekend = variant === 'weekend';

  return (
    <Card
      variant="bordered"
      padding="none"
      className={`overflow-hidden ${isWeekend ? 'border-amber-200' : ''}`}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#0F172A]">{service.name}</h3>
              {service.showDuration && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isWeekend
                      ? 'text-amber-600 bg-amber-100'
                      : 'text-[#2563EB] bg-[#2563EB]/10'
                  }`}
                >
                  {service.durationMinutes} min
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{service.description}</p>
          </div>
          <div className="text-right ml-4">
            <span className="text-2xl font-bold text-[#0F172A]">
              {formatPrice(price)}
            </span>
            <span className="text-gray-500 ml-1">zł</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
