'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, MessageSquare, Loader2 } from 'lucide-react';
import { Container, Card, CardContent, Button } from '@/components/ui';

export default function AISuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // In a real implementation, verify the session is paid
    // For now, we'll simulate verification
    const verifySession = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      // Simulate API verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For MVP, assume payment is successful if session_id exists
      setIsValid(true);
      setIsVerifying(false);
    };

    verifySession();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <section className="py-24 lg:py-32">
        <Container size="sm">
          <Card className="text-center py-16">
            <CardContent>
              <Loader2 className="w-12 h-12 text-[#2563EB] mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
                Weryfikacja płatności...
              </h1>
              <p className="text-gray-600">Proszę czekać</p>
            </CardContent>
          </Card>
        </Container>
      </section>
    );
  }

  if (!sessionId || !isValid) {
    return (
      <section className="py-24 lg:py-32">
        <Container size="sm">
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-4">
                Brak aktywnej sesji
              </h1>
              <p className="text-gray-600 mb-6">
                Nie znaleziono sesji lub płatność nie została zrealizowana.
              </p>
              <Button variant="primary" onClick={() => router.push('/ai')}>
                Wróć do AI Konsultacji
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32">
      <Container size="sm">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-[#0F172A] mb-4">
              Płatność udana!
            </h1>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Dziękujemy za zakup AI Konsultacji. Możesz teraz rozpocząć rozmowę
              z naszym asystentem, który pomoże Ci wybrać odpowiednią usługę.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-[#0F172A] mb-3">
                Co Cię czeka:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Krótki wywiad o Twoich dolegliwościach</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Rekomendacja odpowiedniej usługi</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Wskazówki przygotowujące do wizyty</span>
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(`/ai/chat?session=${sessionId}`)}
              className="min-w-[250px]"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Rozpocznij konsultację
            </Button>

            <p className="text-xs text-gray-400 mt-4">
              Sesja ważna przez 24 godziny • Maksymalnie 30 wiadomości
            </p>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
