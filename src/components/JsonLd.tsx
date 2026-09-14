import { brandName, pageUrl, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const email = "neeraj@nzaccountingandtax.org";
const phones = ["+640223176728", "+918826966728"];

export function JsonLd() {
  const personId = `${siteUrl}/#person`;
  const businessId = `${siteUrl}/#business`;
  const websiteId = `${siteUrl}/#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: brandName,
        alternateName: site.shortMark,
        url: pageUrl("/home/"),
        description: site.supportLine,
        image: `${siteUrl}/opengraph-image/`,
        email,
        telephone: phones,
        areaServed: {
          "@type": "Country",
          name: "New Zealand",
        },
        serviceType: [
          "Annual Financial Statements and working papers",
          "Tax Return Preparation",
          "GST Returns and Compliance",
          "Xero Training",
          "Accounting & Tax Contractor Support",
        ],
        founder: { "@id": personId },
        employee: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        jobTitle: site.highlight,
        description:
          "Neeraj Dhankhar is the Managing Owner of the business, with over ten years of experience in New Zealand accounting and tax services.",
        url: pageUrl("/about/"),
        email,
        telephone: phones,
        image: pageUrl("/ProNeerajPhoto.jpeg"),
        worksFor: { "@id": businessId },
        knowsAbout: ["Xero", "New Zealand accounting", "New Zealand tax"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: brandName,
        url: siteUrl,
        inLanguage: "en-NZ",
        description: site.supportLine,
        publisher: { "@id": businessId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
