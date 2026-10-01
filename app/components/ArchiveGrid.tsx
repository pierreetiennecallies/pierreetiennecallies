import Link from "next/link";
import { ViewTransition } from "react";
import { coverTransitionName, type Project } from "@/lib/content";
import { MediaView } from "./MediaView";

const archiveImageSizes = "(min-width: 1280px) 17vw, (min-width: 640px) 25vw, 50vw";

export function ArchiveGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="archive-grid">
      {projects.map((project, index) => (
        <li key={project.slug} className="group/item relative min-w-0">
          <Link
            href={`/work/${project.slug}`}
            transitionTypes={["to-project"]}
            className="block aspect-[4/5] overflow-hidden outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <ViewTransition
              name={coverTransitionName(project.slug)}
              share="morph"
              default="none"
            >
              <MediaView
                media={project.cover}
                sizes={archiveImageSizes}
                preload={index < 6}
                fitVideoShape={false}
                fillFrame
                className="block h-full w-full object-cover select-none"
              />
            </ViewTransition>
          </Link>
          <p className="pointer-events-none absolute inset-x-0 top-full z-10 bg-background pt-[clamp(6px,0.6vw,14px)] pb-1 text-label leading-[1.35] tracking-[0.02em] opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-has-focus-visible/item:opacity-100 motion-reduce:transition-none">
            {project.credits.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line}
              </span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}
