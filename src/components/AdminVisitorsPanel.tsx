"use client";

import {
  clearVisitorLogs,
  loadAdminVisitors,
} from "@/app/adm/actions";
import { AdminClearMenu } from "@/components/AdminClearMenu";
import { useAdminLive } from "@/components/useAdminLive";
import { countryFlag, formatAdminTime } from "@/lib/admin-display";
import type { VisitorRecord } from "@/lib/site-data";

export function AdminVisitorsPanel({ initial }: { initial: VisitorRecord[] }) {
  const { items, reload } = useAdminLive(loadAdminVisitors, initial);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-serif text-2xl tracking-[0.12em] text-ink">
          VISITORS
        </h2>
        <AdminClearMenu
          label="CLEAR LOGS"
          action={clearVisitorLogs}
          onCleared={reload}
        />
      </div>
      <div className="mt-5 max-h-[min(28rem,60dvh)] overflow-auto border border-line [-webkit-overflow-scrolling:touch]">
        {items.length === 0 ? (
          <p className="px-4 py-6 text-[0.78rem] text-muted">
            No visits recorded yet.
          </p>
        ) : (
          <table className="min-w-[46rem] text-left text-[0.72rem] leading-5 text-body">
            <thead className="sticky top-0 z-10 bg-cream text-[0.62rem] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="bg-cream px-3 py-2.5 font-medium">IP</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Country</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Timestamp</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Browser</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Operating system</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Device</th>
                <th className="bg-cream px-3 py-2.5 font-medium">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {items.map((visit) => (
                <tr key={visit.id} className="border-t border-line">
                  <td className="px-3 py-2.5 align-top">{visit.ip}</td>
                  <td className="px-3 py-2.5 align-top">
                    {visit.countryCode ? `${countryFlag(visit.countryCode)} ` : ""}
                    {visit.country}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {formatAdminTime(visit.timestamp)}
                  </td>
                  <td className="px-3 py-2.5 align-top">{visit.browser}</td>
                  <td className="px-3 py-2.5 align-top">{visit.os}</td>
                  <td className="px-3 py-2.5 align-top">{visit.device}</td>
                  <td className="max-w-56 px-3 py-2.5 align-top break-all text-muted">
                    {visit.referrer || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
