import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, Leaf, Thermometer, Sparkles, Bug, PaintBucket, Wrench, Building2, MapPin } from "lucide-react";
import { BLOG_CATEGORIES, type BlogPostCard, type BlogCategory } from "@/types/blog";

const CATEGORY_ICONS: Record<BlogCategory, React.ElementType> = {
  "outdoor-maintenance": Leaf,
  "indoor-cleaning": Sparkles,
  "home-systems": Thermometer,
  "specialty-services": Wrench,
  "seasonal-guides": Calendar,
  "homeowner-tips": Home,
  "cost-guides": PaintBucket,
  "strata-property-management": Building2,
  "local-okanagan": MapPin,
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  "outdoor-maintenance": "from-emerald-500/20 to-emerald-600/10 text-emerald-600",
  "indoor-cleaning": "from-violet-500/20 to-violet-600/10 text-violet-600",
  "home-systems": "from-orange-500/20 to-orange-600/10 text-orange-600",
  "specialty-services": "from-blue-500/20 to-blue-600/10 text-blue-600",
  "seasonal-guides": "from-amber-500/20 to-amber-600/10 text-amber-600",
  "homeowner-tips": "from-sky-500/20 to-sky-600/10 text-sky-600",
  "cost-guides": "from-rose-500/20 to-rose-600/10 text-rose-600",
  "strata-property-management": "from-indigo-500/20 to-indigo-600/10 text-indigo-600",
  "local-okanagan": "from-teal-500/20 to-teal-600/10 text-teal-600",
};

function CategoryPlaceholder({ category }: { category: BlogCategory }) {
  const Icon = CATEGORY_ICONS[category] || Home;
  const colors = CATEGORY_COLORS[category] || "from-primary/20 to-primary/10 text-primary";
  return (
    <div className={`flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${colors}`}>
      <Icon className="h-10 w-10 opacity-60" />
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPostCard }) {
  const categoryInfo = BLOG_CATEGORIES[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        {post.featuredImage ? (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <CategoryPlaceholder category={post.category} />
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
          {post.featuredImage ? (
            <div className="aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-[320px]">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 md:aspect-auto md:min-h-[320px]">
              <Home className="h-16 w-16 text-primary/30" />
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
