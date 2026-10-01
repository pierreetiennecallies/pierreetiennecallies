import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { coverTransitionName, type Project } from "@/lib/content";
import { MediaView } from "./MediaView";

const archiveImageSizes =
  "(min-width: 1280px) 17vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

export function ArchiveGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="archive-grid flex flex-wrap">
      {projects.map((project, index) => (
        <li
          key={project.slug}
          className="archive-item group/item relative"
          style={{ "--aspect": project.cover.width / project.cover.height } as CSSProperties}
        >
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
              <MediaView
                media={project.cover}
                sizes={archiveImageSizes}
                preload={index < 6}
                fitVideoShape={false}
                className="block h-auto w-full select-none"
              />
            </ViewTransition>
          </Link>
          <p className="pointer-events-none absolute inset-x-0 top-full mt-[clamp(6px,0.6vw,14px)] text-label leading-[1.35] tracking-[0.02em] opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-has-focus-visible/item:opacity-100 motion-reduce:transition-none">
            {project.credits.map((line, lineIndex) => (
              <span key={lineIndex} className="block truncate">
                {line}
              </span>
            ))}
          </p>
        </li>
      ))}
      <li aria-hidden className="grow-[1000] basis-0" />
    </ul>
  );
}
