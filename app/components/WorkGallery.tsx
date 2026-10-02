import { captionLines, coverTransitionName, type Project } from "@/lib/content";
import { HorizontalScroller } from "./HorizontalScroller";
import { MediaView } from "./MediaView";
import { ProjectLink } from "./ProjectLink";

export const galleryImageSizes = "(max-aspect-ratio: 9/16) 86vw, 49vh";

export const captionClassName =
  "mt-[clamp(10px,1.11vw,28px)] pl-2 text-label leading-[1.35] tracking-[0.02em]";

export function WorkGallery({ projects }: { projects: Project[] }) {
  return (
    <HorizontalScroller label="Selected work" restoresHomeScroll>
      <ul className="flex w-max gap-[clamp(8px,0.83vw,20px)]">
        {projects.map((project, index) => (
          <li key={project.slug} className="group/item shrink-0 snap-start">
            <ProjectLink
              slug={project.slug}
              origin="home"
              className="block outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
                <MediaView
                  media={project.cover}
                  sizes={galleryImageSizes}
                  preload={index === 0}
                  coverName={coverTransitionName(project.slug)}
                  className="gallery-image w-auto select-none"
                />
            </ProjectLink>
            <p
              className={`${captionClassName} w-0 min-w-full opacity-0 transition-opacity duration-300 will-change-[opacity] [backface-visibility:hidden] group-hover/item:opacity-100 group-has-focus-visible/item:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100`}
            >
              {captionLines(project).map((line, lineIndex) => (
                <span key={lineIndex} className="block">
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
