'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, CheckCircle, AlertTriangle, CreditCard, MessageSquare, Clock, Shield } from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';

const features = [
  {
    icon: MessageSquare,
    title: 'Wywiad wstępny',
    description: 'Odpowiedz na kilka pytań o swoich dolegliwościach',
  },
  {
    icon: Bot,
    title: 'Rekomendacja usługi',
    description: 'Dowiedz się, która wizyta będzie dla Ciebie najlepsza',
  },
  {
    icon: Clock,
    title: 'Wskazówki',
    description: 'Otrzymaj porady przed i po masażu',
  },
  {
    icon: Shield,
    title: 'Bezpieczeństwo',
    description: 'Informacje o czerwonych flagach i kiedy iść do lekarza',
  },
];

export default function AIConsultationPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!agreed) {
      setError('Musisz zaakceptować warunki, aby kontynuować.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Wystąpił błąd podczas tworzenia płatności.');
      }
    } catch {
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[#2563EB] font-medium">Nowość</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              AI Konsultacja Wstępna
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Porozmawiaj z naszym asystentem AI, który pomoże Ci zorientować się,
              która usługa będzie dla Ciebie najlepsza. Otrzymasz również wskazówki
              przygotowujące do wizyty.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Features */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
                Co otrzymasz?
              </h2>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A] mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Notice */}
              <Card variant="bordered" className="mt-8 bg-amber-50 border-amber-200">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">
                        Ważna informacja
                      </h4>
                      <p className="text-amber-700 text-sm">
                        AI Konsultacja ma charakter wyłącznie informacyjny i orientacyjny.
                        Nie stanowi diagnozy medycznej ani porady lekarskiej.
                        Ostateczną ocenę zawsze przeprowadza terapeuta podczas wizyty osobistej.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Payment Card */}
            <div>
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-[#0F172A] mb-1">
                      10 <span className="text-xl">zł</span>
                    </div>
                    <p className="text-gray-500">jednorazowa opłata</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Rozmowa z asystentem AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Do 30 wiadomości w sesji</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Rekomendacja odpowiedniej usługi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Wskazówki przed i po masażu</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sesja ważna 24 godziny</span>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (e.target.checked) setError(null);
                      }}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-gray-600">
                      Rozumiem, że AI Konsultacja ma charakter informacyjny i{' '}
                      <strong>nie stanowi diagnozy medycznej</strong>. Akceptuję{' '}
                      <a href="/terms" className="text-[#2563EB] hover:underline">
                        regulamin
                      </a>
                      .
                    </span>
                  </label>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    isLoading={isLoading}
                    disabled={!agreed || isLoading}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Zapłać i rozpocznij
                  </Button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Bezpieczna płatność przez Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
