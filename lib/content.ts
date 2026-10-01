import { cache } from "react";
import { imageUrlBuilder, sanityClient } from "./sanity/client";

export type SiteImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  shareUrl: string;
};

export type Project = {
  slug: string;
  title: string;
  credits: string[];
  description?: string;
  images: SiteImage[];
  cover: SiteImage;
};

export type SocialLink = { label: string; url: string };

export type Settings = {
  tagline: string;
  socialLinks: SocialLink[];
  bioLines: string[];
  email: string;
  seoTitle: string;
  seoDescription: string;
  contactDescription?: string;
  keywords: string[];
  shareImage?: SiteImage;
};

type RawImage = {
  alt?: string;
  crop?: object;
  hotspot?: object;
  asset: { _id: string; url: string; width: number; height: number };
};

type RawProject = {
  slug: string;
  title: string;
  credits?: string;
  seoDescription?: string;
  images?: RawImage[];
};

type RawSettings = Omit<
  Settings,
  "bioLines" | "shareImage" | "keywords" | "socialLinks"
> & {
  bio?: string;
  socialLinks?: { platform?: string; label?: string; url?: string }[];
  keywords?: string[];
  shareImage?: RawImage;
};

const imageProjection = `{
  alt,
  crop,
  hotspot,
  "asset": asset->{ _id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
}`;

const projectProjection = `{
  "slug": slug.current,
  title,
  credits,
  seoDescription,
  "images": images[defined(asset)]${imageProjection}
}`;

const projectsQuery = `*[_type == "project" && defined(slug.current) && count(images[defined(asset)]) > 0] | order(orderRank asc) ${projectProjection}`;

const settingsQuery = `*[_id == "siteSettings"][0]{
  tagline,
  bio,
  email,
  socialLinks[]{ platform, label, url },
  seoTitle,
  seoDescription,
  contactDescription,
  keywords,
  "shareImage": select(defined(shareImage.asset) => shareImage${imageProjection})
}`;

function splitLines(text?: string) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toSiteImage(image: RawImage, fallbackAlt: string): SiteImage {
  return {
    url: image.asset.url,
    width: image.asset.width,
    height: image.asset.height,
    alt: image.alt?.trim() || fallbackAlt,
    shareUrl: imageUrlBuilder
      .image({ asset: { _ref: image.asset._id }, crop: image.crop, hotspot: image.hotspot })
      .width(1200)
      .height(630)
      .fit("crop")
      .auto("format")
      .url(),
  };
}

function toProject(raw: RawProject): Project {
  const images = (raw.images ?? []).map((image, index) =>
    toSiteImage(image, `${raw.title} — image ${index + 1}`),
  );
  return {
    slug: raw.slug,
    title: raw.title,
    credits: splitLines(raw.credits),
    description: raw.seoDescription?.trim() || undefined,
    images,
    cover: images[0],
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const raw = await sanityClient.fetch<RawProject[]>(projectsQuery);
  return raw.map(toProject);
});

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
});

export const getSettings = cache(async (): Promise<Settings> => {
  const raw = await sanityClient.fetch<RawSettings | null>(settingsQuery);
  if (!raw) throw new Error("Site settings are missing in Sanity");
  return {
    tagline: raw.tagline,
    bioLines: splitLines(raw.bio),
    email: raw.email,
    socialLinks: (raw.socialLinks ?? []).flatMap((link) =>
      link.url
        ? [{ label: link.label?.trim() || link.platform || link.url, url: link.url }]
        : [],
    ),
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    contactDescription: raw.contactDescription,
    keywords: raw.keywords ?? [],
    shareImage: raw.shareImage
      ? toSiteImage(raw.shareImage, `${raw.seoTitle}`)
      : undefined,
  };
});

export function coverTransitionName(slug: string) {
  return `cover-${slug}`;
}
