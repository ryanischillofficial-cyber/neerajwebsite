import type { Metadata } from "next";
import { site } from "@/lib/site";

export const siteUrl = `https://${site.domain}`;
export const brandName = "NZ Accounting and Tax Services";

export const defaultDescription = `${site.highlight} | ${site.supportLine}.`;

export function pageUrl(path: string) {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalised, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: string;
}): Metadata {
  const url = pageUrl(path);
  const ogTitle = absoluteTitle ?? `${title} · ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_NZ",
      url,
      siteName: brandName,
      title: ogTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
