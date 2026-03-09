"use client";

import { useState } from "react";
import {
  Home,
  Wrench,
  Building2,
  Briefcase,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore, type UserType, type RoleProfile } from "@/stores/user-store";

const ROLE_CONFIG: Record<
  UserType,
  { icon: React.ElementType; label: string; color: string }
> = {
  homeowner: {
    icon: Home,
    label: "Homeowner",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
  },
  contractor: {
    icon: Wrench,
    label: "Contractor",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
  },
  strata: {
    icon: Building2,
    label: "Strata Manager",
    color: "text-teal-600 bg-teal-50 dark:bg-teal-500/10",
  },
  "property-manager": {
    icon: Briefcase,
    label: "Property Manager",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-500/10",
  },
};

interface RoleSwitcherProps {
  collapsed?: boolean;
  onAddRole?: () => void;
}

export function RoleSwitcher({ collapsed, onAddRole }: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { activeRole, availableRoles, setActiveRole } = useUserStore();

  if (availableRoles.length <= 1 && !onAddRole) return null;

  const currentRole = activeRole || availableRoles[0]?.role || "homeowner";
  const config = ROLE_CONFIG[currentRole];
  const Icon = config.icon;

  if (collapsed) {
    return (
      <button
        onClick={() => setOpen(!open)}
        className="relative flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent min-h-[44px]"
        title={`Switch role (${config.label})`}
      >
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        {open && (
          <div className="absolute left-full top-0 z-50 ml-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-xl">
            {availableRoles.map((rp) => {
              const rc = ROLE_CONFIG[rp.role];
              const RIcon = rc.icon;
              const isActive = rp.role === currentRole;
              return (
                <button
                  key={`${rp.role}-${rp.propertyId || "default"}`}
                  onClick={() => {
                    setActiveRole(rp.role);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent/50"
                  )}
                >
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", rc.color)}>
                    <RIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{rc.label}</p>
                    {rp.propertyName && (
                      <p className="text-xs text-muted-foreground">{rp.propertyName}</p>
                    )}
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
            {onAddRole && (
              <button
                onClick={() => {
                  onAddRole();
                  setOpen(false);
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add another role
              </button>
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="relative px-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-sidebar-accent/50 px-3 py-2.5 text-left transition-all hover:bg-sidebar-accent"
      >
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.color)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {config.label}
          </p>
          {availableRoles.find((r) => r.role === currentRole)?.propertyName && (
            <p className="truncate text-xs text-sidebar-foreground/50">
              {availableRoles.find((r) => r.role === currentRole)?.propertyName}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute left-3 right-3 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-2 shadow-xl">
            <p className="mb-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Switch Dashboard
            </p>
            {availableRoles.map((rp) => {
              const rc = ROLE_CONFIG[rp.role];
              const RIcon = rc.icon;
              const isActive = rp.role === currentRole;
              return (
                <button
                  key={`${rp.role}-${rp.propertyId || "default"}`}
                  onClick={() => {
                    setActiveRole(rp.role);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-popover-foreground hover:bg-accent/50"
                  )}
                >
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", rc.color)}>
                    <RIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{rc.label}</p>
                    {rp.propertyName && (
                      <p className="text-xs text-muted-foreground">{rp.propertyName}</p>
                    )}
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
            {onAddRole && (
              <button
                onClick={() => {
                  onAddRole();
                  setOpen(false);
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add another role
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
