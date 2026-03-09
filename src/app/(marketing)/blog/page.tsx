import type { Metadata } from "next";
import { getAllPosts, getAllCategories, getAllTags, getFeaturedPosts } from "@/lib/blog";
import { BlogCard, BlogCardFeatured } from "@/components/blog/blog-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogSearch } from "@/components/blog/blog-search";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { OrganizationJsonLd } from "@/components/blog/json-ld";
import { BLOG_CATEGORIES, type BlogCategory } from "@/types/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Home Maintenance Blog | Tips, Guides & Cost Breakdowns | My Home Plan",
  description:
    "Expert home maintenance tips, seasonal checklists, cost guides, and DIY vs pro comparisons for Okanagan homeowners. Learn how to protect your home and save money.",
  keywords: [
    "home maintenance blog",
    "home maintenance tips",
    "Okanagan home care",
    "lawn care tips",
    "HVAC maintenance guide",
    "home cleaning tips",
    "snow removal guide",
    "home maintenance cost",
    "Kelowna home services",
  ],
  openGraph: {
    title: "Home Maintenance Blog | My Home Plan",
    description:
      "Expert home maintenance tips, seasonal checklists, and cost guides for Okanagan homeowners.",
    url: "https://myhomeplan.ca/blog",
    type: "website",
    images: [
      {
        url: "https://myhomeplan.ca/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Home Plan - One Plan. One Payment. Your Entire Home Handled.",
      },
    ],
  },
  alternates: {
    canonical: "https://myhomeplan.ca/blog",
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const featured = featuredPosts[0] || allPosts[0];
  const posts = allPosts.filter((p) => p.slug !== featured?.slug);

  // Build lightweight search index for client component
  const searchablePosts = allPosts.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category,
    tags: p.tags,
    readingTime: p.readingTime,
  }));

  return (
    <>
      <OrganizationJsonLd />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <BlogBreadcrumbs />

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Home Maintenance Blog
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
              Expert tips, seasonal checklists, cost breakdowns, and everything
              Okanagan homeowners need to protect their biggest investment.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <BlogSearch posts={searchablePosts} />
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/blog">
            <Badge variant="default" className="cursor-pointer">
              All Posts
            </Badge>
          </Link>
          {(Object.keys(BLOG_CATEGORIES) as BlogCategory[]).map((cat) => (
            <Link key={cat} href={`/blog/category/${cat}`}>
              <Badge
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {BLOG_CATEGORIES[cat].label}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <div className="mb-10">
            <BlogCardFeatured post={featured} />
          </div>
        )}

        {/* Main content + sidebar */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Post grid with pagination */}
          <div>
            {posts.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
                <BlogPagination totalItems={posts.length} itemsPerPage={12} />
              </>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center">
                <p className="text-lg font-medium">
                  Blog posts coming soon
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;re working on in-depth guides for every home maintenance
                  topic. Check back soon.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <BlogSidebar
            categories={categories}
            popularPosts={allPosts.slice(0, 5)}
            tags={tags}
          />
        </div>
      </div>

      {/* Blog listing schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Home Maintenance Blog",
            description:
              "Expert home maintenance tips and guides for Okanagan homeowners",
            url: "https://myhomeplan.ca/blog",
            publisher: {
              "@type": "Organization",
              name: "My Home Plan",
              url: "https://myhomeplan.ca",
            },
          }),
        }}
      />
    </>
  );
}
