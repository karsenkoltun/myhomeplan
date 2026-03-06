"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight, Home, Users } from "lucide-react";

const homeownerFaqs = [
  { q: "What is My Home Plan?", a: "My Home Plan is a monthly subscription service that bundles all your home maintenance needs into one simple plan. Instead of hiring and managing multiple contractors for lawn care, snow removal, HVAC, cleaning, pest control, and more - you pay one monthly fee and we handle everything." },
  { q: "How much does it cost?", a: "Plans start at $89/month for our Essentials plan (lawn care + snow removal). Our most popular Home Care plan starts at $159/month, and our Premium plan starts at $249/month. You can also build a custom plan with exactly the services you need. Quarterly plans save 5% and annual plans save 15%." },
  { q: "Can I cancel anytime?", a: "Monthly plans are month-to-month with no contract - cancel anytime. Quarterly and annual plans are prepaid but refundable on a prorated basis if you need to cancel early." },
  { q: "How do I schedule a service?", a: "Through your online dashboard, you can book any service included in your plan. Select the service type, preferred date and time, and we'll match you with the best available contractor in your area." },
  { q: "What if I'm not happy with the service?", a: "We have a 100% quality guarantee. If you're not satisfied with any service, we'll send another contractor to redo it at no additional cost." },
  { q: "What if I need a service not on my plan?", a: "You can add any service a la carte through your dashboard at any time. You'll get our network pricing, which is typically 10-15% below market rate." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes. Upgrades take effect immediately. Downgrades take effect at your next billing cycle." },
  { q: "How are contractors vetted?", a: "Every contractor goes through: business license check, proof of liability insurance ($2M minimum), WorkSafe BC coverage verification, background check, reference check, and a probation period with quality monitoring." },
  { q: "Can I choose my contractor?", a: "Yes. You can browse available contractors in your area and request specific ones. Otherwise, we automatically match you with the highest-rated available contractor." },
  { q: "What areas do you serve?", a: "We currently serve the Okanagan Valley including Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. We're expanding to more BC cities soon." },
  { q: "Is there a scheduling guarantee?", a: "Yes. We guarantee your service will happen within your scheduled window. If we can't make it work, your next service is free." },
  { q: "How is this different from a home warranty?", a: "Home warranties only cover breakdowns and repairs. My Home Plan covers proactive maintenance and regular services - lawn care, cleaning, HVAC tune-ups, pest control, and more. We prevent problems before they happen." },
];

const contractorFaqs = [
  { q: "Is there a cost to join?", a: "No. Zero cost to join our contractor network. You don't pay for leads, listings, or advertising." },
  { q: "How much do I get paid?", a: "Contractors keep 70-80% of the service value, depending on your tier and performance." },
  { q: "How fast do I get paid?", a: "Within 7 days of job completion, every time. We pay via direct deposit." },
  { q: "Do I have to accept every job?", a: "No. You set your availability and service area. You can accept or decline any job." },
  { q: "What are the requirements?", a: "Valid BC business license, proof of liability insurance ($2M minimum), WorkSafe BC coverage, 3+ years of experience, clean background check, and 2 professional references." },
  { q: "How many jobs will I get?", a: "Depends on your service area and subscriber count. We commit to a minimum job volume based on your capacity." },
  { q: "What if a customer has a complaint?", a: "We handle all customer communication and dispute resolution. If a redo is needed, you'll be compensated." },
  { q: "Can I work with other companies too?", a: "Yes. You're an independent contractor. We don't require exclusivity." },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">Help Center</Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">Everything you need to know about My Home Plan.</p>
        </div>
      </FadeIn>

      {/* Homeowner FAQ */}
      <FadeIn delay={0.1}>
        <div className="mt-12 sm:mt-16" id="homeowners">
          <div className="mb-4 flex items-center gap-3 sm:mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
              <Home className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">For Homeowners</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-1.5 sm:space-y-2">
            {homeownerFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`homeowner-${i}`} className="rounded-xl border bg-card px-3 sm:px-4">
                <AccordionTrigger className="text-left text-xs font-semibold hover:no-underline sm:text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground sm:text-sm">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FadeIn>

      {/* Contractor FAQ */}
      <FadeIn delay={0.2}>
        <div className="mt-12 sm:mt-16" id="contractors">
          <div className="mb-4 flex items-center gap-3 sm:mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 sm:h-10 sm:w-10">
              <Users className="h-4 w-4 text-sky-600 sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">For Contractors</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-1.5 sm:space-y-2">
            {contractorFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`contractor-${i}`} className="rounded-xl border bg-card px-3 sm:px-4">
                <AccordionTrigger className="text-left text-xs font-semibold hover:no-underline sm:text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground sm:text-sm">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.3}>
        <div className="mt-12 text-center sm:mt-16">
          <p className="text-sm text-muted-foreground">Still have questions?</p>
          <div className="mt-3 flex flex-col items-center gap-2.5 sm:mt-4 sm:flex-row sm:justify-center sm:gap-3">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/plan-builder">Build Your Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <a href="mailto:hello@myhomeplan.ca">Contact Us</a>
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
