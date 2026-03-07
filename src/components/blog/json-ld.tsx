import type { BlogPost } from "@/types/blog";

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.featuredImage?.src,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "My Home Plan",
      url: "https://myhomeplan.ca",
      logo: {
        "@type": "ImageObject",
        url: "https://myhomeplan.ca/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://myhomeplan.ca/blog/${post.slug}`,
    },
    url: `https://myhomeplan.ca/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    wordCount: post.content.split(/\s+/).length,
    articleSection: post.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "My Home Plan",
    url: "https://myhomeplan.ca",
    email: "hello@myhomeplan.ca",
    description:
      "Home maintenance subscription platform serving the Okanagan Valley, BC. One monthly plan covers lawn care, snow removal, HVAC, cleaning, and 10+ professional services.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kelowna",
      addressRegion: "BC",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Kelowna" },
      { "@type": "City", name: "West Kelowna" },
      { "@type": "City", name: "Penticton" },
      { "@type": "City", name: "Vernon" },
      { "@type": "City", name: "Lake Country" },
      { "@type": "City", name: "Peachland" },
      { "@type": "City", name: "Summerland" },
    ],
    priceRange: "$89 - $249/month",
    serviceType: [
      "Lawn Care",
      "Snow Removal",
      "House Cleaning",
      "HVAC Maintenance",
      "Plumbing Inspection",
      "Electrical Inspection",
      "Pest Control",
      "Gutter Cleaning",
      "Pressure Washing",
      "Window Washing",
      "Carpet Cleaning",
      "Handyman Services",
      "Painting",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
