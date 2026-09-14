"use client";

import {
  clearEnquiryLogs,
  loadAdminEnquiries,
} from "@/app/adm/actions";
import { AdminClearMenu } from "@/components/AdminClearMenu";
import { useAdminLive } from "@/components/useAdminLive";
import { formatAdminTime } from "@/lib/admin-display";
import type { EnquiryRecord } from "@/lib/site-data";

export function AdminEnquiriesPanel({ initial }: { initial: EnquiryRecord[] }) {
  const { items, reload } = useAdminLive(loadAdminEnquiries, initial);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-brass-deep">
            Enquiries
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Form submissions</h2>
        </div>
        <AdminClearMenu label="CLEAR" action={clearEnquiryLogs} onCleared={reload} />
      </div>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="border border-line px-4 py-6 text-[0.78rem] text-muted">
            No enquiries yet.
          </p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="border border-line bg-paper px-5 py-5">
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                {formatAdminTime(item.receivedAt)}
              </p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {item.yourName ? (
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                      Name
                    </dt>
                    <dd>{item.yourName}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    Accounting firm name
                  </dt>
                  <dd>{item.firmName}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    Email address
                  </dt>
                  <dd className="break-all">{item.email}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    Phone number
                  </dt>
                  <dd>{item.phone}</dd>
                </div>
              </dl>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-body">
                {item.requirements}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
