import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="bio-page flex min-h-svh flex-col items-center justify-center gap-[clamp(24px,2.5vw,56px)] text-center">
      <h1 className="font-serif text-[clamp(28px,3vw,64px)] leading-[0.9] tracking-[-0.04em] uppercase">
        Page not found
      </h1>
      <Link
        href="/"
        className="text-label leading-none tracking-[0.02em] transition-opacity hover:opacity-50"
      >
        Back to selected work
      </Link>
    </main>
  );
}
