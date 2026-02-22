import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import {
  CategoryCard,
  Disclaimer,
  PurchaseButton,
} from '@/components/video';
import {
  VIDEO_CATEGORIES,
  VIDEOS,
  getVideoCountByCategory,
  getTotalVideoCount,
} from '@/data/videos';
import { VIDEO_PRICES } from '@/types/video';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Shield,
  Clock,
  CreditCard,
  Zap,
} from 'lucide-react';

/**
 * Package page - /video-pomoc/pakiet
 * Shows all package options (Standard and Full) with comparison
 */
export default function PakietPage() {
  const videoCount = getTotalVideoCount();
  const videoCounts = getVideoCountByCategory();
  const fullPrice = (VIDEO_PRICES.full / 100).toFixed(0);
  const standardPrice = (VIDEO_PRICES.standard / 100).toFixed(0);
  const singlePrice = (VIDEO_PRICES.single / 100).toFixed(0);
  const standardVideoCount = 10; // 10-12 videos in standard
  const fullSavingsPercent = Math.round(
    ((VIDEO_PRICES.single * videoCount - VIDEO_PRICES.full) /
      (VIDEO_PRICES.single * videoCount)) *
      100
  );
  const standardSavingsPercent = Math.round(
    ((VIDEO_PRICES.single * standardVideoCount - VIDEO_PRICES.standard) /
      (VIDEO_PRICES.single * standardVideoCount)) *
      100
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 lg:py-24">
        <Container>
          <Link
            href="/video-pomoc"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do Wideo Pomoc
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Package className="w-4 h-4" />
                Pełny pakiet
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Wszystkie materiały
                <br />w jednym pakiecie
              </h1>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Dostęp do wszystkich {videoCount} filmów edukacyjnych w{' '}
                {VIDEO_CATEGORIES.length} kategoriach. Idealne rozwiązanie dla
                kompleksowej terapii domowej.
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>{videoCount} filmów edukacyjnych</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>30 dni dostępu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Bez konta i logowania</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span>Natychmiastowy dostęp</span>
                </div>
              </div>
            </div>

            {/* Right - Price card for Standard (Most Popular) */}
            <div className="bg-white rounded-2xl p-8 text-[#0F172A] shadow-2xl relative">
              {/* Most popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#2563EB] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Najczęściej wybierane
                </span>
              </div>

              {/* Savings badge */}
              <div className="text-center mb-6 mt-2">
                <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                  Oszczędzasz {standardSavingsPercent}%
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold">{standardPrice}</span>
                  <span className="text-2xl text-gray-500">€</span>
                </div>
                <p className="text-gray-500 mt-2">Pakiet Standard • 10-12 filmów</p>
                <p className="text-sm text-gray-400 mt-1">
                  zamiast {(VIDEO_PRICES.single * standardVideoCount) / 100}€ za
                  pojedyncze filmy
                </p>
              </div>

              {/* Purchase button */}
              <PurchaseButton
                productType="standard"
                variant="primary"
                fullWidth
                size="lg"
              />

              {/* Payment methods */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center mb-3">
                  Bezpieczna płatność przez
                </p>
                <div className="flex items-center justify-center gap-4">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Visa • Mastercard • Apple Pay • Google Pay • BLIK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white border-b border-gray-100">
        <Container>
          <Disclaimer variant="full" />
        </Container>
      </section>

      {/* Included categories */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-3">
              Co zawiera pakiet?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pełny dostęp do wszystkich kategorii ćwiczeń. Materiały są
              przygotowane przez doświadczonego terapeutę i przeznaczone do
              wsparcia domowej terapii.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEO_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {videoCounts[category.slug] || 0}{' '}
                      {(videoCounts[category.slug] || 0) === 1
                        ? 'film'
                        : (videoCounts[category.slug] || 0) < 5
                        ? 'filmy'
                        : 'filmów'}
                    </p>
                  </div>
                </div>
                {category.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="py-12 lg:py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
              Porównanie opcji
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Single videos */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-[#0F172A] text-lg mb-4">
                  Pojedyncze filmy
                </h3>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[#0F172A]">{singlePrice}€</span>
                  <span className="text-gray-500 ml-1">za film</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                      •
                    </span>
                    Dostęp do wybranego filmu
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                      •
                    </span>
                    30 dni dostępu
                  </div>
                </div>
                <Link
                  href="/video-pomoc"
                  className="block w-full text-center mt-6 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors font-medium"
                >
                  Zobacz filmy
                </Link>
              </div>

              {/* Standard package */}
              <div className="border-2 border-[#2563EB] rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#2563EB] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Najczęściej wybierane
                  </span>
                </div>
                <h3 className="font-semibold text-[#0F172A] text-lg mb-4">
                  Pakiet Standard
                </h3>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[#0F172A]">{standardPrice}€</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    10-12 wybranych filmów
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    30 dni dostępu
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Oszczędzasz {standardSavingsPercent}%
                  </div>
                </div>
                <PurchaseButton
                  productType="standard"
                  variant="primary"
                  fullWidth
                  className="mt-6"
                />
              </div>

              {/* Full package */}
              <div className="border-2 border-[#0F172A] rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0F172A] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Najlepsza wartość
                  </span>
                </div>
                <h3 className="font-semibold text-[#0F172A] text-lg mb-4">
                  Pełny pakiet
                </h3>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[#0F172A]">{fullPrice}€</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Wszystkie {videoCount} filmów
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    30 dni dostępu
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Oszczędzasz {fullSavingsPercent}%
                  </div>
                </div>
                <PurchaseButton
                  productType="full"
                  variant="secondary"
                  fullWidth
                  className="mt-6"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
              Gotowy na rozpoczęcie ćwiczeń?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Wybierz pakiet i uzyskaj natychmiastowy dostęp do materiałów
              edukacyjnych.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PurchaseButton productType="standard" variant="primary" size="lg" />
              <PurchaseButton productType="full" variant="secondary" size="lg" />
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <Container>
          <Disclaimer variant="compact" />
        </Container>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Pełny pakiet | Wideo Pomoc',
  description:
    'Dostęp do wszystkich filmów edukacyjnych z ćwiczeniami rehabilitacyjnymi. Jednorazowa płatność, 30 dni dostępu.',
};
