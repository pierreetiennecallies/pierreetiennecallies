import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { ImagesIcon } from "@sanity/icons/Images";
import { SETTINGS_ID } from "./env";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      orderableDocumentListDeskItem({
        type: "project",
        title: "Projects",
        icon: ImagesIcon,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SETTINGS_ID)
            .title("Site settings"),
        ),
    ]);
