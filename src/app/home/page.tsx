import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Home",
  absoluteTitle: `${site.name} · ${site.highlight} | ${site.supportLine}`,
  description: `${site.supportLine}. Providing flexible accounting and tax support to New Zealand accounting practices.`,
  path: "/home/",
});

const keyServices = [
  "Annual Financial Statements and working papers",
  "Tax Return Preparation",
  "GST Returns and Compliance",
  "Xero Training",
  "Accounting & Tax Contractor Support",
  "Many more...",
];

export default function HomePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/home-hero-meeting.png"
            alt=""
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-paper/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/50 via-paper/20 to-paper/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:py-28">
          <div className="border border-line bg-paper">
            <div className="grid lg:grid-cols-2 lg:items-start">
              <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
                <h1 className="font-serif text-[1.7rem] leading-[1.15] tracking-[0.06em] text-ink uppercase sm:text-[2.15rem] lg:text-[2.45rem]">
                  <span className="block">NZ ACCOUNTING AND</span>
                  <span className="block">TAX SERVICES</span>
                </h1>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted sm:text-[0.78rem] sm:tracking-[0.22em]">
                  Reliability
                  <span className="text-brass" aria-hidden>
                    ·
                  </span>
                  Accuracy
                  <span className="text-brass" aria-hidden>
                    ·
                  </span>
                  Flexibility
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <Link
                    href="/services/"
                    className="inline-flex min-h-12 w-full items-center justify-center bg-ink px-8 text-[0.78rem] tracking-[0.2em] text-paper transition-colors hover:bg-ink-soft sm:min-h-[3.25rem] sm:w-auto sm:min-w-[12rem]"
                  >
                    VIEW SERVICES
                  </Link>
                  <Link
                    href="/contact-us/"
                    className="inline-flex min-h-12 w-full items-center justify-center border border-ink bg-paper px-8 text-[0.78rem] tracking-[0.2em] text-ink transition-colors hover:border-brass hover:bg-ink hover:text-paper sm:min-h-[3.25rem] sm:w-auto sm:min-w-[12rem]"
                  >
                    CONTACT ME
                  </Link>
                </div>
              </div>

              <div className="border-t border-line px-6 py-10 sm:px-10 sm:py-12 lg:border-t-0 lg:border-l lg:px-12 lg:py-14">
                <div className="flex gap-5">
                  <span
                    className="mt-1 hidden w-px shrink-0 bg-brass sm:block"
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-6">
                    <p className="font-serif text-[1.28rem] leading-8 text-ink sm:text-[1.35rem] sm:leading-9">
                      Providing flexible accounting and tax support to New Zealand
                      accounting practices.
                    </p>
                    <span className="block h-px w-10 bg-brass" />
                    <p className="text-[1.02rem] leading-8 text-muted">
                      Working primarily in Xero on a fixed-fee basis, We assist
                      firms through busy periods or on an ongoing basis to complete
                      annual financial statements and tax returns efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
            SERVICES
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink">Our Key Services</h2>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {keyServices.map((item) => (
              <li
                key={item}
                className="border border-line bg-paper px-6 py-6 text-lg leading-7 text-body"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-stretch justify-between gap-8 border border-ink bg-ink px-6 py-10 text-paper sm:flex-row sm:items-center sm:px-12 sm:py-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">Ready to connect?</h2>
            <p className="mt-3 max-w-lg text-paper/75">
              If your practice needs accounting and tax support, through a busy
              period or on an ongoing basis, get in touch.
            </p>
          </div>
          <Link
            href="/contact-us/"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center bg-paper px-7 py-3.5 text-[0.72rem] tracking-[0.2em] text-ink transition-colors hover:bg-cream sm:w-auto"
          >
            CONTACT ME
          </Link>
        </div>
      </section>
    </main>
  );
}
