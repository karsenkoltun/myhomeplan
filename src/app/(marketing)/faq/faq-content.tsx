"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { FAQ } from "@/components/ui/faq-tabs";
import { ArrowRight } from "lucide-react";
import { categories, faqData } from "./faq-data";

export default function FAQContent() {
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
