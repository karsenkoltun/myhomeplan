"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Home,
  X,
} from "lucide-react";

const navigation = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Plan Builder", href: "/plan-builder" },
  { name: "Contractors", href: "/contractors" },
  { name: "Service Area", href: "/service-area" },
  { name: "FAQ", href: "/faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">
              My Home Plan
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contractors">For Contractors</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/plan-builder">Build Your Plan</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex items-center justify-between pb-6">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">My Home Plan</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                <Button variant="outline" asChild>
                  <Link
                    href="/contractors"
                    onClick={() => setOpen(false)}
                  >
                    For Contractors
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href="/plan-builder"
                    onClick={() => setOpen(false)}
                  >
                    Build Your Plan
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
