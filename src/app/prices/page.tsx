import { Metadata } from 'next';
import { Calendar, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui';

const BOOKSY_URL = 'https://anatolmt.booksy.com/a/';

export const metadata: Metadata = {
  title: 'Cennik',
  description: 'Sprawdź aktualny cennik i zarezerwuj wizytę przez Booksy.',
};

export default function PricesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold">Cennik</h1>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <Container size="sm">
          <div className="text-center">
            <p className="text-xl lg:text-2xl text-gray-700 mb-8">
              Aktualny cennik oraz dostępne terminy znajdziesz w Booksy.
            </p>

            <a
              href={BOOKSY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20"
            >
              <Calendar className="w-5 h-5" />
              Zarezerwuj wizytę przez Booksy
              <ExternalLink className="w-5 h-5" />
            </a>

            <p className="text-sm text-gray-500 mt-6">
              Szybka rezerwacja online w kilka sekund.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
