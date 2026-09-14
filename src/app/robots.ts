import type { MetadataRoute } from "next";
import { pageUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/adm/", "/adm"],
      },
    ],
    sitemap: pageUrl("/sitemap.xml"),
  };
}
