import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { DismissToHome } from "@/app/components/DismissToHome";
import { HorizontalScroller } from "@/app/components/HorizontalScroller";
import { JsonLd } from "@/app/components/JsonLd";
import { MediaView } from "@/app/components/MediaView";
import {
  captionClassName,
  galleryImageSizes,
} from "@/app/components/WorkGallery";
import {
  coverTransitionName,
  getProject,
  getProjects,
  getSettings,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/site";
import { projectGraph } from "@/lib/structured-data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const [project, settings] = await Promise.all([getProject(slug), getSettings()]);
  if (!project) return {};
  return pageMetadata({
    settings,
    title: project.title,
    description:
      project.description ??
      `${project.credits.join(", ")}. Casting by ${SITE_NAME}, casting director working across fashion, art and culture.`,
    path: `/work/${project.slug}`,
    image: project.shareImage,
  });
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <ViewTransition
      enter={{ "to-project": "page-in", default: "none" }}
      exit={{
        "to-home": "page-out",
        "to-contact": "gallery-out",
        "to-project": "page-out",
        "to-archive": "page-out",
        default: "none",
      }}
      default="none"
    >
      <DismissToHome className="gallery-offset min-h-svh">
        <JsonLd data={projectGraph(project)} />
        <h1 className="sr-only">{project.title}</h1>
        <HorizontalScroller label={`${project.title} — images and videos`}>
          <ul className="flex w-max gap-[clamp(8px,0.83vw,20px)]">
            {project.media.map((media, index) => (
              <li key={index} className="shrink-0 snap-start">
                {index === 0 ? (
                  <ViewTransition
                    name={coverTransitionName(project.slug)}
                    share="morph"
                    default="none"
                  >
                    <MediaView
                      media={media}
                      sizes={galleryImageSizes}
                      preload
                      allowSound
                      className="gallery-image w-auto select-none"
                    />
                  </ViewTransition>
                ) : (
                  <MediaView
                    media={media}
                    sizes={galleryImageSizes}
                    allowSound
                    className="gallery-image w-auto select-none"
                  />
                )}
              </li>
            ))}
          </ul>
        </HorizontalScroller>
        <div className="gallery-gutter -mt-6">
          <div data-keep-open className={`${captionClassName} w-fit max-w-[60ch] cursor-auto`}>
            {project.credits.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
            {project.details ? (
              <p className="mt-[1.35em] whitespace-pre-line">{project.details}</p>
            ) : null}
          </div>
        </div>
      </DismissToHome>
    </ViewTransition>
  );
}
