"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/auth-modal";
import { Menu, Home, X, ChevronDown, Building2, HardHat, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";

const navigation = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
];

const whoItsFor = [
  { name: "Homeowners", href: "/homeowners", icon: Home, desc: "Residential maintenance plans tailored for your home" },
  { name: "Contractors", href: "/contractors", icon: HardHat, desc: "Join our trusted contractor network and grow your business" },
  { name: "Strata Corporations", href: "/strata", icon: Building2, desc: "Comprehensive building maintenance solutions at scale" },
  { name: "Property Managers", href: "/property-managers", icon: Building2, desc: "Streamlined portfolio maintenance management tools" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a "Who It's For" subpage is active
  const isWhoItsForActive = whoItsFor.some((item) => pathname === item.href);

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 shadow-sm backdrop-blur-xl"
            : "bg-background/60 backdrop-blur-xl"
        }`}
      >
        {/* Subtle bottom border gradient */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon-192.png" alt="My Home Plan" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" priority />
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
              <button
                className={`group relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isWhoItsForActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Who It&apos;s For
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                {/* Hover underline animation */}
                <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                  isWhoItsForActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                }`} />
                {/* Active dot indicator */}
                {isWhoItsForActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 top-full z-50 mt-2 w-[480px] -translate-x-1/2 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-background to-muted/30 p-3 shadow-xl shadow-black/5"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {whoItsFor.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group/item flex items-start gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-primary/5 ${
                            pathname === item.href ? "bg-primary/[0.08]" : ""
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover/item:bg-primary/15">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-tight">{item.name}</p>
                            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
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
                  className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
                  {/* Hover underline animation */}
                  <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                  }`} />
                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="gap-1.5"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="shadow-lg shadow-primary/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <div className="flex items-center justify-between pb-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Image src="/icon-192.png" alt="My Home Plan" width={32} height={32} className="h-8 w-8" />
                  <span className="font-bold">My Home Plan</span>
                </Link>
                <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-0.5">
                {/* Who It's For section */}
                <p className="mb-1 mt-2 px-3 text-xs font-semibold text-muted-foreground">WHO IT&apos;S FOR</p>
                {whoItsFor.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}

                <div className="my-2 border-t" />

                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOpen(false);
                          setAuthModalOpen(true);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button size="sm" asChild className="shadow-lg shadow-primary/20">
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

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
