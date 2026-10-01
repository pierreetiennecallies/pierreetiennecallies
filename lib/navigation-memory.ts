import type { NavigationTransition } from "./navigation-transition";

export type ProjectOrigin = "home" | "archive";

const ORIGIN_PATHS: Record<ProjectOrigin, string> = { home: "/", archive: "/archive" };
const ORIGIN_TRANSITIONS: Record<ProjectOrigin, NavigationTransition> = {
  home: "project-to-home",
  archive: "project-to-archive",
};

let projectOrigin: ProjectOrigin = "home";
let homeStripScroll = 0;
let archiveScroll = 0;
let restoreArchiveScroll = false;

export function rememberProjectOrigin(origin: ProjectOrigin, stripScroll?: number) {
  projectOrigin = origin;
  if (origin === "home" && stripScroll !== undefined) homeStripScroll = stripScroll;
  if (origin === "archive") archiveScroll = window.scrollY;
}

export function projectReturnTarget() {
  if (projectOrigin === "archive") restoreArchiveScroll = true;
  return { path: ORIGIN_PATHS[projectOrigin], transition: ORIGIN_TRANSITIONS[projectOrigin] };
}

export function rememberedHomeStripScroll() {
  return homeStripScroll;
}

export function takeArchiveScrollToRestore() {
  if (!restoreArchiveScroll) return null;
  restoreArchiveScroll = false;
  return archiveScroll;
}
