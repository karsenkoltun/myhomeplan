"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, X, ChevronDown, Building2, HardHat, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";

const navigation = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "Packages", href: "/pricing" },
  { name: "Plan Builder", href: "/plan-builder" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
];

const whoItsFor = [
  { name: "Homeowners", href: "/homeowners", icon: Home, desc: "Residential maintenance plans" },
  { name: "Contractors", href: "/contractors", icon: HardHat, desc: "Join our contractor network" },
  { name: "Strata Corporations", href: "/strata", icon: Building2, desc: "Building maintenance solutions" },
  { name: "Property Managers", href: "/property-managers", icon: Building2, desc: "Portfolio maintenance management" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
          {/* Who It's For Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Who It&apos;s For
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border bg-background p-2 shadow-xl"
                >
                  {whoItsFor.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="gap-1.5">
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
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
              {/* Who It's For section */}
              <p className="mb-1 mt-2 px-3 text-xs font-semibold text-muted-foreground">WHO IT&apos;S FOR</p>
              {whoItsFor.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}

              <div className="my-2 border-t" />

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
                {user ? (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/account" onClick={() => setOpen(false)}>
                        <User className="mr-1.5 h-4 w-4" /> Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setOpen(false); signOut(); }}>
                      <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
