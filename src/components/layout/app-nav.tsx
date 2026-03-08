"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { NotificationBell } from "@/components/dashboard/notification-bell";

export function AppNav() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <nav className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo - visible on mobile, hidden on desktop (sidebar has it) */}
        <Link
          href="/account"
          className="flex items-center gap-2 lg:hidden"
        >
          <Image
            src="/icon-192.png"
            alt="My Home Plan"
            width={36}
            height={36}
            className="h-8 w-8 sm:h-9 sm:w-9"
          />
          <span className="text-base font-bold tracking-tight sm:text-lg">
            My Home Plan
          </span>
        </Link>

        {/* Spacer for desktop so the right items stay right-aligned */}
        <div className="hidden lg:block" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.email}
            </span>
          )}
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 min-h-[44px] min-w-[44px]"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
