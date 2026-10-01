"use client";

import { useRef, type ReactNode } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import { rememberedHomeStripScroll } from "@/lib/navigation-memory";

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

export function HorizontalScroller({
  label,
  restoresHomeScroll = false,
  children,
}: {
  label: string;
  restoresHomeScroll?: boolean;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const attachTrack = (element: HTMLDivElement | null) => {
    trackRef.current = element;
    if (element && restoresHomeScroll) element.scrollLeft = rememberedHomeStripScroll();
  };

  useMountEffect(() => {
    if (!trackRef.current) return;
    return redirectVerticalWheelToHorizontal(trackRef.current);
  });

  return (
    <div
      ref={attachTrack}
      data-strip={restoresHomeScroll ? "" : undefined}
      role="region"
      aria-label={label}
      tabIndex={0}
      className="group/track no-scrollbar gallery-gutter overflow-x-auto overscroll-x-contain pb-6 outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-black pointer-coarse:snap-x pointer-coarse:snap-mandatory"
    >
      {children}
    </div>
  );
}
