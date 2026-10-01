"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { rememberProjectOrigin, type ProjectOrigin } from "@/lib/navigation-memory";

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
  };

  return (
    <Link
      href={`/work/${slug}`}
      transitionTypes={["to-project"]}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
