import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { Container, Card, CardContent } from '@/components/ui';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artykuły o masażu, napięciu mięśni i pracy z ciałem. Blog Anatol M&T Warszawa.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: 'Blog | M&T ANATOL',
    description: 'Artykuły o masażu, napięciu mięśni i pracy z ciałem.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Strona główna', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-gray-300">
              Artykuły o masażu, napięciu mięśni i pracy z ciałem.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts List */}
      <section className="py-16 lg:py-24">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Brak artykułów.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <Card variant="bordered" className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    {post.image && (
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>
                      <h2 className="text-xl font-semibold text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3 mb-4">{post.description}</p>
                      <span className="inline-flex items-center gap-1 text-[#2563EB] font-medium group-hover:gap-2 transition-all">
                        Czytaj więcej <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
