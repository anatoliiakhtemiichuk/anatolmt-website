import type { Metadata } from 'next';

/**
 * Admin Layout
 * Prevents search engine indexing of admin pages
 */
export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s | Admin Panel',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
