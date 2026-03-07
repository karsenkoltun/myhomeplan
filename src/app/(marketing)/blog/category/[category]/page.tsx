import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories, getAllTags } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BLOG_CATEGORIES, type BlogCategory } from "@/types/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return Object.keys(BLOG_CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = category as BlogCategory;
  const info = BLOG_CATEGORIES[cat];
  if (!info) return {};

  return {
    title: `${info.label} Articles | My Home Plan Blog`,
    description: `${info.description}. Expert guides and tips for Okanagan homeowners.`,
    alternates: {
      canonical: `https://myhomeplan.ca/blog/category/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = category as BlogCategory;
  const info = BLOG_CATEGORIES[cat];
  if (!info) notFound();

  const posts = getPostsByCategory(cat);
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BlogBreadcrumbs category={cat} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {info.label}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {info.description}
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/blog">
          <Badge
            variant="outline"
            className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            All Posts
          </Badge>
        </Link>
        {(Object.keys(BLOG_CATEGORIES) as BlogCategory[]).map((c) => (
          <Link key={c} href={`/blog/category/${c}`}>
            <Badge
              variant={c === cat ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {BLOG_CATEGORIES[c].label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-lg font-medium">
                No posts in this category yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We're working on content for {info.label.toLowerCase()}.
                Check back soon.
              </p>
            </div>
          )}
        </div>

        <BlogSidebar
          categories={categories}
          popularPosts={posts.slice(0, 5)}
          tags={tags}
        />
      </div>
    </div>
  );
}
