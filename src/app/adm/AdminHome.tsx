import {
  addEnquiryRecipient,
  removeEnquiryRecipient,
  signOutAdmin,
  toggleSiteStatus,
} from "@/app/adm/actions";
import { AdminDisclosure } from "@/components/AdminDisclosure";
import { AdminEnquiriesPanel } from "@/components/AdminEnquiriesPanel";
import { AdminVisitorsPanel } from "@/components/AdminVisitorsPanel";
import { LogoMark } from "@/components/LogoMark";
import {
  getEnquiries,
  getSiteConfig,
  getVisitors,
} from "@/lib/site-data";

export async function AdminHome() {
  const [config, visitors, enquiries] = await Promise.all([
    getSiteConfig(),
    getVisitors(),
    getEnquiries(),
  ]);

  const recipientSummary =
    config.enquiryRecipients.length === 1
      ? config.enquiryRecipients[0]
      : `${config.enquiryRecipients.length} addresses`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-5 py-12 sm:px-8">
      <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <LogoMark />
          <h1 className="mt-6 font-serif text-[2.2rem] text-ink sm:text-4xl">Admin panel</h1>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <form action={toggleSiteStatus} className="w-full sm:w-auto">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center bg-ink px-6 text-[0.68rem] tracking-[0.2em] text-paper transition-colors hover:bg-ink-soft sm:min-h-11 sm:w-auto"
            >
              {config.offline ? "MAKE WEBSITE ONLINE" : "SHUT DOWN WEBSITE"}
            </button>
          </form>
          <form action={signOutAdmin} className="w-full sm:w-auto">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center border border-ink px-6 text-[0.68rem] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper sm:min-h-11 sm:w-auto"
            >
              SIGN OUT
            </button>
          </form>
        </div>
      </header>

      <AdminVisitorsPanel initial={visitors} />

      <AdminDisclosure title="Enquiry delivery" summary={recipientSummary}>
        <p className="text-sm text-muted">
          Each enquiry is sent to every address on this list.
        </p>
        <ul className="mt-5 space-y-2">
          {config.enquiryRecipients.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between gap-3 border border-line bg-paper px-3 py-2 text-sm"
            >
              <span className="break-all">{email}</span>
              {config.enquiryRecipients.length > 1 ? (
                <form action={removeEnquiryRecipient}>
                  <input type="hidden" name="recipientEmail" value={email} />
                  <button
                    type="submit"
                    className="text-[0.62rem] tracking-[0.14em] text-muted uppercase hover:text-ink"
                  >
                    Remove
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        <form action={addEnquiryRecipient} className="mt-4 flex gap-2">
          <input
            name="recipientEmail"
            type="email"
            required
            maxLength={254}
            placeholder="Add email"
            className="min-w-0 flex-1 border border-line bg-paper px-3 py-2.5 text-base text-body outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-ink px-4 text-[0.62rem] tracking-[0.16em] text-paper hover:bg-ink-soft"
          >
            ADD
          </button>
        </form>
      </AdminDisclosure>

      <AdminEnquiriesPanel initial={enquiries} />
    </div>
  );
}
