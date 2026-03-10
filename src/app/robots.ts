import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/api/",
          "/onboarding/",
          "/account/",
          "/admin/",
          "/booking/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/auth/",
        ],
      },
      // Allow AI search crawlers with full access
      { userAgent: "GPTBot", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "ChatGPT-User", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "Claude-Web", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "ClaudeBot", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "PerplexityBot", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "Amazonbot", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "Google-Extended", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      { userAgent: "Applebot-Extended", allow: ["/", "/llms.txt", "/llms-full.txt"] },
      // Rate-limit aggressive scrapers
      {
        userAgent: "AhrefsBot",
        allow: "/",
        crawlDelay: 10,
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
        crawlDelay: 10,
      },
      {
        userAgent: "MJ12bot",
        allow: "/",
        crawlDelay: 10,
      },
      {
        userAgent: "DotBot",
        allow: "/",
        crawlDelay: 10,
      },
      {
        userAgent: "BLEXBot",
        allow: "/",
        crawlDelay: 10,
      },
    ],
    sitemap: "https://myhomeplan.ca/sitemap.xml",
  };
}
