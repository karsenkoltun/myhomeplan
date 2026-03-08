import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Home Plan",
    short_name: "MyHomePlan",
    description: "All your home services, one monthly plan.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9fa",
    theme_color: "#3b5998",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
