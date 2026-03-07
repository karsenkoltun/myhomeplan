"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
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
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
