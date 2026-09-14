import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Key Services",
  description:
    "We provide flexible accounting and tax support to New Zealand practices, assisting with client work from raw accounting records through to completed annual accounts and tax compliance.",
  path: "/services/",
});

const groups = [
  {
    title: "Financial Statements & Annual Accounts",
    items: [
      "Preparation of annual financial statements and year-end accounts",
      "Compilation of detailed Xero working papers",
      "Review, reconciliation, and cleanup of accounting records",
      "Preparation of year-end balance sheet adjustments and supporting schedules",
    ],
  },
  {
    title: "Tax Returns & Compliance",
    items: [
      "Preparation of New Zealand income tax returns across entity types",
      "Completion of IR10 financial statements and IR4J imputation returns",
      "Preparation of residential and commercial rental property schedules",
      "Verification of IRD client tax summaries and ACC data matching",
      "Organization of clear, audit-ready tax working papers and documentation",
    ],
  },
  {
    title: "Xero & Accounting Support",
    items: [
      "Dedicated Xero setup, including tailored Chart of Accounts and tracking categories",
      "Comprehensive bank, credit card, and general ledger reconciliations",
      "Transaction coding, categorization, and ledger reviews",
      "General Xero maintenance and troubleshooting to keep client files current",
    ],
  },
  {
    title: "Trust & Entity Administration",
    items: [
      "Preparation of annual trust minutes and trustee resolutions",
      "Support with documentation for annual trust compliance requirements",
      "Entity maintenance and record-keeping support",
    ],
  },
];

function TitleWithPlainAmpersand({ title }: { title: string }) {
  const parts = title.split(" & ");

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 && <span className="font-sans"> & </span>}
          {part}
        </span>
      ))}
    </>
  );
}

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-24">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
            SERVICES
          </p>
          <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.08] text-ink sm:text-6xl">
            Key Services
          </h1>
          <span className="mt-6 block h-px w-12 bg-brass" />
          <div className="mt-8 flex max-w-2xl gap-5">
            <span className="mt-1 hidden w-px shrink-0 bg-brass sm:block" />
            <p className="text-lg leading-8 text-ink sm:text-xl sm:leading-9">
              We provide flexible accounting and tax support to New Zealand
              practices, assisting with client work from raw accounting records
              through to completed annual accounts and tax compliance.
            </p>
          </div>
        </div>
      </section>

      {groups.map((group, index) => (
        <section
          key={group.title}
          className={index % 2 === 1 ? "bg-cream/50" : undefined}
        >
          <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16">
            <div>
              <h2 className="font-serif text-[1.65rem] leading-snug text-ink sm:text-3xl">
                <TitleWithPlainAmpersand title={group.title} />
              </h2>
              <span className="mt-5 block h-px w-10 bg-brass" />
            </div>
            <ul className="border-t border-line lg:border-t-0 lg:border-l lg:pl-12">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-b border-line/80 py-4 text-lg leading-7 text-muted last:border-b-0 last:pb-0 first:pt-4 lg:first:pt-0"
                >
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
}
