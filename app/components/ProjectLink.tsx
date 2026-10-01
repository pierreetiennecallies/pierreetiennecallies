"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { rememberProjectOrigin, type ProjectOrigin } from "@/lib/navigation-memory";
import { markNavigationTransition } from "@/lib/navigation-transition";

export function ProjectLink({
  slug,
  origin,
  className,
  children,
}: {
  slug: string;
  origin: ProjectOrigin;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const strip = event.currentTarget.closest<HTMLElement>("[data-strip]");
    rememberProjectOrigin(origin, strip?.scrollLeft);
    markNavigationTransition("to-project");
  };

  return (
    <Link
      href={`/work/${slug}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
