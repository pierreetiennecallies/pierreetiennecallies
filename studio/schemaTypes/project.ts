import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";
import { PlayIcon } from "@sanity/icons/Play";
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
      name: "details",
      title: "Project page text",
      type: "text",
      rows: 8,
      description:
        "Optional. Shown under the images once the project is opened, instead of the credits. Line breaks and blank lines are kept. Leave empty to show the credits.",
    }),
    defineField({
      name: "images",
      title: "Images & videos",
      type: "array",
      description:
        "The first item is the cover. Drag to reorder. Use “Upload multiple” to add many images or videos at once. Videos play muted and on a loop, like moving images.",
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
        defineArrayMember({
          type: "object",
          name: "video",
          title: "Video",
          icon: PlayIcon,
          fields: [
            defineField({
              name: "file",
              title: "Video file",
              type: "file",
              options: { accept: "video/mp4,video/webm,video/quicktime" },
              description:
                "MP4 works everywhere. Keep files small (ideally under 20 MB). Videos start muted; if this one has no sound to offer, strip the audio to make it smaller.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "poster",
              title: "Poster image",
              type: "image",
              options: { hotspot: true },
              description:
                "Recommended. A still frame shown while the video loads and used when the project is shared. Use the same shape as the video.",
            }),
            defineField({
              name: "hasSound",
              title: "Allow sound",
              type: "boolean",
              initialValue: false,
              description:
                "Videos always start muted. Turn this on to let visitors click the video on its project page to hear the sound.",
            }),
            defineField({
              name: "alt",
              title: "Description",
              type: "string",
              description: "Describe the video for search engines and screen readers.",
            }),
          ],
          preview: {
            select: {
              media: "poster",
              alt: "alt",
              filename: "file.asset.originalFilename",
              hasSound: "hasSound",
            },
            prepare: ({ media, alt, filename, hasSound }) => ({
              title: alt || filename || "Video",
              subtitle: hasSound ? "Video · sound" : "Video",
              media: media ?? PlayIcon,
            }),
          },
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
    select: {
      title: "title",
      subtitle: "credits",
      firstItem: "images.0",
      firstPoster: "images.0.poster",
    },
    prepare: ({ title, subtitle, firstItem, firstPoster }) => ({
      title,
      subtitle,
      media: firstItem?.asset ? firstItem : firstPoster?.asset ? firstPoster : ImagesIcon,
    }),
  },
});
