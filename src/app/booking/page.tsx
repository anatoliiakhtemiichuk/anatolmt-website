'use client';

/**
 * TEMPORARY BOOKING PAGE - BOOKSY REDIRECT
 *
 * Internal booking system has been temporarily disabled.
 * Users are redirected to Booksy for reservations.
 *
 * TO RESTORE INTERNAL BOOKING:
 * 1. Restore original booking/page.tsx from git history
 * 2. Update Header.tsx, Footer.tsx, page.tsx, prices/page.tsx to use href="/booking"
 */

import { Calendar, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui';

const BOOKSY_URL = 'https://anatolmt.booksy.com/a/';

export default function BookingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Rezerwacja wizyty</h1>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <Container size="sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-10 h-10 text-[#2563EB]" />
            </div>

            {/* Message */}
            <p className="text-lg lg:text-xl text-gray-700 mb-10 leading-relaxed max-w-lg mx-auto">
              Na ten moment rezerwacja online została wyłączona. Rezerwacja odbywa się przez Booksy.
            </p>

            {/* CTA Button */}
            <a
              href={BOOKSY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20"
            >
              <Calendar className="w-5 h-5" />
              Zarezerwuj wizytę przez Booksy
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
