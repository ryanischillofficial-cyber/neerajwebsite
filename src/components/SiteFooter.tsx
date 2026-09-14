import type { ReactNode } from "react";

function FooterAmpersand() {
  return <span className="font-sans">&</span>;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M3.2 2.3c.3-.3.8-.4 1.2-.2l2 1c.4.2.6.6.5 1.1l-.4 1.6c-.1.3 0 .6.2.8l1.7 1.7c.2.2.5.3.8.2l1.6-.4c.4-.1.9.1 1.1.5l1 2c.2.4.1.9-.2 1.2l-1 1c-.4.4-1 .6-1.5.4C7.4 12.4 3.6 8.6 2.8 5c-.2-.6 0-1.1.4-1.5z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M8 1.3A6.7 6.7 0 0 0 2.2 11.4L1.3 14.7l3.4-.9A6.7 6.7 0 1 0 8 1.3m3.8 9.5c-.2.5-1 .9-1.4 1-.4 0-2.3.4-4.5-1.7-1.8-1.8-2.2-3.6-2.3-4.1 0-.4.3-1.1.8-1.3.2-.1.4-.1.6 0l.8 1.8c.1.2 0 .4-.1.6l-.3.5c-.1.1-.1.3 0 .4.4.6 1.1 1.3 1.8 1.8.2.1.3.1.4 0l.5-.3c.2-.1.4-.2.6-.1l1.8.8c.1.2.1.4 0 .6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M1.5 3.5h13v9h-13zm1.2 1.3 5.3 3.6 5.3-3.6v-.3H2.7zm0 6.4h10.6V6.2L8 9.7 2.7 6.2z" />
    </svg>
  );
}

function FooterButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { rel: "noopener noreferrer" } : {})}
      className="inline-flex size-11 shrink-0 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-brass hover:bg-paper hover:text-ink md:size-7"
    >
      <span className="inline-flex size-3.5 items-center justify-center [&>svg]:block">
        {icon}
      </span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <div>
            <p className="font-serif text-2xl text-paper">Neeraj Dhankhar</p>
            <p className="mt-3 text-paper/80">
              NZ Accounting <FooterAmpersand /> Tax Services Contractor
            </p>
            <p className="mt-2 text-sm tracking-wide text-paper/65">
              B.Com | Provisional Member – CA ANZ | Xero Specialist
            </p>
          </div>

          <div className="grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 md:ml-auto md:w-max">
            <p className="min-w-0 break-all text-paper/85">+640223176728</p>
            <div className="flex items-center justify-end gap-1.5">
              <FooterButton
                href="https://wa.me/640223176728"
                label="WhatsApp"
                icon={<WhatsAppIcon />}
              />
            </div>
            <p className="min-w-0 break-all text-paper/85">+918826966728</p>
            <div className="flex items-center justify-end gap-1.5">
              <FooterButton
                href="tel:+918826966728"
                label="Call"
                icon={<PhoneIcon />}
              />
              <FooterButton
                href="https://wa.me/918826966728"
                label="WhatsApp"
                icon={<WhatsAppIcon />}
              />
            </div>
            <p className="min-w-0 break-all text-paper/85">
              neeraj@nzaccountingandtax.org
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <FooterButton
                href="mailto:neeraj@nzaccountingandtax.org"
                label="Email"
                icon={<MailIcon />}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.58rem] tracking-[0.16em] text-paper/40">
            Accounting and Tax Services
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.58rem] tracking-[0.16em] text-paper/40">
            <a href="/privacy/" className="transition-colors hover:text-paper">
              Privacy Policy
            </a>
            <a href="/terms/" className="transition-colors hover:text-paper">
              Terms of Use
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
