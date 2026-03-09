"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { BLOG_CATEGORIES, type BlogCategory } from "@/types/blog";
import { cn } from "@/lib/utils";

interface SearchablePost {
  title: string;
  slug: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  readingTime: number;
}

interface BlogSearchProps {
  posts: SearchablePost[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2 ? searchPosts(posts, query).slice(0, 6) : [];

  const handleSelect = useCallback(
    (slug: string) => {
      setQuery("");
      setIsOpen(false);
      router.push(`/blog/${slug}`);
    },
    [router]
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-10 pl-9 pr-8"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-popover p-1 shadow-lg">
          {results.length > 0 ? (
            <ul>
              {results.map((post, i) => (
                <li key={post.slug}>
                  <button
                    onClick={() => handleSelect(post.slug)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                      activeIndex === i ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {BLOG_CATEGORIES[post.category].label}
                        </Badge>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              No articles found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function searchPosts(posts: SearchablePost[], query: string): SearchablePost[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return posts
    .map((post) => {
      const searchable = `${post.title} ${post.description} ${post.tags.join(" ")} ${post.category}`.toLowerCase();
      let score = 0;

      for (const term of terms) {
        if (post.title.toLowerCase().includes(term)) score += 10;
        if (post.description.toLowerCase().includes(term)) score += 5;
        if (post.tags.some((t) => t.toLowerCase().includes(term))) score += 3;
        if (searchable.includes(term)) score += 1;
      }

      return { post, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.post);
}
