import type { MetadataRoute } from "next";
import { getProjects, stillImage, type SiteImage } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const lastModified = new Date();
  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: projects.flatMap((project) => project.shareImage?.url ?? []),
    },
    {
      url: absoluteUrl("/archive"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: project.media
        .map(stillImage)
        .filter((image): image is SiteImage => Boolean(image))
        .map((image) => image.url),
    })),
  ];
}
