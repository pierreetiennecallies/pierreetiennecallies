"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  markNavigationTransition,
  type NavigationTransition,
} from "@/lib/navigation-transition";

export function NavLink({
  href,
  transition,
  className,
  children,
}: {
  href: string;
  transition: NavigationTransition;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const leavingProject = pathname.startsWith("/work/");
  const leavingContact = pathname === "/contact";
  const resolved: NavigationTransition =
    leavingProject && transition === "to-home"
      ? "project-to-home"
      : leavingProject && transition === "to-archive"
        ? "project-to-archive"
        : leavingContact && transition === "to-archive"
          ? "contact-to-archive"
          : transition;

  return (
    <Link
      href={href}
      onClick={() => markNavigationTransition(resolved)}
      className={className}
    >
      {children}
    </Link>
  );
}
