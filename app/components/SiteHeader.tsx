import Image from "next/image";
import Link from "next/link";

const labelClassName =
  "text-[clamp(12px,0.9vw,20px)] leading-none tracking-[0.02em]";

export function SiteHeader() {
  return (
    <header className="site-header absolute inset-x-0 top-0 z-10 flex items-start justify-between pt-[max(clamp(24px,3.06vw,72px),env(safe-area-inset-top))] pr-[max(clamp(20px,1.67vw,40px),env(safe-area-inset-right))] pl-[max(clamp(24px,3.06vw,72px),env(safe-area-inset-left))]">
      <Link
        href="/"
        transitionTypes={["to-home"]}
        className="flex flex-col gap-[0.3em] text-[clamp(12px,0.9vw,20px)]"
      >
        <Image
          src="/logo.svg"
          alt="Pierre-Etienne Callies"
          width={1677}
          height={86}
          preload
          className="ml-[calc(var(--logo-width)*-0.016)] h-[calc(var(--logo-width)/19.497)] w-auto max-w-none [--logo-width:clamp(180px,14.72vw,420px)]"
        />
        <span className={labelClassName}>Casting + Consulting</span>
      </Link>
      <nav>
        <Link
          href="/contact"
          transitionTypes={["to-contact"]}
          className={`-mx-3 -mb-3 -mt-[calc(0.45em+0.75rem)] block p-3 transition-opacity hover:opacity-50 ${labelClassName}`}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
