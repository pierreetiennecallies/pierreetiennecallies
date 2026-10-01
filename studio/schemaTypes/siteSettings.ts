import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "content",
      description: "Shown under the logo.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "archiveLabel",
      title: "Archive link text",
      type: "string",
      group: "content",
      description: "The link that opens the grid of all projects. Leave empty to show “Archive”.",
      placeholder: "Archive",
    }),
    defineField({
      name: "contactLabel",
      title: "Contact link text",
      type: "string",
      group: "content",
      description: "The link at the top right of every page. Leave empty to show “Contact”.",
      placeholder: "Contact",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 14,
      group: "content",
      description:
        "Shown on the Contact page. Every line break is kept exactly, so you control the shape of the text.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "clients",
      title: "Client list",
      type: "text",
      rows: 10,
      group: "content",
      description:
        "Optional. Shown under the email on the Contact page, in the same font. Line breaks and blank lines are kept.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "content",
      description: "Shown under the email on the Contact page. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "Instagram",
                  "TikTok",
                  "LinkedIn",
                  "X",
                  "Vimeo",
                  "YouTube",
                  "Models.com",
                  "Other",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Optional. The text shown on the site. Defaults to the platform name.",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["https", "http"] }),
            }),
          ],
          preview: {
            select: { platform: "platform", label: "label", url: "url" },
            prepare: ({ platform, label, url }) => ({
              title: label || platform,
              subtitle: url,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "Homepage title",
      type: "string",
      group: "seo",
      description: "Shown in Google results and browser tabs. Around 55 characters.",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Shown in Google results and link previews. Around 150 characters.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "contactDescription",
      title: "Contact page description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      description:
        "The small icon in browser tabs, bookmarks and phone home screens. Upload a square PNG, at least 512 × 512 pixels. Leave empty to keep the current PE.C icon.",
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "image",
      group: "seo",
      description:
        "Shown when the site is shared on social media or messaging apps. 1200 × 630 pixels.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
