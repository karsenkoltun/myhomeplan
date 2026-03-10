import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { OrganizationSchema } from "@/components/seo/schema-markup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  title: "My Home Plan | All Your Home Services, One Monthly Plan",
  description:
    "Subscribe to a monthly plan covering lawn care, snow removal, HVAC, cleaning, pest control, and more. Vetted contractors, guaranteed scheduling, predictable pricing. Serving the Okanagan Valley, BC.",
  keywords: [
    "home services",
    "home maintenance",
    "monthly plan",
    "lawn care",
    "snow removal",
    "HVAC",
    "Okanagan",
    "Kelowna",
    "BC",
    "contractors",
  ],
  openGraph: {
    title: "My Home Plan | All Your Home Services, One Monthly Plan",
    description:
      "One subscription. Every home service. Zero hassle. Serving the Okanagan Valley, BC.",
    url: "https://myhomeplan.ca",
    siteName: "My Home Plan",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://myhomeplan.ca/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Home Plan - One Plan. One Payment. Your Entire Home Handled.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Home Plan | All Your Home Services, One Monthly Plan",
    description:
      "One subscription. Every home service. Zero hassle. Serving the Okanagan Valley, BC.",
    images: ["https://myhomeplan.ca/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "My Home Plan",
              description:
                "All your home services, one monthly plan. Serving the Okanagan Valley, BC.",
              url: "https://myhomeplan.ca",
              areaServed: {
                "@type": "Place",
                name: "Okanagan Valley, British Columbia, Canada",
              },
              serviceArea: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 49.888,
                  longitude: -119.496,
                },
                geoRadius: "100km",
              },
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kelowna",
                addressRegion: "BC",
                addressCountry: "CA",
              },
            }),
          }}
        />
        <OrganizationSchema
          sameAs={[
            "https://www.facebook.com/myhomeplan",
            "https://www.instagram.com/myhomeplan",
            "https://www.linkedin.com/company/myhomeplan",
          ]}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
