export const SITE_URL = "https://pierreetiennecallies.com";
export const SITE_NAME = "Pierre-Etienne Callies";
export const JOB_TITLE = "Casting Director";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
