import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Rezerwacja wizyty | ${siteConfig.name} - Masaż ${siteConfig.address.district}, Warszawa`,
  description: `Zarezerwuj wizytę w gabinecie ${siteConfig.name}. Masaż terapeutyczny ${siteConfig.address.district}, Warszawa. Rezerwacja online przez Booksy.`,
  keywords: [
    'rezerwacja masażu Warszawa',
    'umów wizytę masaż',
    'booking masaż Gocław',
    'rezerwacja online masaż',
  ],
  openGraph: {
    title: `Rezerwacja wizyty | ${siteConfig.name}`,
    description: `Zarezerwuj wizytę w gabinecie ${siteConfig.name}. Masaż terapeutyczny ${siteConfig.address.district}, Warszawa.`,
    url: `${siteConfig.url}/booking`,
    siteName: 'Anatol M&T',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anatol M&T - Rezerwacja wizyty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Rezerwacja wizyty | ${siteConfig.name}`,
    description: `Zarezerwuj wizytę w gabinecie ${siteConfig.name}. Masaż terapeutyczny ${siteConfig.address.district}, Warszawa.`,
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.url}/booking`,
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
