import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
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
    'Profesjonalna terapia manualna i masaż. Umów wizytę online. Doświadczony terapeuta, indywidualne podejście do każdego pacjenta.',
  keywords: [
    'terapia manualna',
    'masaż',
    'fizjoterapia',
    'terapia',
    'Polska',
    'rezerwacja online',
    'M&T ANATOL',
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
      'Profesjonalna terapia manualna i masaż. Umów wizytę online.',
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
