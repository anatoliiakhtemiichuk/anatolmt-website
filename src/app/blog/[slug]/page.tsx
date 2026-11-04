import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import { BreadcrumbSchema, BlogPostingSchema } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Nie znaleziono artykułu',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'article',
      publishedTime: post.date,
      authors: ['Anatol Akhtemiichuk'],
    },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Strona główna', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <BlogPostingSchema
        title={post.title}
        description={post.description}
        datePublished={post.date}
        slug={post.slug}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do bloga
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <span>|</span>
              <span>Anatol Akhtemiichuk</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-16 lg:py-24">
        <Container>
          <article className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:text-[#0F172A] prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
          </article>
        </Container>
      </section>

      {/* Back to Blog */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do listy artykułów
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function parseMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

  // Paragraphs (lines that don't start with HTML tags)
  const lines = html.split('\n');
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (
      trimmed === '' ||
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('</ul') ||
      trimmed.startsWith('</ol')
    ) {
      return line;
    }
    return `<p>${trimmed}</p>`;
  });

  html = processedLines.join('\n');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
}
