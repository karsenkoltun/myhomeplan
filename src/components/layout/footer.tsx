import Link from "next/link";
import { Home } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Plan Builder", href: "/plan-builder" },
    { name: "Service Area", href: "/service-area" },
  ],
  "Who It's For": [
    { name: "Homeowners", href: "/homeowners" },
    { name: "Contractors", href: "/contractors" },
    { name: "Strata Corporations", href: "/strata" },
    { name: "Property Managers", href: "/property-managers" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  Account: [
    { name: "Get Started", href: "/onboarding" },
    { name: "My Account", href: "/account" },
    { name: "My Property", href: "/account/property" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">My Home Plan</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground break-words">
              One plan. Every service. Zero stress. Serving the Okanagan
              Valley, BC.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="mt-3 space-y-0.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground min-h-[44px] leading-relaxed"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} My Home Plan. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Kelowna, BC</span>
            <span>-</span>
            <a
              href="mailto:hello@myhomeplan.ca"
              className="py-2 transition-colors hover:text-foreground"
            >
              hello@myhomeplan.ca
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
