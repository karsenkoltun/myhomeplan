"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function TOCList({
  headings,
  activeId,
  onItemClick,
}: {
  headings: TOCItem[];
  activeId: string;
  onItemClick?: () => void;
}) {
  return (
    <ul className="space-y-1.5 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={cn(
              "block rounded-md py-1 transition-colors hover:text-foreground",
              heading.level === 3 ? "pl-4" : "pl-0",
              activeId === heading.id
                ? "font-medium text-primary"
                : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(heading.id)
                ?.scrollIntoView({ behavior: "smooth" });
              onItemClick?.();
            }}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function BlogTOC({ headings }: { headings: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block" aria-label="Table of contents">
      <div className="sticky top-24">
        <p className="mb-3 text-sm font-semibold">On this page</p>
        <TOCList headings={headings} activeId={activeId} />
      </div>
    </nav>
  );
}

/** Mobile-friendly collapsible TOC shown on screens smaller than xl */
export function BlogTOCMobile({ headings }: { headings: TOCItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="mb-6 xl:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="mt-2 rounded-lg border bg-background p-4">
          <TOCList
            headings={headings}
            activeId={activeId}
            onItemClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
