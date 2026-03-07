import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BLOG_CATEGORIES, type BlogCategory } from "@/types/blog";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function BlogBreadcrumbs({
  category,
  postTitle,
}: {
  category?: BlogCategory;
  postTitle?: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  if (category) {
    items.push({
      label: BLOG_CATEGORIES[category].label,
      href: `/blog/category/${category}`,
    });
  }

  if (postTitle) {
    items.push({ label: postTitle });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[200px] truncate text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              ...(item.href && { item: `https://myhomeplan.ca${item.href}` }),
            })),
          }),
        }}
      />
    </nav>
  );
}
