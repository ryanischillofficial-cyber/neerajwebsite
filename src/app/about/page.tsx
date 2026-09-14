import type { Metadata } from "next";
import Image from "next/image";
import { AboutHighlights } from "@/components/AboutHighlights";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Professional Profile",
  description:
    "Neeraj Dhankhar is the Managing Owner of the business, with over ten years of experience in New Zealand accounting and tax services.",
  path: "/about/",
});

const aboutParagraphs = [
  "Neeraj Dhankhar is the Managing Owner of the business, with over ten years of experience in New Zealand accounting and tax services.",
  "Neeraj moved to New Zealand with his family in 2015 and completed a Graduate Diploma in Accounting from MIT, Auckland. He gained practical experience with New Zealand Chartered Accounting practices in Cambridge and Hamilton, developing strong knowledge of NZ accounting, taxation, and compliance requirements. He is also a Provisional Member of Chartered Accountants Australia and New Zealand (CA ANZ).",
  "He has extensive experience preparing annual financial statements, tax returns, GST returns, working papers, and year-end compliance, with strong expertise in Xero.",
  "Since relocating to India in 2023, Neeraj has continued to provide remote accounting and tax support to New Zealand Chartered Accountants and accounting firms. With practical NZ accounting experience, he understands the requirements of working remotely and aims to provide simple, efficient, and reliable contractor support.",
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-20">
            <div className="lg:col-start-1">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
                BACKGROUND
              </p>
              <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.08] text-ink sm:text-6xl">
                Professional Profile
              </h1>
              <span className="mt-6 block h-px w-12 bg-brass" />
              <AboutHighlights />
            </div>

            <figure className="lg:col-start-2 lg:row-span-2 lg:sticky lg:top-28">
              <div className="border border-line bg-paper p-3">
                <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                  <Image
                    src="/ProNeerajPhoto.jpeg"
                    alt="Neeraj Dhankhar, Xero Specialist"
                    fill
                    className="object-cover object-[center_20%]"
                    sizes="(min-width: 1024px) 19rem, 100vw"
                    priority
                  />
                </div>
              </div>
              <figcaption className="mt-4 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                  Neeraj Dhankhar
                </p>
                <p className="mt-1.5 text-[0.58rem] uppercase tracking-[0.22em] text-brass-deep">
                  Xero Specialist
                </p>
              </figcaption>
            </figure>

            <div className="max-w-2xl lg:col-start-1">
              <div className="space-y-6 text-lg leading-8 text-muted">
                {aboutParagraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
              WHAT TO EXPECT
            </p>
            <h2 className="mt-3 font-serif text-4xl text-ink">My Approach</h2>
            <span className="mt-6 block h-px w-12 bg-brass" />
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted lg:pt-8">
            Providing New Zealand accounting firms with reliable, accurate, and
            flexible contractor support. This enables your practice to scale
            workload capacity smoothly while fully maintaining your existing
            systems, standards, and processes.
          </p>
        </div>
      </section>
    </main>
  );
}
