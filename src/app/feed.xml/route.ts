import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://myhomeplan.ca";
  const now = new Date().toUTCString();

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const imageTag = post.featuredImage?.src
        ? `\n      <media:content url="${escapeXml(post.featuredImage.src)}" medium="image" />`
        : "";
      const tags = post.tags
        ?.map((tag) => `\n      <category>${escapeXml(tag)}</category>`)
        .join("") || "";

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.description || post.excerpt}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>${tags}${imageTag}
      <author>hello@myhomeplan.ca (My Home Plan)</author>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>My Home Plan Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert home maintenance tips, seasonal checklists, and cost guides for Okanagan homeowners.</description>
    <language>en-ca</language>
    <copyright>Copyright ${new Date().getFullYear()} My Home Plan. All rights reserved.</copyright>
    <managingEditor>hello@myhomeplan.ca (My Home Plan)</managingEditor>
    <webMaster>hello@myhomeplan.ca (My Home Plan)</webMaster>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/icon-512.png</url>
      <title>My Home Plan Blog</title>
      <link>${baseUrl}/blog</link>
      <width>512</width>
      <height>512</height>
    </image>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
