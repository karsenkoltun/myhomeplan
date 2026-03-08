import type { Metadata } from "next";
import FAQContent from "./faq-content";
import { faqData } from "./faq-data";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions | My Home Plan",
  description:
    "Get answers to common questions about My Home Plan's home service subscriptions, pricing, contractor vetting, service areas, and satisfaction guarantee.",
  openGraph: {
    title: "FAQ | Frequently Asked Questions | My Home Plan",
    description:
      "Get answers to common questions about My Home Plan's home service subscriptions, pricing, contractor vetting, service areas, and satisfaction guarantee.",
    url: "https://myhomeplan.ca/faq",
    siteName: "My Home Plan",
    type: "website",
  },
};

function FAQPageSchema() {
  const allQuestions = Object.values(faqData).flat();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
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

export default function FAQPage() {
  return (
    <>
      <FAQPageSchema />
      <FAQContent />
    </>
  );
}
