import type { Project, Settings } from "./content";
import { JOB_TITLE, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function siteGraph(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: settings.seoDescription,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle: JOB_TITLE,
        description: settings.seoDescription,
        email: `mailto:${settings.email}`,
        ...(settings.shareImage ? { image: settings.shareImage.shareUrl } : {}),
        ...(settings.socialLinks.length
          ? { sameAs: settings.socialLinks.map((link) => link.url) }
          : {}),
        knowsAbout: ["Casting", "Fashion casting", "Model scouting", "Creative consulting"],
      },
    ],
  };
}

export function collectionPageGraph(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: SITE_URL,
    name: `Selected work — ${SITE_NAME}`,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      url: absoluteUrl(`/work/${project.slug}`),
      image: project.cover.url,
    })),
  };
}

export function profilePageGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/contact"),
    name: `About & Contact — ${SITE_NAME}`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}

export function projectGraph(project: Project) {
  const url = absoluteUrl(`/work/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.title,
        description: project.credits.join(" — "),
        image: project.images.map((image) => image.url),
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };
}
