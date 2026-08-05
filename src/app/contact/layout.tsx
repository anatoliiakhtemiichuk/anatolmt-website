import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Kontakt | ${siteConfig.name} - Masaż i terapia manualna Warszawa`,
  description: `Skontaktuj się z gabinetem ${siteConfig.name}. ${siteConfig.address.full}. Tel: ${siteConfig.contact.phone}. Rezerwacja wizyty online.`,
  keywords: [
    'kontakt masaż Warszawa',
    'gabinet masażu Saska Kępa',
    'terapeuta manualny Praga Południe',
    'rezerwacja masażu Warszawa',
  ],
  openGraph: {
    title: `Kontakt | ${siteConfig.name}`,
    description: `Skontaktuj się z gabinetem ${siteConfig.name}. ${siteConfig.address.full}. Tel: ${siteConfig.contact.phone}.`,
    url: `${siteConfig.url}/contact`,
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
