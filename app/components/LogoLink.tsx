"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NavLink } from "./NavLink";

export function LogoLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <NavLink
      href="/"
      transition={pathname === "/contact" ? "contact-to-home" : "to-home"}
      className={className}
    >
      {children}
    </NavLink>
  );
}
