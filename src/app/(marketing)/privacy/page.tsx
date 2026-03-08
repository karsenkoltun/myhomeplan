import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | My Home Plan",
  description:
    "My Home Plan privacy policy. How we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://myhomeplan.ca/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: March 7, 2026
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h2>1. Information We Collect</h2>
        <p>
          My Home Plan (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects information you provide
          directly, including your name, email address, phone number, property
          address, and payment information when you create an account or
          subscribe to our services.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide and manage your home maintenance services</li>
          <li>Process payments and send billing communications</li>
          <li>Match you with vetted local contractors</li>
          <li>Send service reminders and scheduling updates</li>
          <li>Improve our platform and customer experience</li>
          <li>Respond to support requests</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We share your information only with the contractors assigned to
          service your property (limited to what they need to perform the
          service) and with payment processors for billing. We do not sell your
          personal information.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted
          connections (TLS), secure data storage, and access controls to
          protect your personal information.
        </p>

        <h2>5. Cookies and Analytics</h2>
        <p>
          We use cookies and analytics tools (Google Analytics, Vercel
          Analytics) to understand how our website is used and to improve the
          experience. You can manage cookie preferences in your browser
          settings.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal
          information. Contact us at{" "}
          <a href="mailto:hello@myhomeplan.ca">hello@myhomeplan.ca</a> to
          exercise these rights.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          Questions about this policy? Email us at{" "}
          <a href="mailto:hello@myhomeplan.ca">hello@myhomeplan.ca</a>.
        </p>
        <p>
          My Home Plan
          <br />
          Kelowna, BC, Canada
        </p>
      </div>
    </div>
  );
}
