import type { Metadata, Viewport } from "next";
import { after } from "next/server";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { headers } from "next/headers";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { brandName, defaultDescription, pageUrl, siteUrl } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-data";
import { recordVisit } from "@/lib/visit-log";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F3EB",
};

export async function generateMetadata(): Promise<Metadata> {
  const { offline } = await getSiteConfig();

  return {
    metadataBase: new URL(siteUrl),
    applicationName: brandName,
    title: {
      default: `${site.name} · ${site.highlight}`,
      template: `%s · ${site.name}`,
    },
    description: `${site.name} — ${defaultDescription}`,
    authors: [{ name: site.name, url: pageUrl("/about/") }],
    creator: site.name,
    publisher: brandName,
    category: "business",
    robots: offline
      ? { index: false, follow: false }
      : {
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
    openGraph: {
      type: "website",
      locale: "en_NZ",
      siteName: brandName,
      title: `${site.name} · ${site.highlight}`,
      description: defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} · ${site.highlight}`,
      description: defaultDescription,
    },
    icons: {
      icon: [{ url: "/icon?v=playfair", type: "image/png" }],
      apple: [{ url: "/apple-icon?v=playfair", type: "image/png" }],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const { offline } = await getSiteConfig();
  const isAdmin = pathname === "/adm" || pathname.startsWith("/adm/");
  after(() => {
    void recordVisit(headerList, pathname).catch(() => undefined);
  });

  return (
    <html
      lang="en-NZ"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSans.variable} h-full min-h-dvh antialiased`}
    >
      <body
        className="flex min-h-dvh flex-col bg-paper font-sans text-body"
        suppressHydrationWarning
      >
        {isAdmin ? null : <JsonLd />}
        <SiteChrome
          offline={offline}
          initialPathname={pathname}
          footer={<SiteFooter />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
