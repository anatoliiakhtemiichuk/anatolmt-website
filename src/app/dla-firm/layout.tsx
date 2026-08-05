import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Dla firm - Masaż dla pracowników | ${siteConfig.name}`,
  description: `Masaż i terapia manualna jako benefit dla pracowników biurowych. Wsparcie przy napięciach od pracy siedzącej. Współpraca B2B z gabinetem w ${siteConfig.address.district}.`,
  keywords: [
    'masaż dla firm Warszawa',
    'benefit pracowniczy masaż',
    'terapia manualna dla pracowników',
    'masaż biurowy Warszawa',
    'współpraca B2B masaż',
  ],
  openGraph: {
    title: `Dla firm - Masaż jako benefit pracowniczy | ${siteConfig.name}`,
    description: `Terapia manualna jako benefit dla pracowników biurowych. Redukcja bólu kręgosłupa, mniej zwolnień.`,
    url: `${siteConfig.url}/dla-firm`,
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
