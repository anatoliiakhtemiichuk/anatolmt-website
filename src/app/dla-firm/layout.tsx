import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Dla firm - Masaż dla pracowników | ${siteConfig.name}`,
  description: `Masaż terapeutyczny jako benefit dla pracowników biurowych. Wsparcie przy napięciach od pracy siedzącej. Współpraca B2B z gabinetem w ${siteConfig.address.district}.`,
  keywords: [
    'masaż dla firm Warszawa',
    'benefit pracowniczy masaż',
    'masaż terapeutyczny dla pracowników',
    'masaż biurowy Warszawa',
    'współpraca B2B masaż',
  ],
  openGraph: {
    title: `Dla firm - Masaż jako benefit pracowniczy | ${siteConfig.name}`,
    description: `Masaż terapeutyczny jako benefit dla pracowników biurowych. Redukcja bólu kręgosłupa, mniej zwolnień.`,
    url: `${siteConfig.url}/dla-firm`,
    siteName: 'Anatol M&T',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anatol M&T - Masaż dla firm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Dla firm - Masaż jako benefit pracowniczy | ${siteConfig.name}`,
    description: `Masaż terapeutyczny jako benefit dla pracowników biurowych. Redukcja bólu kręgosłupa, mniej zwolnień.`,
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.url}/dla-firm`,
  },
};

export default function DlaFirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
