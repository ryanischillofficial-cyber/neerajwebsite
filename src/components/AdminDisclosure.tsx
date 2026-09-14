"use client";

import { useState } from "react";

export function AdminDisclosure({
  title,
  summary,
  children,
}: {
  title: string;
  summary?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-line bg-cream/40">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl text-ink">{title}</h2>
          {!open && summary ? (
            <p className="mt-1 truncate text-sm text-muted">{summary}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-ink px-5 text-[0.68rem] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {open ? "CLOSE" : "OPEN"}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line px-6 py-6">{children}</div>
      ) : null}
    </div>
  );
}
