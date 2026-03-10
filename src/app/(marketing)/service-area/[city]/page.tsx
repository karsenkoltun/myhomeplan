import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CITIES, getCityBySlug, getCityFAQs } from "@/data/service-areas";
import { ALL_TESTIMONIALS } from "@/data/testimonials";
import { SERVICES } from "@/data/services";
import { getPostsByTag } from "@/lib/blog";
import CityContent from "./city-content";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Home Maintenance in ${city.name}, BC | My Home Plan`;
  const description = `Professional home maintenance services in ${city.name}, ${city.region}. 32 services including lawn care, snow removal, HVAC, cleaning, and more. One monthly plan from $89/mo. Vetted local contractors.`;

  return {
    title,
    description,
    keywords: [
      `home maintenance ${city.name}`,
      `lawn care ${city.name}`,
      `snow removal ${city.name}`,
      `house cleaning ${city.name}`,
      `HVAC maintenance ${city.name}`,
      `home services ${city.name} BC`,
      `property maintenance ${city.region}`,
      `gutter cleaning ${city.name}`,
      `pest control ${city.name}`,
      "My Home Plan",
      "Okanagan home maintenance",
    ],
    openGraph: {
      title,
      description,
      url: `https://myhomeplan.ca/service-area/${city.slug}`,
      siteName: "My Home Plan",
      type: "website",
      images: [
        {
          url: "https://myhomeplan.ca/og-image.png",
          width: 1200,
          height: 630,
          alt: `My Home Plan - Home Maintenance in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://myhomeplan.ca/service-area/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const faqs = getCityFAQs(city);

  // Find a testimonial from this city, or fallback to any Okanagan homeowner testimonial
  const cityTestimonial =
    ALL_TESTIMONIALS.find(
      (t) =>
        t.audience === "homeowner" &&
        t.location.toLowerCase().includes(city.name.toLowerCase())
    ) ||
    ALL_TESTIMONIALS.find(
      (t) => t.audience === "homeowner"
    ) ||
    null;

  // Resolve nearby area links (only include cities that have pages)
  const nearbyLinks = city.nearbyAreas
    .map((name) => {
      const match = CITIES.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      return match ? { name: match.name, slug: match.slug } : null;
    })
    .filter(Boolean) as Array<{ name: string; slug: string }>;

  // Get related blog posts tagged with the city name
  const relatedPosts = getPostsByTag(city.name);
  const relatedPostSlugs = relatedPosts.slice(0, 3).map((p) => p.slug);

  // Build the service names for JSON-LD
  const serviceNames = SERVICES.map((s) => s.name);

  // Breadcrumb items
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Service Area", href: "/service-area" },
    { label: city.name },
  ];

  // JSON-LD: LocalBusiness + Service + GeoCircle
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://myhomeplan.ca/service-area/${city.slug}#business`,
        name: `My Home Plan - ${city.name}`,
        url: `https://myhomeplan.ca/service-area/${city.slug}`,
        email: "hello@myhomeplan.ca",
        description: `Professional home maintenance services in ${city.name}, BC. ${city.description}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressRegion: "BC",
          addressCountry: "CA",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: city.coordinates.lat,
          longitude: city.coordinates.lng,
        },
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: city.coordinates.lat,
            longitude: city.coordinates.lng,
          },
          geoRadius: "25000",
        },
        priceRange: "$89 - $249/month",
        serviceType: serviceNames,
        image: "https://myhomeplan.ca/og-image.png",
        sameAs: ["https://myhomeplan.ca"],
      },
      {
        "@type": "Service",
        "@id": `https://myhomeplan.ca/service-area/${city.slug}#service`,
        name: `Home Maintenance Services in ${city.name}`,
        provider: {
          "@id": `https://myhomeplan.ca/service-area/${city.slug}#business`,
        },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: city.region,
          },
        },
        serviceType: "Home Maintenance",
        description: `Complete home maintenance subscription covering ${SERVICES.length} professional services in ${city.name}, BC. Lawn care, snow removal, HVAC, cleaning, pest control, and more.`,
        offers: {
          "@type": "Offer",
          price: "89",
          priceCurrency: "CAD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "89",
            priceCurrency: "CAD",
            unitText: "MONTH",
          },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${city.name} Home Maintenance Services`,
          itemListElement: SERVICES.slice(0, 10).map((s, i) => ({
            "@type": "OfferCatalog",
            position: i + 1,
            name: s.name,
            description: s.description,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          ...(item.href && {
            item: `https://myhomeplan.ca${item.href}`,
          }),
        })),
      },
      // FAQ Schema
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-[1280px] px-6 pt-6 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Page Content */}
      <CityContent
        city={city}
        faqs={faqs}
        testimonial={cityTestimonial}
        nearbyLinks={nearbyLinks}
        relatedPostSlugs={relatedPostSlugs}
      />
    </>
  );
}
