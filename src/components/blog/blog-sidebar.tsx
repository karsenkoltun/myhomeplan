import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPostCard,
} from "@/types/blog";

export function BlogSidebar({
  categories,
  popularPosts,
  tags,
}: {
  categories: Array<{ category: BlogCategory; count: number }>;
  popularPosts: BlogPostCard[];
  tags: Array<{ tag: string; count: number }>;
}) {
  return (
    <aside className="space-y-6">
      <SidebarCTA />
      <SidebarCategories categories={categories} />
      <SidebarPopularPosts posts={popularPosts} />
      <SidebarPlanCTA />
      <SidebarTagCloud tags={tags} />
      <SidebarServiceArea />
    </aside>
  );
}

function SidebarCTA() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Get Your Home Plan</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          All your home maintenance in one monthly plan. Vetted contractors,
          guaranteed scheduling, predictable pricing.
        </p>
        <Button asChild className="w-full">
          <Link href="/plan-builder">
            Build Your Plan <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SidebarCategories({
  categories,
}: {
  categories: Array<{ category: BlogCategory; count: number }>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Categories</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1.5">
          {categories.map(({ category, count }) => (
            <li key={category}>
              <Link
                href={`/blog/category/${category}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <span>{BLOG_CATEGORIES[category].label}</span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SidebarPopularPosts({ posts }: { posts: BlogPostCard[] }) {
  if (posts.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Popular Articles</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-md p-1.5 transition-colors hover:bg-muted"
              >
                <p className="text-sm font-medium leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {post.readingTime} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SidebarPlanCTA() {
  return (
    <Card className="border-green-500/20 bg-green-50 dark:bg-green-950/20">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">See What You&apos;d Save</h3>
        </div>
        <ul className="mb-4 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
            Plans starting at $89/mo
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
            Save up to 15% with annual billing
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
            14 professional services included
          </li>
        </ul>
        <Button variant="outline" asChild className="w-full">
          <Link href="/pricing">
            View Plans <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SidebarTagCloud({
  tags,
}: {
  tags: Array<{ tag: string; count: number }>;
}) {
  if (tags.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Popular Topics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 20).map(({ tag }) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SidebarServiceArea() {
  const cities = [
    "Kelowna",
    "West Kelowna",
    "Penticton",
    "Vernon",
    "Lake Country",
    "Peachland",
    "Summerland",
  ];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Serving the Okanagan</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {cities.map((city) => (
            <Badge key={city} variant="secondary" className="text-xs">
              {city}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
