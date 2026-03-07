"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { FAQ } from "@/components/ui/faq-tabs";
import { ArrowRight } from "lucide-react";

const categories = {
  homeowners: "Homeowners",
  strata: "Strata",
  contractors: "Contractors",
};

const faqData = {
  homeowners: [
    { question: "What is My Home Plan?", answer: "My Home Plan is a monthly subscription service that bundles all your home maintenance needs into one simple plan. Instead of hiring and managing multiple contractors - you pay one monthly fee and we handle everything." },
    { question: "How much does it cost?", answer: "Plans start at $89/month for Essentials. Our most popular Home Care plan starts at $159/month, and Premium starts at $249/month. Quarterly plans save 5% and annual plans save 15%." },
    { question: "Can I cancel anytime?", answer: "Monthly plans are month-to-month with no contract. Quarterly and annual plans are prepaid but refundable on a prorated basis if you cancel early." },
    { question: "How are contractors vetted?", answer: "Business license check, $2M liability insurance, WorkSafe BC coverage, background check, reference check, and a probation period with quality monitoring." },
    { question: "What if I'm not happy with the service?", answer: "100% quality guarantee. If you're not satisfied, we'll send another contractor to redo it at no additional cost." },
    { question: "What areas do you serve?", answer: "The Okanagan Valley: Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. Expanding soon." },
  ],
  strata: [
    { question: "How does strata pricing work?", answer: "Per-unit per month, based on services selected and building size. Common areas and special features are factored into the rate." },
    { question: "Can the strata council approve the plan?", answer: "Yes. We provide detailed proposals with clear scope, pricing, and schedules that are easy to present at council meetings." },
    { question: "What about emergency repairs?", answer: "Mid-size and large plans include emergency response coverage. We coordinate emergency contractors and notify the strata manager." },
    { question: "Do you handle multiple buildings?", answer: "Yes. We manage multi-building complexes with coordinated maintenance schedules and dedicated account management." },
    { question: "Can we customize the service frequency?", answer: "Absolutely. Every building is different. We tailor frequency, scope, and scheduling to your specific needs and budget." },
  ],
  contractors: [
    { question: "Is there a cost to join?", answer: "Zero cost. You don't pay for leads, listings, or advertising." },
    { question: "How much do I get paid?", answer: "Contractors keep 70-80% of the service value, depending on tier and performance." },
    { question: "How fast do I get paid?", answer: "Within 7 days of job completion, every time. Direct deposit." },
    { question: "Do I have to accept every job?", answer: "No. You set your availability and service area. Accept or decline any job." },
    { question: "What are the requirements?", answer: "BC business license, $2M liability insurance, WorkSafe BC, 3+ years experience, clean background check, and 2 references." },
    { question: "Can I work with other companies too?", answer: "Yes. You're an independent contractor. No exclusivity required." },
  ],
};

export default function FAQPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeader
          badge="Help Center"
          badgeColor="primary"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about My Home Plan."
        />
      </section>

      <FAQ
        title=""
        subtitle=""
        categories={categories}
        faqData={faqData}
        className="mx-auto w-full max-w-4xl"
      />

      {/* CTA */}
      <FadeIn delay={0.3}>
        <div className="pb-16 text-center sm:pb-20">
          <p className="text-sm text-muted-foreground">Still have questions?</p>
          <div className="mt-3 flex flex-col items-center gap-2.5 sm:mt-4 sm:flex-row sm:justify-center sm:gap-3">
            <Link href="/onboarding">
              <ShimmerButton className="px-6 py-2.5 text-sm">
                Get Started <ArrowRight className="ml-2 inline h-4 w-4" />
              </ShimmerButton>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <a href="mailto:hello@myhomeplan.ca">Contact Us</a>
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
