"use client";

import { useState } from "react";
import {
  Home,
  Wrench,
  Building2,
  Briefcase,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore, type UserType } from "@/stores/user-store";

const ALL_ROLES: UserType[] = ["homeowner", "contractor", "strata", "property-manager"];

const ROLE_CONFIG: Record<
  UserType,
  { icon: React.ElementType; label: string; color: string; setupPath: string }
> = {
  homeowner: {
    icon: Home,
    label: "Homeowner",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    setupPath: "/onboarding?role=homeowner",
  },
  contractor: {
    icon: Wrench,
    label: "Contractor",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    setupPath: "/onboarding?role=contractor",
  },
  strata: {
    icon: Building2,
    label: "Strata Manager",
    color: "text-teal-600 bg-teal-50 dark:bg-teal-500/10",
    setupPath: "/onboarding?role=strata",
  },
  "property-manager": {
    icon: Briefcase,
    label: "Property Manager",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-500/10",
    setupPath: "/onboarding?role=property-manager",
  },
};

interface RoleSwitcherProps {
  collapsed?: boolean;
  onAddRole?: (role: UserType) => void;
}

export function RoleSwitcher({ collapsed, onAddRole }: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { activeRole, availableRoles, setActiveRole } = useUserStore();

  const currentRole = activeRole || availableRoles[0]?.role || "homeowner";
  const config = ROLE_CONFIG[currentRole];
  const Icon = config.icon;

  const configuredRoles = new Set(availableRoles.map((r) => r.role));

  const handleRoleClick = (role: UserType) => {
    if (configuredRoles.has(role)) {
      setActiveRole(role);
    } else if (onAddRole) {
      onAddRole(role);
    }
    setOpen(false);
  };

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
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <div className="absolute left-full top-0 z-50 ml-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-xl">
              {ALL_ROLES.map((role) => {
                const rc = ROLE_CONFIG[role];
                const RIcon = rc.icon;
                const isActive = role === currentRole;
                const isConfigured = configuredRoles.has(role);
                const rp = availableRoles.find((r) => r.role === role);
                return (
                  <button
                    key={role}
                    onClick={(e) => { e.stopPropagation(); handleRoleClick(role); }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg",
                      isConfigured ? rc.color : "bg-muted text-muted-foreground"
                    )}>
                      <RIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={cn("font-medium", !isConfigured && "text-muted-foreground")}>{rc.label}</p>
                      {rp?.propertyName && (
                        <p className="text-xs text-muted-foreground">{rp.propertyName}</p>
                      )}
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                    {!isConfigured && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          </>
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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-3 right-3 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-2 shadow-xl">
            <p className="mb-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Switch Dashboard
            </p>
            {ALL_ROLES.map((role) => {
              const rc = ROLE_CONFIG[role];
              const RIcon = rc.icon;
              const isActive = role === currentRole;
              const isConfigured = configuredRoles.has(role);
              const rp = availableRoles.find((r) => r.role === role);
              return (
                <button
                  key={role}
                  onClick={() => handleRoleClick(role)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-popover-foreground hover:bg-accent/50"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isConfigured ? rc.color : "bg-muted text-muted-foreground"
                  )}>
                    <RIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={cn("font-medium", !isConfigured && "text-muted-foreground")}>
                      {rc.label}
                    </p>
                    {isConfigured && rp?.propertyName && (
                      <p className="text-xs text-muted-foreground">{rp.propertyName}</p>
                    )}
                    {!isConfigured && (
                      <p className="text-xs text-muted-foreground">Set up</p>
                    )}
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                  {!isConfigured && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
