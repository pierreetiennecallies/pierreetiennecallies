import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { BatchImageArrayInput } from "../components/BatchImageArrayInput";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ImagesIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "The project's address: pierreetiennecallies.com/work/…",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "text",
      rows: 3,
      description:
        "Shown under the cover and the project images. Each line stays on its own line.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "The first image is the cover. Drag to reorder. Use “Upload multiple images” to add many at once.",
      components: { input: BatchImageArrayInput },
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for search engines and screen readers.",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      description:
        "Optional. Shown in Google results and link previews. Around 150 characters.",
      validation: (rule) => rule.max(200),
    }),
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: { title: "title", subtitle: "credits", media: "images.0" },
  },
});
