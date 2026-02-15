'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (value && index === 5) {
      const fullPin = newPin.join('');
      if (fullPin.length === 6) {
        handleSubmit(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newPin = pastedData.split('');
      setPin(newPin);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (pinValue?: string) => {
    const fullPin = pinValue || pin.join('');

    if (fullPin.length !== 6) {
      setError('Wprowadź 6-cyfrowy PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nieprawidłowy PIN');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setIsLoading(false);
        return;
      }

      // Success - redirect to admin panel
      router.push(redirect);
    } catch (err) {
      setError('Błąd połączenia. Spróbuj ponownie.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563EB] rounded-2xl mb-4 shadow-lg shadow-[#2563EB]/25">
            <span className="text-white font-bold text-xl">M&T</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Panel Administracyjny</h1>
          <p className="text-white/60 mt-2">Wprowadź PIN, aby kontynuować</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-[#0F172A] rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* PIN input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                6-cyfrowy PIN administratora
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                ))}
              </div>

              {/* Show/Hide PIN toggle */}
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="mt-3 mx-auto flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPin ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ukryj PIN
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Pokaż PIN
                  </>
                )}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || pin.join('').length !== 6}
              className="w-full py-4 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Weryfikacja...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Zaloguj się
                </>
              )}
            </button>
          </div>

          {/* Security note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Dostęp tylko dla autoryzowanych administratorów.
            <br />
            Wszystkie próby logowania są rejestrowane.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          M&T ANATOL &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
