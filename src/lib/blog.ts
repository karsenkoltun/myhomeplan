import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogPost,
  BlogPostCard,
  BlogPostFrontmatter,
  BlogCategory,
} from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({
      id,
      text,
      level: match[1].length,
    });
  }

  return headings;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as BlogPostFrontmatter;
  const stats = readingTime(content);
  const headings = extractHeadings(content);

  return {
    ...frontmatter,
    slug,
    content,
    readingTime: Math.ceil(stats.minutes),
    headings,
  };
}

export function getAllPosts(): BlogPostCard[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post || post.draft) return null;
      return postToCard(post);
    })
    .filter(Boolean) as BlogPostCard[];

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostsByCategory(category: BlogCategory): BlogPostCard[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPostCard[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getFeaturedPosts(): BlogPostCard[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getRelatedPosts(
  currentSlug: string,
  category: BlogCategory,
  tags: string[],
  limit = 3,
  relatedSlugs?: string[]
): BlogPostCard[] {
  const allPosts = getAllPosts().filter((p) => p.slug !== currentSlug);

  // If frontmatter specifies related posts, use those first
  if (relatedSlugs && relatedSlugs.length > 0) {
    const specified = relatedSlugs
      .map((slug) => allPosts.find((p) => p.slug === slug))
      .filter(Boolean) as BlogPostCard[];
    if (specified.length >= limit) return specified.slice(0, limit);

    // Fill remaining with scored posts
    const usedSlugs = new Set(specified.map((p) => p.slug));
    const remaining = allPosts.filter((p) => !usedSlugs.has(p.slug));
    const scored = remaining
      .map((post) => {
        let score = 0;
        if (post.category === category) score += 3;
        const sharedTags = post.tags.filter((t) =>
          tags.map((tag) => tag.toLowerCase()).includes(t.toLowerCase())
        );
        score += sharedTags.length;
        return { post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit - specified.length)
      .map((s) => s.post);

    return [...specified, ...scored];
  }

  const scored = allPosts.map((post) => {
    let score = 0;
    if (post.category === category) score += 3;
    const sharedTags = post.tags.filter((t) =>
      tags.map((tag) => tag.toLowerCase()).includes(t.toLowerCase())
    );
    score += sharedTags.length;
    return { post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

export function getAllCategories(): Array<{
  category: BlogCategory;
  count: number;
}> {
  const posts = getAllPosts();
  const counts: Partial<Record<BlogCategory, number>> = {};

  posts.forEach((post) => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({
      category: category as BlogCategory,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): Array<{ tag: string; count: number }> {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalized = tag.toLowerCase();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

function postToCard(post: BlogPost): BlogPostCard {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime || 5,
    featuredImage: post.featuredImage,
    featured: post.featured,
    author: post.author,
  };
}
