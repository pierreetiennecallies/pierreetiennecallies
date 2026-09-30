import { ViewTransition } from "react";
import { WorkGallery, type WorkItem } from "./components/WorkGallery";
import hommePlus from "@/public/work/homme-plus.jpg";
import situationist from "@/public/work/situationist.jpg";
import pop from "@/public/work/pop.jpg";
import dMagazine from "@/public/work/d-magazine.jpg";

const work: WorkItem[] = [
  {
    image: hommePlus,
    alt: "Arena Homme+ cover featuring Alex Hassell",
    caption: ["Alex Hassell for Homme +", "By Francis Boissier"],
  },
  {
    image: situationist,
    alt: "Situationist cover",
    caption: ["Situationist"],
  },
  {
    image: pop,
    alt: "Pop Magazine cover featuring Maya",
    caption: ["Maya for Pop Magazine", "By Francis Boissier"],
  },
  {
    image: dMagazine,
    alt: "D magazine London cover",
    caption: ["D London", "Style 2026"],
  },
];

export default function Home() {
  return (
    <ViewTransition
      enter={{ "to-home": "gallery-in", default: "none" }}
      exit={{ "to-contact": "gallery-out", default: "none" }}
      default="none"
    >
      <main className="gallery-offset">
        <h1 className="sr-only">Pierre-Etienne Callies — Selected work</h1>
        <WorkGallery items={work} />
      </main>
    </ViewTransition>
  );
}
