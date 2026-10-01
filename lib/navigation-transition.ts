export type NavigationTransition =
  | "to-home"
  | "to-archive"
  | "to-project"
  | "to-contact"
  | "contact-to-home"
  | "project-to-home"
  | "project-to-archive"
  | "contact-to-archive";

const CLEAR_AFTER_MS = 4000;

let clearTimer: ReturnType<typeof setTimeout> | undefined;

export function markNavigationTransition(transition: NavigationTransition) {
  const root = document.documentElement;
  root.dataset.navTransition = transition;
  clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    delete root.dataset.navTransition;
  }, CLEAR_AFTER_MS);
}
