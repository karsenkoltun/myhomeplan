import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | My Home Plan",
  description:
    "My Home Plan terms of service. The terms governing your use of our home maintenance platform.",
  alternates: {
    canonical: "https://myhomeplan.ca/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: March 7, 2026
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using My Home Plan&apos;s website and services, you
          agree to be bound by these Terms of Service. If you do not agree,
          please do not use our services.
        </p>

        <h2>2. Service Description</h2>
        <p>
          My Home Plan provides a subscription-based home maintenance
          management platform. We coordinate vetted contractors to perform
          home services on your behalf, including but not limited to lawn
          care, snow removal, HVAC maintenance, cleaning, and pest control.
        </p>

        <h2>3. Subscriptions and Billing</h2>
        <ul>
          <li>
            Plans are billed monthly, quarterly, or annually based on your
            selection
          </li>
          <li>Prices are based on your property details and selected services</li>
          <li>Monthly plans can be cancelled anytime with no penalty</li>
          <li>
            Quarterly and annual plans provide discounted rates and are
            subject to the billing period commitment
          </li>
        </ul>

        <h2>4. Service Guarantees</h2>
        <ul>
          <li>
            <strong>Satisfaction Guarantee:</strong> If you&apos;re not
            satisfied with a service, we&apos;ll re-do it at no additional
            cost
          </li>
          <li>
            <strong>Price Lock:</strong> Your subscription rate will not
            increase during your billing period
          </li>
          <li>
            <strong>Scheduling Guarantee:</strong> Services will be performed
            within the agreed-upon timeframe
          </li>
        </ul>

        <h2>5. Contractor Network</h2>
        <p>
          All contractors in our network are vetted, licensed, and insured. My
          Home Plan acts as an intermediary and is not the direct employer of
          contractors.
        </p>

        <h2>6. User Responsibilities</h2>
        <ul>
          <li>Provide accurate property information</li>
          <li>Ensure safe access to the property for service delivery</li>
          <li>Report issues within 48 hours of service completion</li>
          <li>Maintain current payment information</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          My Home Plan is not liable for indirect, incidental, or
          consequential damages. Our total liability is limited to the amount
          you paid for services in the preceding 12 months.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. We will notify you of
          material changes via email or through our platform.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These terms are governed by the laws of British Columbia, Canada.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions? Contact us at{" "}
          <a href="mailto:hello@myhomeplan.ca">hello@myhomeplan.ca</a>.
        </p>
      </div>
    </div>
  );
}
