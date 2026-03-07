import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { BLOG_CATEGORIES, type BlogPostCard } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPostCard }) {
  const categoryInfo = BLOG_CATEGORIES[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        {post.featuredImage && (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {categoryInfo.label}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readingTime} min read
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function BlogCardFeatured({ post }: { post: BlogPostCard }) {
  const categoryInfo = BLOG_CATEGORIES[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
        <div className="grid md:grid-cols-2">
          {post.featuredImage && (
            <div className="aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-[320px]">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <CardContent className="flex flex-col justify-center p-6 md:p-8">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="text-xs">Featured</Badge>
              <Badge variant="secondary" className="text-xs">
                {categoryInfo.label}
              </Badge>
            </div>

            <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary md:text-3xl">
              {post.title}
            </h2>

            <p className="mb-4 text-muted-foreground">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
