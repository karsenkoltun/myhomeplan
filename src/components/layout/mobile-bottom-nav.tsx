"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Calendar,
  User,
  Wrench,
  Building2,
  Briefcase,
  Check,
  X,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore, type UserType } from "@/stores/user-store";

const ROLE_CONFIG: Record<
  UserType,
  { icon: React.ElementType; label: string; color: string }
> = {
  homeowner: { icon: Home, label: "Homeowner", color: "text-emerald-600 bg-emerald-50" },
  contractor: { icon: Wrench, label: "Contractor", color: "text-blue-600 bg-blue-50" },
  strata: { icon: Building2, label: "Strata", color: "text-teal-600 bg-teal-50" },
  "property-manager": { icon: Briefcase, label: "PM", color: "text-violet-600 bg-violet-50" },
};

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Home", href: "/account", icon: Home },
  { label: "Services", href: "/account/services", icon: ClipboardList },
  { label: "Bookings", href: "/account/book", icon: Calendar },
  { label: "Account", href: "/account/settings", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const { activeRole, availableRoles, setActiveRole } = useUserStore();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  const currentRole = activeRole || "homeowner";
  const showRoleSwitcherBtn = availableRoles.length > 1;

  return (
    <>
      {/* Role switcher bottom sheet */}
      {showSwitcher && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSwitcher(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Switch Dashboard</h3>
              <button onClick={() => setShowSwitcher(false)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {availableRoles.map((rp) => {
                const rc = ROLE_CONFIG[rp.role];
                const RIcon = rc.icon;
                const isActive = rp.role === currentRole;
                return (
                  <button
                    key={`${rp.role}-${rp.propertyId || "default"}`}
                    onClick={() => {
                      setActiveRole(rp.role);
                      setShowSwitcher(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-colors",
                      isActive ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", rc.color)}>
                      <RIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{rc.label}</p>
                      {rp.propertyName && (
                        <p className="text-xs text-muted-foreground">{rp.propertyName}</p>
                      )}
                    </div>
                    {isActive && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden",
          "pb-[env(safe-area-inset-bottom)]"
        )}
      >
        {/* Role switcher bar (only shows when multiple roles available) */}
        {showRoleSwitcherBtn && (
          <button
            onClick={() => setShowSwitcher(true)}
            className="flex w-full items-center justify-center gap-2 border-b border-border/50 bg-accent/30 px-4 py-1.5"
          >
            {(() => {
              const rc = ROLE_CONFIG[currentRole];
              const RIcon = rc.icon;
              return (
                <>
                  <RIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">{rc.label}</span>
                  <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                </>
              );
            })()}
          </button>
        )}
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {mobileNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors",
                "min-h-[44px] min-w-[44px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
      </nav>
    </>
  );
}
