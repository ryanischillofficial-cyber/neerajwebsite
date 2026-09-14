import type { MetadataRoute } from "next";
import { pageUrl } from "@/lib/seo";

const pages: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "/home/", changeFrequency: "weekly", priority: 1 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact-us/", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy/", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms/", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: pageUrl(page.path),
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
