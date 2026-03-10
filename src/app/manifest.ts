import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Home Plan",
    short_name: "MyHomePlan",
    description:
      "All your home services, one monthly plan. Serving the Okanagan Valley, BC.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#16a34a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
