import type { Metadata } from "next";
import type { Settings, SiteImage } from "./content";
import { SITE_NAME } from "./site";

function shareImages(images: (SiteImage | undefined)[]) {
  return images
    .filter((image): image is SiteImage => Boolean(image))
    .map((image) => ({ url: image.shareUrl, width: 1200, height: 630, alt: image.alt }));
}

export function pageMetadata({
  settings,
  title,
  description,
  path,
  image,
}: {
  settings: Settings;
  title?: string;
  description?: string;
  path: string;
  image?: SiteImage;
}): Metadata {
  const resolvedDescription = description ?? settings.seoDescription;
  const socialTitle = title ? `${title} — ${SITE_NAME}` : settings.seoTitle;
  const images = shareImages([image ?? settings.shareImage]);
  return {
    ...(title ? { title } : {}),
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description: resolvedDescription,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: resolvedDescription,
      images: images.map((entry) => entry.url),
    },
  };
}
