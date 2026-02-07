import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import {
  LockedVideoPreview,
  Disclaimer,
  PurchaseButton,
  PurchaseCard,
} from '@/components/video';
import { getVideoBySlug, getCategoryBySlug, formatDuration, VIDEOS } from '@/data/videos';
import { VIDEO_PRICES, CATEGORY_NAMES } from '@/types/video';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  CreditCard,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Single video page - /video-pomoc/[slug]
 * Shows video details, when to use, when not to use, and purchase options
 */
export default async function SingleVideoPage({ params }: PageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const category = getCategoryBySlug(video.category);
  const categoryName = CATEGORY_NAMES[video.category] || video.category;
  const singlePrice = (VIDEO_PRICES.single / 100).toFixed(0);
  const fullPrice = (VIDEO_PRICES.full / 100).toFixed(0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-8">
        <Container>
          <Link
            href={`/video-pomoc?kategoria=${video.category}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {categoryName}
          </Link>
        </Container>
      </section>

      {/* Main content */}
      <section className="py-8 lg:py-12">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Video preview and details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video preview */}
              <LockedVideoPreview video={video} />

              {/* Title and meta */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full">
                    {categoryName}
                  </span>
                  {video.duration_seconds && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(video.duration_seconds)}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>

              {/* When to do / When not to do */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* When to do */}
                {video.when_to_do && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">
                          Kiedy wykonywać
                        </h3>
                        <p className="text-sm text-green-700 leading-relaxed">
                          {video.when_to_do}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* When NOT to do */}
                {video.when_not_to_do && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-800 mb-2">
                          Kiedy NIE wykonywać
                        </h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                          {video.when_not_to_do}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <Disclaimer variant="compact" />
            </div>

            {/* Right column - Purchase options */}
            <div className="space-y-6">
              {/* Single video purchase */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 sticky top-24">
                <div className="text-center">
                  <h2 className="font-semibold text-[#0F172A] text-lg">
                    Kup dostęp do tego filmu
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Oglądaj przez 30 dni bez limitu
                  </p>
                </div>

                {/* Price */}
                <div className="text-center py-4 border-y border-gray-100">
                  <span className="text-5xl font-bold text-[#0F172A]">
                    {singlePrice}
                  </span>
                  <span className="text-2xl text-gray-500 ml-1">€</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Natychmiastowy dostęp
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Dostęp przez 30 dni
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Bez konta i logowania
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Bezpieczna płatność
                  </li>
                </ul>

                {/* Purchase button */}
                <PurchaseButton
                  productType="single"
                  videoSlug={video.slug}
                  variant="primary"
                  fullWidth
                  size="lg"
                />

                {/* Payment methods */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    Akceptujemy
                  </p>
                  <div className="flex items-center justify-center gap-3 text-gray-400">
                    <span className="text-xs font-medium">Visa</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-medium">Mastercard</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-medium">BLIK</span>
                  </div>
                </div>
              </div>

              {/* Full package upsell */}
              <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10 rounded-xl p-5 border border-[#2563EB]/20">
                <div className="flex items-start gap-3">
                  <Package className="w-6 h-6 text-[#2563EB] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-sm">
                      Chcesz więcej?
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Kup pełny pakiet ({VIDEOS.filter((v) => v.active).length}{' '}
                      filmów) za {fullPrice}€
                    </p>
                    <Link
                      href="/video-pomoc/pakiet"
                      className="inline-flex items-center gap-1 text-[#2563EB] text-sm font-medium mt-2 hover:underline"
                    >
                      Zobacz pakiet
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/**
 * Generate static params for all videos
 */
export async function generateStaticParams() {
  return VIDEOS.filter((v) => v.active).map((video) => ({
    slug: video.slug,
  }));
}

/**
 * Generate metadata for each video page
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    return {
      title: 'Film nie znaleziony | Wideo Pomoc',
    };
  }

  return {
    title: `${video.title} | Wideo Pomoc`,
    description: video.description || `Ćwiczenie edukacyjne: ${video.title}`,
  };
}
