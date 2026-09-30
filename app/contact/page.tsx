import type { Metadata } from "next";
import { ViewTransition } from "react";

export const metadata: Metadata = {
  title: "Contact",
};

const bioLines = [
  "Pierre-Etienne Callies",
  "is a casting director",
  "with image-driven approach",
  "to discovering and shaping new faces.",
  "His work moves between fashion, art, and",
  "culture, with a focus on individuality,",
  "character, and the energy a person brings",
  "to the frame. His casting",
  "reflects a refined yet",
  "intuitive sensibility— balancing",
  "strong visual identity",
  "with a sense of authenticity.",
];

export default function Contact() {
  return (
    <ViewTransition
      enter={{ "to-contact": "bio-in", default: "none" }}
      exit={{ "to-home": "bio-out", default: "none" }}
      default="none"
    >
      <main className="bio-page flex min-h-svh items-center justify-center">
        <h1 className="sr-only">About Pierre-Etienne Callies</h1>
        <p className="bio-text text-center font-serif uppercase">
          {bioLines.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </p>
      </main>
    </ViewTransition>
  );
}
