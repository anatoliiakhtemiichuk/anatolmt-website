'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient, isSupabaseConfigured, getSupabaseConfigError } from '@/lib/supabaseClient';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Settings } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Check Supabase configuration on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigError(getSupabaseConfigError());
    }
  }, []);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check if admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile?.role === 'admin') {
            router.replace(redirectPath);
          }
        }
      } catch (err) {
        // Ignore errors during auth check
        console.error('Auth check error:', err);
      }
    };

    if (isSupabaseConfigured()) {
      checkAuth();
    }
  }, [router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        throw new Error(getSupabaseConfigError() || 'Supabase nie jest skonfigurowany');
      }

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Nieprawidłowy email lub hasło');
        }
        if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Email nie został potwierdzony. Sprawdź skrzynkę pocztową.');
        }
        throw new Error(signInError.message);
      }

      if (!data.user) {
        throw new Error('Nie udało się zalogować');
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error('Nie znaleziono profilu użytkownika. Skontaktuj się z administratorem.');
      }

      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Brak uprawnień administratora');
      }

      // Success - redirect to admin dashboard
      router.replace(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  // Show configuration error
  if (configError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do strony głównej
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Brak konfiguracji</h1>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
              <p className="text-sm text-orange-800 font-medium mb-2">
                Supabase nie jest skonfigurowany:
              </p>
              <p className="text-sm text-orange-700">{configError}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-3">
              <p className="font-medium text-gray-700">Aby naprawić:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Utwórz plik <code className="bg-gray-200 px-1 rounded">.env.local</code> w katalogu głównym projektu</li>
                <li>Dodaj zmienne środowiskowe:
                  <pre className="mt-2 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
                  </pre>
                </li>
                <li>Uruchom ponownie serwer deweloperski</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Panel Administracyjny</h1>
            <p className="text-gray-500 mt-2">Zaloguj się, aby zarządzać rezerwacjami</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logowanie...
                </>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Dostęp tylko dla autoryzowanych użytkowników
            </p>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-white/40 text-sm mt-6">
          Połączenie zabezpieczone protokołem SSL
        </p>
      </div>
    </main>
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
