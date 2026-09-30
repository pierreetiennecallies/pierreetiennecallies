"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";

export type WorkItem = {
  image: StaticImageData;
  alt: string;
  caption: string[];
};

const LINE_HEIGHT_PX = 16;

function wheelDeltaInPixels(event: WheelEvent, pageWidth: number) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * LINE_HEIGHT_PX;
  }
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * pageWidth;
  }
  return event.deltaY;
}

function redirectVerticalWheelToHorizontal(track: HTMLElement) {
  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const delta = wheelDeltaInPixels(event, track.clientWidth);
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 0 && delta < 0;
    const atEnd = track.scrollLeft >= maxScrollLeft - 1 && delta > 0;
    if (maxScrollLeft <= 0 || atStart || atEnd) return;

    event.preventDefault();
    track.scrollLeft += delta;
  };
  track.addEventListener("wheel", handleWheel, { passive: false });
  return () => track.removeEventListener("wheel", handleWheel);
}

export function WorkGallery({ items }: { items: WorkItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    if (!trackRef.current) return;
    return redirectVerticalWheelToHorizontal(trackRef.current);
  });

  return (
    <div
      ref={trackRef}
      role="region"
      aria-label="Selected work"
      tabIndex={0}
      className="group/track no-scrollbar gallery-gutter overflow-x-auto overscroll-x-contain pb-6 outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-black pointer-coarse:snap-x pointer-coarse:snap-mandatory"
    >
      <ul className="flex w-max gap-[clamp(8px,0.83vw,20px)]">
        {items.map((item, index) => (
          <li
            key={item.image.src}
            className="group/item shrink-0 snap-start"
          >
            <Image
              src={item.image}
              alt={item.alt}
              sizes="(max-aspect-ratio: 9/16) 86vw, 49vh"
              preload={index === 0}
              draggable={false}
              className="gallery-image w-auto select-none"
            />
            <p
              className={`mt-[clamp(16px,1.67vw,40px)] w-0 min-w-full pl-2 text-[clamp(12px,0.9vw,20px)] leading-[1.35] tracking-[0.02em] opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100 ${
                index === 0 ? "group-not-[&:hover]/track:opacity-100" : ""
              }`}
            >
              {item.caption.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
