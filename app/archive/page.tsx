import type { Metadata } from "next";
import { ArchiveGrid } from "@/app/components/ArchiveGrid";
import { JsonLd } from "@/app/components/JsonLd";
import { getProjects, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/site";
import { collectionPageGraph } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: settings.archiveLabel,
    description: `Every casting project by ${SITE_NAME}, casting director working across fashion, art and culture.`,
    path: "/archive",
  });
}

export default async function Archive() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  return (
    <main>
      <JsonLd data={collectionPageGraph(projects, "/archive", settings.archiveLabel)} />
      <h1 className="sr-only">
        {SITE_NAME} — {settings.archiveLabel}
      </h1>
      <ArchiveGrid projects={projects} />
    </main>
  );
}
