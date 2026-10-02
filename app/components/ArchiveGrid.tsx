import { captionLines, coverTransitionName, type Project } from "@/lib/content";
import { ArchiveScrollRestore } from "./ArchiveScrollRestore";
import { MediaView } from "./MediaView";
import { ProjectLink } from "./ProjectLink";

const archiveImageSizes = "(min-width: 1280px) 17vw, (min-width: 640px) 25vw, 50vw";

export function ArchiveGrid({ projects }: { projects: Project[] }) {
  return (
    <>
      <ArchiveScrollRestore />
      <ul className="archive-grid">
      {projects.map((project, index) => (
        <li key={project.slug} className="group/item relative min-w-0">
          <ProjectLink
            slug={project.slug}
            origin="archive"
            className="block aspect-[4/5] overflow-hidden outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
              <MediaView
                media={project.cover}
                sizes={archiveImageSizes}
                preload={index < 6}
                fitVideoShape={false}
                fillFrame
                coverName={coverTransitionName(project.slug)}
                className="block h-full w-full object-cover select-none"
              />
          </ProjectLink>
          <p className="pointer-events-none absolute inset-x-0 top-full z-10 bg-background pt-[clamp(6px,0.6vw,14px)] pb-1 text-label leading-[1.35] tracking-[0.02em] opacity-0 transition-opacity duration-300 will-change-[opacity] [backface-visibility:hidden] group-hover/item:opacity-100 group-has-focus-visible/item:opacity-100 motion-reduce:transition-none [@media(hover:none)]:static [@media(hover:none)]:pb-0 [@media(hover:none)]:opacity-100">
            {captionLines(project).map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line}
              </span>
            ))}
          </p>
        </li>
      ))}
      </ul>
    </>
  );
}
