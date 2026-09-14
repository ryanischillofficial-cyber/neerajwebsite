import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "These terms apply when you use nzaccountingandtax.org. The website is operated by Neeraj Dhankhar. Content on this website is general information only.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="text-2xl text-ink">Terms of Use</h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-body">
          <p>
            These terms apply when you use nzaccountingandtax.org. The website
            is operated by Neeraj Dhankhar. By using this website you agree to
            these terms. If you do not agree, do not use the website.
          </p>

          <h2 className="text-lg text-ink">What this website is</h2>
          <p>
            This website describes accounting and tax support offered to New
            Zealand accounting firms. Content on this website is general
            information only. It is not personalised advice, an opinion on your
            clients, an engagement, or a promise that work will be taken on. Use
            of this website does not create a client relationship.
          </p>

          <h2 className="text-lg text-ink">Enquiries and work</h2>
          <p>
            Completing the Contact Me form, or sending an email or message, is
            only a request to talk. Work starts only if both sides later agree
            the scope, fees, and terms of that work. Until then, neither side
            is obliged to proceed.
          </p>
          <p>
            Do not send IRD numbers, passwords, bank logins, client files, or
            other secret credentials through the form or by unsolicited email.
            If work is later agreed, access to records will be arranged in a
            way both sides accept.
          </p>

          <h2 className="text-lg text-ink">Your use of the website</h2>
          <p>
            You must use this website lawfully. You must not try to break,
            overload, copy, or interfere with the website, or use it to send
            unlawful, misleading, or unsolicited material. You must not pretend
            to be someone else when you make an enquiry.
          </p>

          <h2 className="text-lg text-ink">Intellectual property</h2>
          <p>
            The name, mark, text, photos, and layout on this website belong to
            Neeraj Dhankhar unless stated otherwise. You may view pages for
            your own professional enquiry. You may not copy the site, or use
            its content, for another commercial service without permission.
          </p>

          <h2 className="text-lg text-ink">Availability</h2>
          <p>
            The website may be changed, limited, or unavailable from time to
            time. We are not responsible for loss that arises only because the
            website could not be reached or did not work as you expected.
          </p>

          <h2 className="text-lg text-ink">No warranty</h2>
          <p>
            The website is provided as is. To the extent the law allows, we do
            not give warranties about accuracy, completeness, fitness for a
            particular purpose, or that the website will be free of errors or
            interruptions.
          </p>

          <h2 className="text-lg text-ink">Liability</h2>
          <p>
            Nothing in these terms limits rights that cannot be limited under
            New Zealand law. Where you use the website in trade, the parties
            agree that the Consumer Guarantees Act 1993 does not apply to that
            use. To the extent permitted by law, we are not liable for indirect
            or consequential loss, or for loss of profit, data, or opportunity,
            arising from use of this website.
          </p>

          <h2 className="text-lg text-ink">Privacy</h2>
          <p>
            Personal information is handled as set out in the Privacy Policy on
            this website. That policy forms part of these terms.
          </p>

          <h2 className="text-lg text-ink">Changes</h2>
          <p>
            These terms may be updated from time to time. The version on this
            page is the current one. Continued use of the website after a
            change means you accept the updated terms.
          </p>

          <h2 className="text-lg text-ink">Governing law</h2>
          <p>
            These terms are governed by the laws of New Zealand. The New
            Zealand courts have non-exclusive jurisdiction.
          </p>

          <h2 className="text-lg text-ink">Contact</h2>
          <p>
            Questions about these terms: neeraj@nzaccountingandtax.org.
          </p>
        </div>
      </div>
    </main>
  );
}
