'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Disclaimer } from '@/components/video';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  CheckCircle2,
  Play,
  Calendar,
  Clock,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface PurchaseData {
  product_type: 'single' | 'standard' | 'full';
  video_id: string | null;
  expires_at: string;
  access_token: string;
}

/**
 * Success page content component
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const sessionId = searchParams.get('session_id');

  const [isLoading, setIsLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPurchaseData() {
      if (!token && !sessionId) {
        setError('Brak tokenu dostępu');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/video/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, session_id: sessionId }),
        });

        const data = await response.json();

        if (data.valid && data.purchase) {
          setPurchaseData({
            product_type: data.purchase.product_type,
            video_id: data.purchase.video_id,
            expires_at: data.purchase.expires_at,
            access_token: token || data.purchase.access_token,
          });
        } else {
          setError(data.error || 'Nie udało się zweryfikować zakupu');
        }
      } catch {
        setError('Wystąpił błąd podczas weryfikacji');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchaseData();
  }, [token, sessionId]);

  const accessUrl =
    purchaseData && typeof window !== 'undefined'
      ? `${window.location.origin}/video-pomoc/watch?token=${purchaseData.access_token}`
      : '';

  const copyToClipboard = async () => {
    if (accessUrl) {
      await navigator.clipboard.writeText(accessUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExpirationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "d MMMM yyyy, HH:mm", { locale: pl });
  };

  const getDaysRemaining = (dateStr: string) => {
    const now = new Date();
    const expiration = new Date(dateStr);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Weryfikacja płatności...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !purchaseData) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-4">
              Wystąpił problem
            </h1>
            <p className="text-gray-600 mb-8">
              {error || 'Nie udało się zweryfikować zakupu.'}
            </p>
            <div className="space-y-4">
              <Link
                href="/video-pomoc"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
              >
                Wróć do Wideo Pomoc
              </Link>
              <p className="text-sm text-gray-500">
                Jeśli dokonałeś płatności, sprawdź swoją skrzynkę email lub
                skontaktuj się z nami.
              </p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const daysRemaining = getDaysRemaining(purchaseData.expires_at);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Success hero */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Płatność zakończona sukcesem!
            </h1>

            <p className="text-lg text-white/80 mb-8">
              {purchaseData.product_type === 'full'
                ? 'Masz teraz dostęp do wszystkich materiałów wideo.'
                : purchaseData.product_type === 'standard'
                ? 'Masz teraz dostęp do 10-12 wybranych materiałów wideo.'
                : 'Masz teraz dostęp do wybranego materiału wideo.'}
            </p>

            {/* Access CTA */}
            <Link
              href={`/video-pomoc/watch?token=${purchaseData.access_token}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-all font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Play className="w-6 h-6" />
              Otwórz materiały
            </Link>
          </div>
        </Container>
      </section>

      {/* Access details */}
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Access info card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-[#0F172A] text-lg mb-4">
                Informacje o dostępie
              </h2>

              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Rodzaj zakupu</span>
                  <span className="font-medium text-[#0F172A]">
                    {purchaseData.product_type === 'full'
                      ? 'Pełny pakiet'
                      : purchaseData.product_type === 'standard'
                      ? 'Pakiet Standard'
                      : 'Pojedynczy film'}
                  </span>
                </div>

                {/* Expiration */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Dostęp wygasa</span>
                  </div>
                  <span className="font-medium text-[#0F172A]">
                    {formatExpirationDate(purchaseData.expires_at)}
                  </span>
                </div>

                {/* Days remaining */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Pozostało</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {daysRemaining}{' '}
                    {daysRemaining === 1
                      ? 'dzień'
                      : daysRemaining < 5
                      ? 'dni'
                      : 'dni'}
                  </span>
                </div>
              </div>
            </div>

            {/* Access link card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-[#0F172A] mb-2">
                Twój link dostępu
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Zapisz ten link – pozwoli Ci on wrócić do materiałów w dowolnym
                momencie w ciągu 30 dni.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={accessUrl}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Kopiuj link"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-sm text-green-600">
                  Link skopiowany do schowka!
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-[#0F172A] mb-4">
                Wskazówki
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Możesz oglądać materiały na dowolnym urządzeniu – wystarczy
                    otworzyć link.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Zapisz link w zakładkach przeglądarki lub wyślij go do
                    siebie mailem.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Ćwiczenia wykonuj zgodnie z zaleceniami otrzymanymi podczas
                    wizyty.
                  </span>
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <Disclaimer variant="compact" />
          </div>
        </Container>
      </section>
    </main>
  );
}

/**
 * Payment success page - /video-pomoc/success
 * Wrapped in Suspense for useSearchParams
 */
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Weryfikacja płatności...</p>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
