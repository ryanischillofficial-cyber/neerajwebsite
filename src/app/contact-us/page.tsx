import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "If your practice needs reliable, flexible accounting and tax support, we'd be glad to discuss how we can help.",
  path: "/contact-us/",
});

export default function ContactUsPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-24">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
            CONTACT
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] text-ink sm:text-6xl">
            Let&apos;s Work Together
          </h1>
          <span className="mt-6 block h-px w-12 bg-brass" />
          <div className="mt-8 flex max-w-2xl gap-5">
            <span className="mt-1 hidden w-px shrink-0 bg-brass sm:block" />
            <div className="space-y-6">
              <p className="text-lg leading-8 text-ink sm:text-xl sm:leading-9">
                If your practice needs reliable, flexible accounting and tax
                support, we&apos;d be glad to discuss how we can help.
              </p>
              <p className="text-lg leading-8 text-muted">
                Please complete the form below with a brief overview of your
                requirements. We respond promptly and look forward to discussing
                how we can work together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream/50">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="max-w-2xl">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
