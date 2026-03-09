"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { FAQ } from "@/components/ui/faq-tabs";
import { ArrowRight } from "lucide-react";
import { categories, faqData } from "./faq-data";

export default function FAQContent() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Help Center
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Frequently asked questions
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Everything you need to know about My Home Plan.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 sm:pb-32">
        <FadeIn delay={0.15}>
          <FAQ
            title=""
            subtitle=""
            categories={categories}
            faqData={faqData}
            className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-12"
          />
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Still have questions?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                We are happy to help. Reach out anytime.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/onboarding">
                  <ShimmerButton className="px-8 py-3 text-base">
                    Get Started{" "}
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:hello@myhomeplan.ca">Contact Us</a>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
