import { ViewTransition } from "react";
import { JsonLd } from "./components/JsonLd";
import { WorkGallery } from "./components/WorkGallery";
import { getProjects } from "@/lib/content";
import { collectionPageGraph } from "@/lib/structured-data";

export default async function Home() {
  const projects = await getProjects();

  return (
    <ViewTransition
      enter={{ "to-home": "gallery-in", default: "none" }}
      exit={{
        "to-contact": "gallery-out",
        "to-project": "page-out",
        "to-archive": "page-out",
        default: "none",
      }}
      default="none"
    >
      <main className="gallery-offset">
        <JsonLd data={collectionPageGraph(projects)} />
        <h1 className="sr-only">Pierre-Etienne Callies — Selected work</h1>
        <WorkGallery projects={projects} />
      </main>
    </ViewTransition>
  );
}
