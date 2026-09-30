import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "./components/SiteHeader";
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

export const metadata: Metadata = {
  title: {
    default: "Pierre-Etienne Callies — Casting + Consulting",
    template: "%s — Pierre-Etienne Callies",
  },
  description:
    "Pierre-Etienne Callies is a casting director with an image-driven approach to discovering and shaping new faces.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${modernNo20.variable} ${monumentGroteskMono.variable} antialiased`}
    >
      <body className="relative min-h-svh">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
