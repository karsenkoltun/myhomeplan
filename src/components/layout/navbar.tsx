"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, X } from "lucide-react";
import { motion } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/90 shadow-sm backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
            <Home className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <span className="text-base font-bold tracking-tight sm:text-lg">My Home Plan</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-md bg-primary/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
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
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:w-80">
            <div className="flex items-center justify-between pb-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">My Home Plan</span>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-0.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contractors" onClick={() => setOpen(false)}>For Contractors</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/plan-builder" onClick={() => setOpen(false)}>Build Your Plan</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
