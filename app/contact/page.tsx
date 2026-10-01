import type { Metadata } from "next";
import { DismissToHome } from "@/app/components/DismissToHome";
import { JsonLd } from "@/app/components/JsonLd";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { profilePageGraph } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "About & Contact",
    description: settings.contactDescription,
    path: "/contact",
  });
}

export default async function Contact() {
  const settings = await getSettings();

  return (
    <DismissToHome
      homeTransition="contact-to-home"
      className="bio-page flex min-h-svh items-center justify-center"
    >
      <JsonLd data={profilePageGraph()} />
      <h1 className="sr-only">About Pierre-Etienne Callies</h1>
      <div className="flex flex-col items-center gap-[clamp(32px,3.3vw,72px)]">
        <p
          data-keep-open
          className="bio-text cursor-auto text-center font-serif uppercase"
        >
          {settings.bioLines.map((line, index) => (
            <span key={index} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </p>
        <div className="flex flex-col items-center gap-[0.9em] text-label leading-none tracking-[0.02em]">
          <a
            href={`mailto:${settings.email}`}
            className="transition-opacity hover:opacity-50"
          >
            {settings.email}
          </a>
          {settings.clients ? (
            <p
              data-keep-open
              className="mt-[1.1em] max-w-[60ch] cursor-auto text-center leading-[1.35] whitespace-pre-line"
            >
              {settings.clients}
            </p>
          ) : null}
          {settings.socialLinks.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-x-[1.5em] gap-y-[0.9em]">
              {settings.socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </DismissToHome>
  );
}
