import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { coverTransitionName, type Project } from "@/lib/content";
import { HorizontalScroller } from "./HorizontalScroller";

export const galleryImageSizes = "(max-aspect-ratio: 9/16) 86vw, 49vh";

export const captionClassName =
  "mt-[clamp(10px,1.11vw,28px)] pl-2 text-label leading-[1.35] tracking-[0.02em]";

export function WorkGallery({ projects }: { projects: Project[] }) {
  return (
    <HorizontalScroller label="Selected work">
      <ul className="flex w-max gap-[clamp(8px,0.83vw,20px)]">
        {projects.map((project, index) => (
          <li key={project.slug} className="group/item shrink-0 snap-start">
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={["to-project"]}
              className="block outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ViewTransition
                name={coverTransitionName(project.slug)}
                share="morph"
                default="none"
              >
                <Image
                  src={project.cover.url}
                  width={project.cover.width}
                  height={project.cover.height}
                  alt={project.cover.alt}
                  sizes={galleryImageSizes}
                  preload={index === 0}
                  draggable={false}
                  className="gallery-image w-auto select-none"
                />
              </ViewTransition>
            </Link>
            <p
              className={`${captionClassName} w-0 min-w-full opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-has-focus-visible/item:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100 ${
                index === 0 ? "group-not-[&:hover]/track:opacity-100" : ""
              }`}
            >
              {project.credits.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </HorizontalScroller>
  );
}
