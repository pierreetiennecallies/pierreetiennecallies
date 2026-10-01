import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

const labelClassName =
  "text-label leading-none tracking-[0.02em]";

export async function SiteHeader() {
  const settings = await getSettings();

  return (
    <header className="site-header pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between pt-[max(clamp(24px,3.06vw,72px),env(safe-area-inset-top))] pr-[max(clamp(20px,1.67vw,40px),env(safe-area-inset-right))] pl-[max(clamp(24px,3.06vw,72px),env(safe-area-inset-left))]">
      <Link
        href="/"
        transitionTypes={["to-home"]}
        className="pointer-events-auto flex flex-col gap-[0.3em] text-label"
      >
        <Image
          src="/logo.svg"
          alt={SITE_NAME}
          width={1677}
          height={86}
          preload
          className="-ml-[0.08em] h-[calc(var(--logo-width)/19.497)] w-auto max-w-none [--logo-width:clamp(189px,15.46vw,441px)]"
        />
        <span className={labelClassName}>{settings.tagline}</span>
      </Link>
      <nav>
        <Link
          href="/contact"
          transitionTypes={["to-contact"]}
          className={`pointer-events-auto -mx-3 -mb-3 -mt-[calc(0.45em+0.75rem)] block p-3 transition-opacity hover:opacity-50 ${labelClassName}`}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
