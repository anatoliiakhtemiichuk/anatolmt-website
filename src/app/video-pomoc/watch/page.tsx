'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { VideoPlayer, Disclaimer } from '@/components/video';
import { Video, ValidateTokenResponse } from '@/types/video';
import { VIDEO_CATEGORIES } from '@/data/videos';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
  Play,
  ChevronRight,
  Lock,
} from 'lucide-react';

/**
 * Watch page content component
 */
function WatchContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const videoSlug = searchParams.get('video');

  const [isLoading, setIsLoading] = useState(true);
  const [accessData, setAccessData] = useState<ValidateTokenResponse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function validateAccess() {
      if (!token) {
        setAccessData({ valid: false, error: 'Brak tokenu dostępu' });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/video/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data: ValidateTokenResponse = await response.json();
        setAccessData(data);

        // If single video purchase, set the video
        if (data.valid && data.purchase?.video_id && data.videos?.length === 1) {
          setSelectedVideo(data.videos[0]);
        }

        // If video slug provided in URL, select it
        if (data.valid && videoSlug && data.videos) {
          const video = data.videos.find((v) => v.slug === videoSlug);
          if (video) setSelectedVideo(video);
        }
      } catch {
        setAccessData({ valid: false, error: 'Błąd weryfikacji dostępu' });
      } finally {
        setIsLoading(false);
      }
    }

    validateAccess();
  }, [token, videoSlug]);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Weryfikacja dostępu...</p>
        </div>
      </main>
    );
  }

  // Invalid or expired access
  if (!accessData?.valid || !accessData.videos) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {accessData?.error?.includes('wygasł') ? (
                  <Clock className="w-10 h-10 text-red-600" />
                ) : (
                  <Lock className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-4">
                {accessData?.error?.includes('wygasł')
                  ? 'Dostęp wygasł'
                  : 'Brak dostępu'}
              </h1>

              <p className="text-gray-600 mb-8">
                {accessData?.error ||
                  'Link jest nieprawidłowy lub dostęp wygasł. Zakup nowy dostęp, aby kontynuować ćwiczenia.'}
              </p>

              <div className="space-y-4">
                <Link
                  href="/video-pomoc"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-colors font-semibold text-lg"
                >
                  Kup dostęp ponownie
                </Link>

                <p className="text-sm text-gray-500">
                  Masz pytania?{' '}
                  <Link href="/contact" className="text-[#2563EB] hover:underline">
                    Skontaktuj się z nami
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  // Valid access - show content
  const { purchase, videos } = accessData;
  const isPackage = purchase?.product_type === 'full' || purchase?.product_type === 'standard';
  const isFullPackage = purchase?.product_type === 'full';
  const isStandardPackage = purchase?.product_type === 'standard';
  const daysRemaining = purchase?.days_remaining || 0;

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    if (!acc[video.category]) acc[video.category] = [];
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  // Filter videos by selected category
  const displayedVideos = selectedCategory
    ? videosByCategory[selectedCategory] || []
    : videos;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-8">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {isPackage ? 'Twoje materiały' : 'Twój materiał'}
              </h1>
              <p className="text-white/70 mt-1">
                {isFullPackage
                  ? `Pełny pakiet • Dostęp do ${videos.length} filmów`
                  : isStandardPackage
                  ? `Pakiet Standard • Dostęp do ${videos.length} filmów`
                  : 'Dostęp do wybranego filmu'}
              </p>
            </div>

            {/* Access info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>
                  Pozostało:{' '}
                  <strong>
                    {daysRemaining} {daysRemaining === 1 ? 'dzień' : 'dni'}
                  </strong>
                </span>
              </div>
              {purchase?.expires_at && (
                <div className="hidden sm:flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Wygasa:{' '}
                    {format(new Date(purchase.expires_at), 'd MMM yyyy', {
                      locale: pl,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Video player (if video selected) */}
      {selectedVideo && (
        <section className="py-8 bg-black">
          <Container>
            <VideoPlayer video={selectedVideo} />
            <div className="mt-4 text-white">
              <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className="text-white/70 mt-2">{selectedVideo.description}</p>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Main content */}
      <section className="py-8 lg:py-12">
        <Container>
          {/* Instructions for selected video */}
          {selectedVideo && (
            <div className="mb-8 grid md:grid-cols-2 gap-4">
              {selectedVideo.when_to_do && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    Kiedy wykonywać
                  </h3>
                  <p className="text-sm text-green-700">{selectedVideo.when_to_do}</p>
                </div>
              )}
              {selectedVideo.when_not_to_do && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Kiedy NIE wykonywać
                  </h3>
                  <p className="text-sm text-red-700">{selectedVideo.when_not_to_do}</p>
                </div>
              )}
            </div>
          )}

          {/* Category filter (for packages with multiple videos) */}
          {isPackage && Object.keys(videosByCategory).length > 1 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Wszystkie
                </button>
                {Object.keys(videosByCategory).map((category) => {
                  const categoryData = VIDEO_CATEGORIES.find(
                    (c) => c.slug === category
                  );
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {categoryData?.name || category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Video list */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A]">
              {selectedVideo
                ? isPackage
                  ? 'Inne dostępne ćwiczenia'
                  : ''
                : isPackage
                ? 'Wybierz ćwiczenie'
                : 'Twoje ćwiczenie'}
            </h2>

            {displayedVideos.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedVideos
                  .filter((v) => !selectedVideo || v.id !== selectedVideo.id)
                  .map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`text-left bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                        selectedVideo?.id === video.id
                          ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                          : 'border-gray-100 hover:border-[#2563EB]/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Play className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#0F172A] line-clamp-1">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak filmów w tej kategorii.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-12">
            <Disclaimer variant="full" />
          </div>
        </Container>
      </section>
    </main>
  );
}

/**
 * Secure video access page - /video-pomoc/watch
 * Wrapped in Suspense for useSearchParams
 */
export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Weryfikacja dostępu...</p>
          </div>
        </main>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
