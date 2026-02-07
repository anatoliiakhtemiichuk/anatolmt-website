'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar } from 'lucide-react';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Strona główna', href: '/' },
  { name: 'Rezerwacja', href: '/booking' },
  { name: 'Wideo Pomoc', href: '/video-pomoc' },
  { name: 'Cennik', href: '/prices' },
  { name: 'Kontakt', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm">M&T</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-[#0F172A] text-lg">
                M&T ANATOL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 relative py-2',
                  isActive(item.href)
                    ? 'text-[#2563EB]'
                    : 'text-gray-600 hover:text-[#0F172A]'
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Umów wizytę
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-[#0F172A] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive(item.href)
                    ? 'bg-[#2563EB]/10 text-[#2563EB]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F172A]'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 mx-4 flex items-center justify-center gap-2 bg-[#2563EB] text-white px-5 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-[#1D4ED8]"
            >
              <Calendar className="w-4 h-4" />
              Umów wizytę
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
