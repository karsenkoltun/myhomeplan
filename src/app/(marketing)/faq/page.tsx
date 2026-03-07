"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { ArrowRight, Home, Users, Building2 } from "lucide-react";

const homeownerFaqs = [
  { q: "What is My Home Plan?", a: "My Home Plan is a monthly subscription service that bundles all your home maintenance needs into one simple plan. Instead of hiring and managing multiple contractors - you pay one monthly fee and we handle everything." },
  { q: "How much does it cost?", a: "Plans start at $89/month for Essentials. Our most popular Home Care plan starts at $159/month, and Premium starts at $249/month. You can also build a custom plan. Quarterly plans save 5% and annual plans save 15%." },
  { q: "Can I cancel anytime?", a: "Monthly plans are month-to-month with no contract. Quarterly and annual plans are prepaid but refundable on a prorated basis if you cancel early." },
  { q: "How do I schedule a service?", a: "Through your online dashboard. Select the service type, preferred date and time, and we'll match you with the best available contractor." },
  { q: "What if I'm not happy with the service?", a: "100% quality guarantee. If you're not satisfied, we'll send another contractor to redo it at no additional cost." },
  { q: "What if I need a service not on my plan?", a: "Add any service a la carte through your dashboard. You'll get our network pricing, typically 10-15% below market rate." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes. Upgrades take effect immediately. Downgrades take effect at your next billing cycle." },
  { q: "How are contractors vetted?", a: "Business license check, $2M liability insurance, WorkSafe BC coverage, background check, reference check, and a probation period with quality monitoring." },
  { q: "Can I choose my contractor?", a: "Yes. Browse available contractors and request specific ones, or let us auto-match you with the highest-rated available." },
  { q: "What areas do you serve?", a: "The Okanagan Valley: Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. Expanding soon." },
  { q: "How is this different from a home warranty?", a: "Home warranties cover breakdowns and repairs. We cover proactive maintenance and regular services - preventing problems before they happen." },
];

const strataFaqs = [
  { q: "How does strata pricing work?", a: "Per-unit per month, based on services selected and building size. Common areas and special features are factored into the rate." },
  { q: "Can the strata council approve the plan?", a: "Yes. We provide detailed proposals with clear scope, pricing, and schedules that are easy to present at council meetings." },
  { q: "What about emergency repairs?", a: "Mid-size and large plans include emergency response coverage. We coordinate emergency contractors and notify the strata manager." },
  { q: "Do you handle multiple buildings?", a: "Yes. We manage multi-building complexes with coordinated maintenance schedules and dedicated account management." },
  { q: "Can we customize the service frequency?", a: "Absolutely. Every building is different. We tailor frequency, scope, and scheduling to your specific needs and budget." },
  { q: "Is there a minimum contract term?", a: "Month-to-month, quarterly (5% savings), and annual (12% savings) options available." },
];

const contractorFaqs = [
  { q: "Is there a cost to join?", a: "Zero cost. You don't pay for leads, listings, or advertising." },
  { q: "How much do I get paid?", a: "Contractors keep 70-80% of the service value, depending on tier and performance." },
  { q: "How fast do I get paid?", a: "Within 7 days of job completion, every time. Direct deposit." },
  { q: "Do I have to accept every job?", a: "No. You set your availability and service area. Accept or decline any job." },
  { q: "What are the requirements?", a: "BC business license, $2M liability insurance, WorkSafe BC, 3+ years experience, clean background check, and 2 references." },
  { q: "How many jobs will I get?", a: "Depends on service area and subscriber count. We commit to minimum job volume based on your capacity." },
  { q: "What if a customer has a complaint?", a: "We handle all customer communication and dispute resolution. If a redo is needed, you'll be compensated." },
  { q: "Can I work with other companies too?", a: "Yes. You're an independent contractor. No exclusivity required." },
];

const sections = [
  {
    id: "homeowners",
    icon: Home,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "For Homeowners",
    faqs: homeownerFaqs,
  },
  {
    id: "strata",
    icon: Building2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    title: "For Strata Corporations",
    faqs: strataFaqs,
  },
  {
    id: "contractors",
    icon: Users,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-500/10",
    title: "For Contractors",
    faqs: contractorFaqs,
  },
];

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

      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        {sections.map((section, sectionIndex) => (
          <FadeIn key={section.id} delay={sectionIndex * 0.1}>
            <div className="mt-12 sm:mt-16" id={section.id}>
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.iconBg} sm:h-10 sm:w-10`}>
                  <section.icon className={`h-4 w-4 ${section.iconColor} sm:h-5 sm:w-5`} />
                </div>
                <h2 className="text-xl font-bold sm:text-2xl">{section.title}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-2">
                {section.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.id}-${i}`}
                    className="rounded-xl border bg-card px-4 transition-colors hover:border-primary/20"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        ))}

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-12 text-center sm:mt-16">
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
    </div>
  );
}
