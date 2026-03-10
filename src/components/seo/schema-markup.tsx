/**
 * Reusable JSON-LD Schema Markup Components
 *
 * These components render structured data (JSON-LD) for search engines and
 * AI crawlers. Each outputs a <script type="application/ld+json"> tag that
 * can be placed in any page or layout.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
  areaServed?: string[];
  priceRange?: string;
  image?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    type?: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  telephone?: string;
  email?: string;
  contactType?: string;
  sameAs?: string[];
  areaServed?: string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// ServiceSchema
// ---------------------------------------------------------------------------

export function ServiceSchema({
  name,
  description,
  url,
  provider = "My Home Plan",
  areaServed = [
    "Kelowna",
    "West Kelowna",
    "Vernon",
    "Penticton",
    "Lake Country",
    "Summerland",
    "Peachland",
  ],
  priceRange,
  image,
}: ServiceSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://myhomeplan.ca",
    },
    areaServed: areaServed.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "British Columbia",
        containedInPlace: {
          "@type": "Country",
          name: "Canada",
        },
      },
    })),
  };

  if (priceRange) data.priceRange = priceRange;
  if (image) data.image = image;

  return <JsonLd data={data} />;
}

// ---------------------------------------------------------------------------
// FAQSchema
// ---------------------------------------------------------------------------

export function FAQSchema({ items }: FAQSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// ---------------------------------------------------------------------------
// BreadcrumbSchema
// ---------------------------------------------------------------------------

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

// ---------------------------------------------------------------------------
// ReviewSchema (AggregateRating)
// ---------------------------------------------------------------------------

export function ReviewSchema({
  itemReviewed,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: ReviewSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": itemReviewed.type || "LocalBusiness",
    name: itemReviewed.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
  };

  return <JsonLd data={data} />;
}

// ---------------------------------------------------------------------------
// OrganizationSchema
// ---------------------------------------------------------------------------

export function OrganizationSchema({
  name = "My Home Plan",
  url = "https://myhomeplan.ca",
  logo = "https://myhomeplan.ca/icon-512.png",
  description = "All your home services, one monthly plan. My Home Plan is a monthly subscription platform that bundles home maintenance services into one affordable plan for homeowners in the Okanagan Valley, BC.",
  telephone,
  email = "hello@myhomeplan.ca",
  contactType = "customer service",
  sameAs = [],
  areaServed = [
    "Kelowna",
    "West Kelowna",
    "Vernon",
    "Penticton",
    "Lake Country",
    "Summerland",
    "Peachland",
  ],
  address = {
    addressLocality: "Kelowna",
    addressRegion: "BC",
    addressCountry: "CA",
  },
}: OrganizationSchemaProps = {}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    description,
    contactPoint: {
      "@type": "ContactPoint",
      ...(telephone ? { telephone } : {}),
      email,
      contactType,
      areaServed: "CA",
      availableLanguage: ["English"],
    },
    areaServed: areaServed.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "British Columbia",
        containedInPlace: {
          "@type": "Country",
          name: "Canada",
        },
      },
    })),
    address: {
      "@type": "PostalAddress",
      ...address,
    },
  };

  if (sameAs.length > 0) {
    data.sameAs = sameAs;
  }

  return <JsonLd data={data} />;
}
