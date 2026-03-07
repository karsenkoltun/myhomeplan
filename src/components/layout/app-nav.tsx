"use client";

import Link from "next/link";
import { Home, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { NotificationBell } from "@/components/dashboard/notification-bell";

export function AppNav() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
            <Home className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            My Home Plan
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.email}
            </span>
          )}
          <NotificationBell />
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/account">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
