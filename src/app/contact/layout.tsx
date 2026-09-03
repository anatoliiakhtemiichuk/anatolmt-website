import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Kontakt | ${siteConfig.name} - Masaż terapeutyczny Warszawa`,
  description: `Skontaktuj się z gabinetem ${siteConfig.name}. ${siteConfig.address.full}. Tel: ${siteConfig.contact.phone}. Rezerwacja wizyty online.`,
  keywords: [
    'kontakt masaż Warszawa',
    'gabinet masażu Gocław',
    'masaż Praga-Południe',
    'rezerwacja masażu Warszawa',
  ],
  openGraph: {
    title: `Kontakt | ${siteConfig.name}`,
    description: `Skontaktuj się z gabinetem ${siteConfig.name}. ${siteConfig.address.full}. Tel: ${siteConfig.contact.phone}.`,
    url: `${siteConfig.url}/contact`,
    siteName: 'Anatol M&T',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anatol M&T - Kontakt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Kontakt | ${siteConfig.name}`,
    description: `Skontaktuj się z gabinetem ${siteConfig.name}. ${siteConfig.address.full}. Tel: ${siteConfig.contact.phone}.`,
    images: ['/og-image.jpg'],
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
