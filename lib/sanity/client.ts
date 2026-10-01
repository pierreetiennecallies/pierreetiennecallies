import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "ox21j8ub",
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: true,
  perspective: "published",
});

export const imageUrlBuilder = createImageUrlBuilder(sanityClient);
