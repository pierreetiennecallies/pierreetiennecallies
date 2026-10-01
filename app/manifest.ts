import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  return {
    name: SITE_NAME,
    short_name: "PE.C",
    description: settings.seoDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: settings.favicon
      ? [
          { src: settings.favicon.icon192, sizes: "192x192", type: "image/png", purpose: "any" },
          { src: settings.favicon.icon512, sizes: "512x512", type: "image/png", purpose: "any" },
        ]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
  };
}
