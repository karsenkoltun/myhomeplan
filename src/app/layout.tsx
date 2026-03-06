import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
