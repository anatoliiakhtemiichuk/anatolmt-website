'use client';

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import {
  CategoryCard,
  VideoCard,
  Disclaimer,
  PurchaseButton,
} from '@/components/video';
import {
  VIDEO_CATEGORIES,
  getVideosByCategory,
  getVideoCountByCategory,
  getTotalVideoCount,
} from '@/data/videos';
import { ArrowLeft, Play, Package, ChevronRight, Loader2 } from 'lucide-react';

/**
 * Loading fallback for Suspense
 */
function LoadingFallback() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    </main>
  );
}

/**
 * Main content component that uses searchParams
 */
function VideoPomocContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('kategoria');

  const videoCount = getTotalVideoCount();
  const videoCounts = getVideoCountByCategory();

  const categoryVideos = useMemo(() => {
    if (!selectedCategory) return [];
    return getVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  const currentCategory = VIDEO_CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 lg:py-24">
        <Container>
          {selectedCategory && (
            <Link
              href="/video-pomoc"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do kategorii
            </Link>
          )}

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/20 text-[#60A5FA] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Materiały edukacyjne po wizycie
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {selectedCategory && currentCategory
                ? currentCategory.name
                : 'Wideo Pomoc'}
            </h1>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {selectedCategory
                ? currentCategory?.description ||
                  'Ćwiczenia edukacyjne dobrane do Twoich potrzeb.'
                : 'Kontynuuj ćwiczenia w domu po wizycie terapeutycznej. Nasze materiały wideo pomogą Ci prawidłowo wykonywać zalecone ćwiczenia mobilizacyjne, wzmacniające i rozciągające.'}
            </p>

            {!selectedCategory && (
              <div className="flex flex-col sm:flex-row gap-4">
                <PurchaseButton
                  productType="standard"
                  variant="primary"
                  size="lg"
                  label="Pakiet Standard – 12€"
                />
                <Link
                  href="#kategorie"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
                >
                  Zobacz wszystkie opcje
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white border-b border-gray-100">
        <Container>
          <Disclaimer variant="full" />
        </Container>
      </section>

      {/* Main Content */}
      <section id="kategorie" className="py-12 lg:py-16">
        <Container>
          {selectedCategory ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    Dostępne ćwiczenia
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {categoryVideos.length}{' '}
                    {categoryVideos.length === 1
                      ? 'film'
                      : categoryVideos.length < 5
                      ? 'filmy'
                      : 'filmów'}{' '}
                    w kategorii
                  </p>
                </div>
              </div>

              {categoryVideos.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryVideos.map((video) => (
                    <VideoCard key={video.id} video={video} locked />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500">
                    Brak filmów w tej kategorii. Wkrótce dodamy nowe materiały.
                  </p>
                </div>
              )}

              {/* Package upsell */}
              <div className="mt-12 bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10 rounded-2xl p-8 border border-[#2563EB]/20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A] text-lg">
                        Pakiet Standard – najczęściej wybierany
                      </h3>
                      <p className="text-gray-600">
                        10-12 filmów edukacyjnych za 12€ lub pełny pakiet ({videoCount} filmów) za 15€
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <PurchaseButton productType="standard" variant="primary" size="lg" label="Standard – 12€" />
                    <PurchaseButton productType="full" variant="outline" size="lg" label="Pełny – 15€" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Wybierz kategorię ćwiczeń
                </h2>
                <p className="text-gray-600 mt-1">
                  {videoCount} filmów edukacyjnych w {VIDEO_CATEGORIES.length}{' '}
                  kategoriach
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEO_CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    videoCount={videoCounts[category.slug] || 0}
                  />
                ))}
              </div>

              {/* Pricing section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
                  Opcje zakupu
                </h2>
                <p className="text-gray-600 text-center mb-2">
                  Jednorazowa płatność – dostęp przez 30 dni
                </p>
                <p className="text-sm text-[#2563EB] text-center mb-8 font-medium">
                  Pakiet = najkorzystniejsza opcja
                </p>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* Single video option */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-[#0F172A] text-lg">
                        Pojedynczy film
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Dostęp do wybranego ćwiczenia
                      </p>
                    </div>

                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-[#0F172A]">3</span>
                      <span className="text-xl text-gray-500 ml-1">€</span>
                      <p className="text-sm text-gray-500 mt-1">za film</p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        1 wybrany film
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Dostęp przez 30 dni
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Bez konta i logowania
                      </li>
                    </ul>

                    <Link
                      href="#kategorie"
                      className="block w-full text-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors font-medium"
                    >
                      Wybierz film
                    </Link>
                  </div>

                  {/* Standard package - HIGHLIGHTED */}
                  <div className="bg-white rounded-xl border-2 border-[#2563EB] ring-2 ring-[#2563EB]/20 p-6 space-y-4 relative transform md:scale-105">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#2563EB] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        Najczęściej wybierane
                      </span>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-[#0F172A] text-lg">Pakiet Standard</h3>
                      <p className="text-sm text-gray-500 mt-1">10-12 wybranych filmów</p>
                    </div>

                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-[#2563EB]">12</span>
                      <span className="text-xl text-gray-500 ml-1">€</span>
                      <p className="text-sm text-gray-500 mt-1">jednorazowo</p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        10-12 filmów edukacyjnych
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Dostęp przez 30 dni
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Bez konta i logowania
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Oszczędzasz vs. pojedyncze
                      </li>
                    </ul>

                    <PurchaseButton productType="standard" variant="primary" fullWidth size="lg" />
                  </div>

                  {/* Full package option */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-[#0F172A] text-lg">Pakiet Pełny</h3>
                      <p className="text-sm text-gray-500 mt-1">Wszystkie {videoCount} filmów</p>
                    </div>

                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-[#0F172A]">15</span>
                      <span className="text-xl text-gray-500 ml-1">€</span>
                      <p className="text-sm text-gray-500 mt-1">jednorazowo</p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Wszystkie {videoCount} filmów
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Dostęp przez 30 dni
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Bez konta i logowania
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Kompletna biblioteka
                      </li>
                    </ul>

                    <PurchaseButton productType="full" variant="outline" fullWidth size="lg" />
                  </div>
                </div>
              </div>

              {/* FAQ section */}
              <div className="mt-16 bg-white rounded-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6">
                  Najczęściej zadawane pytania
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">
                      Jak uzyskam dostęp do filmów?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Po płatności otrzymasz unikalny link, który da Ci dostęp do
                      zakupionych materiałów przez 30 dni. Nie wymaga to zakładania konta.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">
                      Jakie metody płatności akceptujecie?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Akceptujemy karty Visa i Mastercard, Apple Pay, Google Pay oraz BLIK
                      (przez Przelewy24).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">
                      Czy mogę przedłużyć dostęp?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Tak, po wygaśnięciu dostępu możesz dokonać ponownego zakupu na
                      kolejne 30 dni.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">
                      Dla kogo są te materiały?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Materiały są przeznaczone dla pacjentów po wizycie terapeutycznej,
                      jako wsparcie w kontynuowaniu ćwiczeń w domu. Mają charakter
                      edukacyjny i nie zastępują konsultacji ze specjalistą.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
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

/**
 * Main video landing page - /video-pomoc
 * Wrapped in Suspense for useSearchParams
 */
export default function VideoPomocPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoPomocContent />
    </Suspense>
  );
}
