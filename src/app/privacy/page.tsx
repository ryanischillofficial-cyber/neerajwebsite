import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "This policy explains how personal information is handled on nzaccountingandtax.org. The website is operated by Neeraj Dhankhar and is intended for New Zealand accounting firms.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="text-2xl text-ink">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-body">
          <p>
            This policy explains how personal information is handled on
            nzaccountingandtax.org. The website is operated by Neeraj Dhankhar
            and is intended for New Zealand accounting firms. It is not directed
            at children. The Privacy Act 2020 (New Zealand) applies.
          </p>

          <h2 className="text-lg text-ink">Who to contact</h2>
          <p>
            Privacy questions, access requests, and correction requests can be
            sent to neeraj@nzaccountingandtax.org. You may also use the contact
            details shown in the website footer.
          </p>

          <h2 className="text-lg text-ink">What we collect</h2>
          <p>
            If you use the Contact Me form we collect the accounting firm name,
            email address, and the brief requirements you enter. Your name and
            phone number are collected only if you choose to provide them. Do
            not send IRD numbers, passwords, bank logins, or other secret
            credentials through the form.
          </p>
          <p>
            If you email, call, or message us, we collect the details you send
            so we can reply. We use personal information only as needed to
            operate this website, respond to you, and meet legal duties. We do
            not sell personal information.
          </p>

          <h2 className="text-lg text-ink">How we use it</h2>
          <p>
            Enquiry details are used to reply to your request and to keep a
            record of that request. We may also use information where the law
            requires it, or where we need to protect the website, our work, or
            other people.
          </p>

          <h2 className="text-lg text-ink">Who may receive it</h2>
          <p>
            We use the information to contact you. Ordinary email and phone
            systems may handle that information, including systems outside New
            Zealand, so that a message can be delivered. We do not pass your
            enquiry to unrelated third parties for their own marketing.
          </p>

          <h2 className="text-lg text-ink">Holding and deleting information</h2>
          <p>
            We keep enquiry information for as long as we need it to reply,
            keep a working record, or meet a legal requirement. You may ask us
            to delete information we hold about you. We will do that where we
            reasonably can. We may keep a record if the law requires it, or if
            we still need it to deal with a complaint or a legal claim.
          </p>

          <h2 className="text-lg text-ink">Your rights</h2>
          <p>
            Under the Privacy Act 2020 you may ask whether we hold personal
            information about you, ask for access to it, and ask for it to be
            corrected if it is wrong. You may also ask us to explain how we
            have used it. We will deal with a request as the Act requires. You
            may complain to the Office of the Privacy Commissioner
            (privacy.org.nz) if you are not satisfied with how a request is
            handled.
          </p>

          <h2 className="text-lg text-ink">Accuracy and your choices</h2>
          <p>
            Please give accurate details on the form. Name and phone are
            optional. If you do not want to use the form, you can contact us
            using the email or phone details on this website instead.
          </p>

          <h2 className="text-lg text-ink">Changes</h2>
          <p>
            This policy may be updated from time to time. The version on this
            page is the current one.
          </p>
        </div>
      </div>
    </main>
  );
}
