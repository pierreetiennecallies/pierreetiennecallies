import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { preconnect } from "react-dom";
import { JsonLd } from "./components/JsonLd";
import { RouteTransitionTrigger } from "./components/RouteTransitionTrigger";
import { SiteHeader } from "./components/SiteHeader";
import { getSettings } from "@/lib/content";
import { iconMetadata, pageMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { siteGraph } from "@/lib/structured-data";
import "./globals.css";

const modernNo20 = localFont({
  src: "./fonts/modern-no-20.woff2",
  variable: "--font-modern",
  display: "swap",
});

const monumentGroteskMono = localFont({
  src: "./fonts/monument-grotesk-mono.woff2",
  variable: "--font-monument-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    ...pageMetadata({ settings, path: "/" }),
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seoTitle,
      template: `%s — ${SITE_NAME}`,
    },
    icons: iconMetadata(settings),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    keywords: settings.keywords,
    category: "Fashion",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  preconnect("https://cdn.sanity.io");
  const settings = await getSettings();

  return (
    <html
      lang="en"
      className={`${modernNo20.variable} ${monumentGroteskMono.variable} antialiased`}
    >
      <body className="relative min-h-svh">
        <JsonLd data={siteGraph(settings)} />
        <SiteHeader />
        <RouteTransitionTrigger />
        {children}
      </body>
    </html>
  );
}
