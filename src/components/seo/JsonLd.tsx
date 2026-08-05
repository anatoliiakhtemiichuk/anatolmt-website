import { siteConfig } from '@/config/site';

/**
 * LocalBusiness JSON-LD Schema
 * For homepage - represents the therapy practice
 */
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: `${siteConfig.url}/og-image.jpg`,
    logo: `${siteConfig.url}/logo.png`,
    priceRange: '$$',
    currenciesAccepted: 'PLN',
    paymentAccepted: 'Cash, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: siteConfig.hours.schema.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: siteConfig.social.rating,
      reviewCount: siteConfig.social.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [siteConfig.links.instagram, siteConfig.links.booksy],
    areaServed: siteConfig.areas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Usługi terapeutyczne',
      itemListElement: siteConfig.services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.shortDescription,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Service JSON-LD Schema
 * For individual service pages or service listings
 */
interface ServiceSchemaProps {
  serviceId?: string;
}

export function ServiceSchema({ serviceId }: ServiceSchemaProps = {}) {
  const services = serviceId
    ? siteConfig.services.filter((s) => s.id === serviceId)
    : siteConfig.services;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${siteConfig.url}/uslugi/${service.id}`,
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'HealthAndBeautyBusiness',
          name: siteConfig.name,
          '@id': `${siteConfig.url}/#business`,
        },
        areaServed: {
          '@type': 'City',
          name: 'Warszawa',
        },
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: service.priceFrom,
            priceCurrency: 'PLN',
            minPrice: service.priceFrom,
          },
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage JSON-LD Schema
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: readonly FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD Schema
 */
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite JSON-LD Schema
 * For sitelinks searchbox
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'HealthAndBeautyBusiness',
      '@id': `${siteConfig.url}/#business`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
