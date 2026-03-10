"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  Calendar,
  User,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import type { UserType } from "@/stores/user-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/account", icon: Home },
  { label: "Plan Builder", href: "/account/plan-builder", icon: Hammer },
  { label: "Services", href: "/account/services", icon: ClipboardList },
  { label: "Bookings", href: "/account/book", icon: Calendar },
  { label: "Property", href: "/account/property", icon: Building2 },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/account/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleAddRole = (role: UserType) => {
    router.push(`/onboarding?role=${role}`);
  };

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar lg:flex",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <Link href="/account" className="flex shrink-0 items-center gap-3">
          <Image
            src="/icon-192.png"
            alt="My Home Plan"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          {!collapsed && (
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
              My Home Plan
            </span>
          )}
        </Link>
      </div>

      {/* Role switcher */}
      <div className="border-b border-sidebar-border py-3">
        <RoleSwitcher collapsed={collapsed} onAddRole={handleAddRole} />
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className={cn("mb-3 px-3", collapsed && "hidden")}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Menu
          </p>
        </div>

        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "min-h-[44px]",
                collapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  active
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                )}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge && item.badge > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white",
                    collapsed
                      ? "absolute -right-0.5 -top-0.5 h-4 min-w-[16px] px-1"
                      : "ml-auto"
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className={cn("mb-1", collapsed && "hidden")}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Account
          </p>
        </div>

        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                "min-h-[44px]",
                collapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "mt-2 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/50 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "min-h-[44px]",
            collapsed ? "justify-center" : "gap-3"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4.5 w-4.5 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
