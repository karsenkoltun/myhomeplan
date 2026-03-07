import { BlogCard } from "./blog-card";
import type { BlogPostCard } from "@/types/blog";

export function BlogRelatedPosts({ posts }: { posts: BlogPostCard[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight">
        Related Articles
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
