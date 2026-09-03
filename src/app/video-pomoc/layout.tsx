import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Wideo Pomoc - Ćwiczenia wspierające | ${siteConfig.name}`,
  description: `Filmy z ćwiczeniami wspierającymi do wykonywania w domu. Mobilizacja, wzmacnianie, rozciąganie. Materiały edukacyjne po wizycie.`,
  keywords: [
    'ćwiczenia wspierające wideo',
    'ćwiczenia na kręgosłup',
    'ćwiczenia rozciągające online',
    'filmy z ćwiczeniami',
  ],
  openGraph: {
    title: `Wideo Pomoc - Ćwiczenia terapeutyczne | ${siteConfig.name}`,
    description: `Filmy z ćwiczeniami terapeutycznymi do wykonywania w domu po wizycie.`,
    url: `${siteConfig.url}/video-pomoc`,
    siteName: 'Anatol M&T',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anatol M&T - Wideo Pomoc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Wideo Pomoc - Ćwiczenia terapeutyczne | ${siteConfig.name}`,
    description: `Filmy z ćwiczeniami terapeutycznymi do wykonywania w domu po wizycie.`,
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.url}/video-pomoc`,
  },
};

export default function VideoPomocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
