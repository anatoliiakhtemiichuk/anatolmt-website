import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { LenisProvider } from '@/components/providers';
import { getSiteUrl } from '@/lib/config';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'M&T ANATOL',
    template: '%s | M&T ANATOL',
  },
  description:
    'Profesjonalny masaż terapeutyczny i masaż tkanek głębokich. Umów wizytę online. Doświadczony masażysta, indywidualne podejście do każdego klienta.',
  keywords: [
    'masaż leczniczy',
    'masaż terapeutyczny',
    'masaż Warszawa',
    'masaż tkanek głębokich Warszawa',
    'rezerwacja online',
    'ANATOL M&T',
  ],
  authors: [{ name: 'M&T ANATOL' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    siteName: 'M&T ANATOL',
    title: 'M&T ANATOL',
    description:
      'Profesjonalny masaż terapeutyczny i masaż tkanek głębokich. Umów wizytę online.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-[#0F172A] flex flex-col`}
      >
        <LenisProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
