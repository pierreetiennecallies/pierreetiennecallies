import { JsonLd } from "./components/JsonLd";
import { WorkGallery } from "./components/WorkGallery";
import { getProjects } from "@/lib/content";
import { collectionPageGraph } from "@/lib/structured-data";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="gallery-offset">
      <JsonLd data={collectionPageGraph(projects)} />
      <h1 className="sr-only">Pierre-Etienne Callies — Selected work</h1>
      <WorkGallery projects={projects} />
    </main>
  );
}
