"use client";

import { ChevronDown, Home, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  address?: string | null;
  city?: string | null;
  home_type?: string | null;
}

interface PropertySelectorProps {
  properties: Property[];
  activePropertyId: string | null;
  onSelect: (id: string) => void;
}

export function PropertySelector({ properties, activePropertyId, onSelect }: PropertySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (properties.length <= 1) return null;

  const active = properties.find((p) => p.id === activePropertyId) || properties[0];
  const label = active?.address || active?.city || "Property";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <Home className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="max-w-[200px] truncate">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-xl">
          {properties.map((p) => {
            const isActive = p.id === (activePropertyId || properties[0]?.id);
            return (
              <button
                key={p.id}
                onClick={() => { onSelect(p.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent/50"
                )}
              >
                <Home className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 text-left min-w-0">
                  <p className="truncate font-medium">{p.address || p.city || "Property"}</p>
                  {p.home_type && <p className="truncate text-xs text-muted-foreground capitalize">{p.home_type}</p>}
                </div>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
