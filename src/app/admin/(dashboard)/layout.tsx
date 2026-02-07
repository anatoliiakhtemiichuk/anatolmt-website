'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Profile } from '@/types/admin';
import {
  LayoutDashboard,
  Calendar,
  CalendarOff,
  Users,
  LogOut,
  Menu,
  X,
  Loader2,
  ChevronRight,
  ShieldX,
  ArrowLeft,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/admin/appointments', label: 'Wizyty', icon: <Calendar className="w-5 h-5" /> },
  { href: '/admin/availability', label: 'Dostępność', icon: <CalendarOff className="w-5 h-5" /> },
  { href: '/admin/clients', label: 'Klienci', icon: <Users className="w-5 h-5" /> },
];

type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'unauthorized';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        router.replace('/admin/login');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        router.replace('/admin/login');
        return;
      }

      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setAuthState('unauthenticated');
          router.replace('/admin/login');
          return;
        }

        // Get profile with role from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError || !profileData) {
          // User exists but no profile - redirect to login
          await supabase.auth.signOut();
          setAuthState('unauthenticated');
          router.replace('/admin/login');
          return;
        }

        // SECURITY CHECK: Verify admin role from database
        if (profileData.role !== 'admin') {
          // User is authenticated but NOT an admin
          // Sign them out and show access denied
          await supabase.auth.signOut();
          setAuthState('unauthorized');
          return;
        }

        // User is authenticated AND is an admin
        setProfile(profileData as Profile);
        setAuthState('authenticated');
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState('unauthenticated');
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace('/admin/login');
  };

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Weryfikacja uprawnień...</p>
        </div>
      </div>
    );
  }

  // ACCESS DENIED - User is authenticated but not an admin
  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
              Brak uprawnień administratora
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-8">
              Twoje konto nie ma uprawnień do panelu administracyjnego.
              Dostęp jest ograniczony tylko do autoryzowanych administratorów.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Wróć do strony głównej
              </Link>

              <Link
                href="/admin/login"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Zaloguj się na inne konto
              </Link>
            </div>

            {/* Help text */}
            <p className="text-sm text-gray-500 mt-8">
              Jeśli uważasz, że powinnaś/powinieneś mieć dostęp,
              skontaktuj się z właścicielem systemu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated admin - show admin panel
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0F172A]">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M&T</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {profile?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile?.full_name || 'Administrator'}
              </p>
              <p className="text-white/50 text-xs truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Wyloguj się</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] z-50 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M&T</span>
          </div>
          <span className="text-white font-semibold">Admin</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-[#0F172A] z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Wyloguj się</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Top padding for mobile header */}
        <div className="lg:hidden h-16" />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              Panel
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-[#0F172A] font-medium">
                  {navItems.find((item) => pathname?.startsWith(item.href) && item.href !== '/admin')?.label || 'Strona'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
