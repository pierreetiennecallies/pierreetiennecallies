"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

export function RouteTransitionTrigger() {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="route-marker" exit="route-marker">
      <span aria-hidden className="pointer-events-none fixed top-0 left-0 size-px opacity-0" />
    </ViewTransition>
  );
}
