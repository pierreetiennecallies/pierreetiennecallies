import { cache } from "react";
import { imageUrlBuilder, sanityClient } from "./sanity/client";

export type SiteImage = {
  url: string;
  width: number;
  height: number;
  focus: string;
  alt: string;
  shareUrl: string;
};

export type ImageMedia = SiteImage & { kind: "image" };

export type VideoMedia = {
  kind: "video";
  url: string;
  mimeType: string;
  width: number;
  height: number;
  alt: string;
  hasSound: boolean;
  poster?: SiteImage;
};

export type Media = ImageMedia | VideoMedia;

export type Project = {
  slug: string;
  title: string;
  credits: string[];
  details?: string;
  description?: string;
  media: Media[];
  cover: Media;
  shareImage?: SiteImage;
};

export type SocialLink = { label: string; url: string };

export type FaviconSet = {
  icon32: string;
  icon192: string;
  icon512: string;
  apple180: string;
};

export type Settings = {
  tagline: string;
  archiveLabel: string;
  contactLabel: string;
  clients?: string;
  socialLinks: SocialLink[];
  bioLines: string[];
  email: string;
  seoTitle: string;
  seoDescription: string;
  contactDescription?: string;
  keywords: string[];
  shareImage?: SiteImage;
  favicon?: FaviconSet;
};

type RawImage = {
  alt?: string;
  crop?: object;
  hotspot?: { x?: number; y?: number } | null;
  asset: { _id: string; url: string; width: number; height: number };
};

type RawMedia =
  | (RawImage & { _type: "image" })
  | {
      _type: "video";
      alt?: string;
      hasSound?: boolean;
      file: { url: string; mimeType?: string };
      poster?: RawImage;
    };

type RawProject = {
  slug: string;
  title: string;
  credits?: string;
  details?: string;
  seoDescription?: string;
  media?: RawMedia[];
};

type RawSettings = Omit<
  Settings,
  "bioLines" | "shareImage" | "keywords" | "socialLinks" | "contactLabel" | "archiveLabel" | "favicon"
> & {
  archiveLabel?: string;
  favicon?: RawImage;
  contactLabel?: string;
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
  details,
  seoDescription,
  "media": images[(_type == "image" && defined(asset)) || (_type == "video" && defined(file.asset))]{
    _type,
    alt,
    hasSound,
    crop,
    hotspot,
    "asset": select(_type == "image" => asset->{ _id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }),
    "file": select(_type == "video" => file.asset->{ url, mimeType }),
    "poster": select(defined(poster.asset) => poster${imageProjection})
  }
}`;

const projectsQuery = `*[_type == "project" && defined(slug.current) && count(images[(_type == "image" && defined(asset)) || (_type == "video" && defined(file.asset))]) > 0] | order(orderRank asc) ${projectProjection}`;

const DEFAULT_VIDEO_SIZE = { width: 1080, height: 1350 };

const freshContent = { cache: "no-store" } as const;

const settingsQuery = `*[_id == "siteSettings"][0]{
  tagline,
  archiveLabel,
  contactLabel,
  bio,
  email,
  clients,
  socialLinks[]{ platform, label, url },
  seoTitle,
  seoDescription,
  contactDescription,
  keywords,
  "shareImage": select(defined(shareImage.asset) => shareImage${imageProjection}),
  "favicon": select(defined(favicon.asset) => favicon${imageProjection})
}`;

function splitLines(text?: string) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function trimBlock(text?: string) {
  const trimmed = text?.replace(/\r\n/g, "\n").trim();
  return trimmed ? trimmed : undefined;
}

function focusPosition(hotspot: RawImage["hotspot"]) {
  const x = hotspot?.x ?? 0.5;
  const y = hotspot?.y ?? 0.5;
  return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
}

function toSiteImage(image: RawImage, fallbackAlt: string): SiteImage {
  return {
    url: image.asset.url,
    width: image.asset.width,
    height: image.asset.height,
    focus: focusPosition(image.hotspot),
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

function squareIcon(image: RawImage, size: number) {
  return imageUrlBuilder
    .image({ asset: { _ref: image.asset._id }, crop: image.crop, hotspot: image.hotspot })
    .width(size)
    .height(size)
    .fit("crop")
    .format("png")
    .url();
}

function toFaviconSet(image: RawImage): FaviconSet {
  return {
    icon32: squareIcon(image, 32),
    icon192: squareIcon(image, 192),
    icon512: squareIcon(image, 512),
    apple180: squareIcon(image, 180),
  };
}

function toMedia(raw: RawMedia, fallbackAlt: string): Media {
  if (raw._type === "video") {
    const poster = raw.poster ? toSiteImage(raw.poster, fallbackAlt) : undefined;
    return {
      kind: "video",
      url: raw.file.url,
      mimeType: raw.file.mimeType ?? "video/mp4",
      width: poster?.width ?? DEFAULT_VIDEO_SIZE.width,
      height: poster?.height ?? DEFAULT_VIDEO_SIZE.height,
      alt: raw.alt?.trim() || fallbackAlt,
      hasSound: raw.hasSound === true,
      poster,
    };
  }
  return { kind: "image", ...toSiteImage(raw, fallbackAlt) };
}

function sameText(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function captionLines(project: Project) {
  const credits = project.credits.filter(
    (line, index) => !(index === 0 && sameText(line, project.title)),
  );
  return [project.title, ...credits];
}

export function stillImage(media: Media): SiteImage | undefined {
  return media.kind === "image" ? media : media.poster;
}

function toProject(raw: RawProject): Project {
  const media = (raw.media ?? []).map((item, index) =>
    toMedia(item, `${raw.title} — ${index + 1}`),
  );
  const stills = media.map(stillImage).filter((image): image is SiteImage => Boolean(image));
  return {
    slug: raw.slug,
    title: raw.title,
    credits: splitLines(raw.credits),
    details: trimBlock(raw.details),
    description: raw.seoDescription?.trim() || undefined,
    media,
    cover: media[0],
    shareImage: stills[0],
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const raw = await sanityClient.fetch<RawProject[]>(projectsQuery, {}, freshContent);
  return raw.map(toProject);
});

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
});

export const getSettings = cache(async (): Promise<Settings> => {
  const raw = await sanityClient.fetch<RawSettings | null>(settingsQuery, {}, freshContent);
  if (!raw) throw new Error("Site settings are missing in Sanity");
  return {
    tagline: raw.tagline,
    archiveLabel: raw.archiveLabel?.trim() || "Archive",
    contactLabel: raw.contactLabel?.trim() || "Contact",
    bioLines: splitLines(raw.bio),
    email: raw.email,
    clients: trimBlock(raw.clients),
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
    favicon: raw.favicon ? toFaviconSet(raw.favicon) : undefined,
  };
});

export function coverTransitionName(slug: string) {
  return `cover-${slug}`;
}
