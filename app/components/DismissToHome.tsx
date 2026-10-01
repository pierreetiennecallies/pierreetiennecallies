"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import { projectReturnTarget } from "@/lib/navigation-memory";

export function DismissToHome({
  returnToOrigin = false,
  className,
  children,
}: {
  returnToOrigin?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const goHome = () => {
    const target = returnToOrigin
      ? projectReturnTarget()
      : { path: "/", transition: "to-home" };
    router.push(target.path, { scroll: false, transitionTypes: [target.transition] });
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element;
    if (target.closest("[data-keep-open], a, button")) return;
    goHome();
  };

  useMountEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") goHome();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <main onClick={handleClick} className={`cursor-pointer ${className ?? ""}`}>
      {children}
    </main>
  );
}
