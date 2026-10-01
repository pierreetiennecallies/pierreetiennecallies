"use client";

import { takeArchiveScrollToRestore } from "@/lib/navigation-memory";

function restoreScroll(element: HTMLElement | null) {
  if (!element) return;
  const scrollY = takeArchiveScrollToRestore();
  if (scrollY !== null) window.scrollTo({ top: scrollY, behavior: "instant" });
}

export function ArchiveScrollRestore() {
  return <span ref={restoreScroll} hidden />;
}
