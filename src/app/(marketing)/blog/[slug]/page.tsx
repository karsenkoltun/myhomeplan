import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
} from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogTOC } from "@/components/blog/blog-toc";
import { BlogFAQ } from "@/components/blog/blog-faq";
import { BlogShareButtons } from "@/components/blog/blog-share";
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts";
import { BlogCTABanner, BlogCTACompare } from "@/components/blog/blog-cta";
import { ArticleJsonLd } from "@/components/blog/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/types/blog";
import { Calendar, Clock, ArrowRight, Sparkles, MapPin, CheckCircle, Calculator } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle || `${post.title} | My Home Plan Blog`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.description,
      url: `https://myhomeplan.ca/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage.src,
              alt: post.featuredImage.alt,
              width: post.featuredImage.width || 1200,
              height: post.featuredImage.height || 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://myhomeplan.ca/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const categoryInfo = BLOG_CATEGORIES[post.category];
  const relatedPosts = getRelatedPosts(
    post.slug,
    post.category,
    post.tags,
    3,
    post.relatedPosts
  );

  return (
    <>
      <ArticleJsonLd post={post} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <BlogBreadcrumbs category={post.category} postTitle={post.title} />

        <div className="grid gap-8 lg:grid-cols-[1fr_280px] xl:grid-cols-[220px_1fr_300px]">
          {/* Left TOC (xl screens) */}
          <div className="hidden xl:block">
            <BlogTOC headings={post.headings} />
          </div>

          {/* Main content */}
          <article className="min-w-0">
            {/* Post header */}
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Link href={`/blog/category/${post.category}`}>
                  <Badge variant="secondary">{categoryInfo.label}</Badge>
                </Link>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {post.title}
              </h1>

              <p className="mt-3 text-lg text-muted-foreground">
                {post.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {post.author.name}
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
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <span className="text-xs">
                    (Updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    )
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
              </div>

              <div className="mt-4">
                <BlogShareButtons title={post.title} slug={post.slug} />
              </div>
            </header>

            {/* Featured image */}
            {post.featuredImage && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  width={post.featuredImage.width || 1200}
                  height={post.featuredImage.height || 630}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* MDX content */}
            <div className="prose-custom">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>

            {/* FAQ section */}
            {post.faq && post.faq.length > 0 && (
              <BlogFAQ items={post.faq} />
            )}

            {/* Bottom CTA */}
            <BlogCTACompare />

            {/* Share again */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <BlogShareButtons title={post.title} slug={post.slug} />
              <Button variant="outline" size="sm" asChild>
                <Link href="/blog">All Articles</Link>
              </Button>
            </div>

            {/* Related posts */}
            <BlogRelatedPosts posts={relatedPosts} />
          </article>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Get Your Plan CTA */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Get Your Home Plan</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    All your home maintenance in one monthly plan. Vetted
                    contractors, predictable pricing.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/plan-builder">
                      Build Your Plan{" "}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pricing CTA */}
              <Card className="border-green-500/20 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Plans from $89/mo</h3>
                  </div>
                  <ul className="mb-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      14 professional services
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      Vetted, insured contractors
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      Save up to 15% annually
                    </li>
                  </ul>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/pricing">
                      View Plans <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Service area */}
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Serving the Okanagan</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Kelowna",
                      "West Kelowna",
                      "Penticton",
                      "Vernon",
                      "Lake Country",
                      "Peachland",
                      "Summerland",
                    ].map((city) => (
                      <Badge
                        key={city}
                        variant="secondary"
                        className="text-xs"
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* TOC for lg screens (not xl which has left TOC) */}
              <div className="xl:hidden">
                <Card>
                  <CardContent className="p-5">
                    <p className="mb-3 text-sm font-semibold">On this page</p>
                    <ul className="space-y-1.5 text-sm">
                      {post.headings
                        .filter((h) => h.level === 2)
                        .map((heading) => (
                          <li key={heading.id}>
                            <a
                              href={`#${heading.id}`}
                              className="block py-0.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {heading.text}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
