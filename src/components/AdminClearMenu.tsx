"use client";

import { useState } from "react";

const ranges = [
  { value: "day", label: "1 day" },
  { value: "week", label: "1 week" },
  { value: "month", label: "1 month" },
  { value: "all", label: "All time" },
] as const;

export function AdminClearMenu({
  label,
  action,
  onCleared,
}: {
  label: string;
  action: (formData: FormData) => Promise<void>;
  onCleared?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center justify-center border border-ink px-5 text-[0.68rem] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-2 min-w-44 border border-line bg-paper py-2 shadow-[0_12px_32px_rgba(11,31,58,0.08)]">
          <p className="px-4 pb-2 text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            Clear
          </p>
          {ranges.map((range) => (
            <form
              key={range.value}
              action={async (formData) => {
                await action(formData);
                await onCleared?.();
                setOpen(false);
              }}
            >
              <input type="hidden" name="range" value={range.value} />
              <button
                type="submit"
                className="block w-full px-4 py-2 text-left text-[0.78rem] text-body transition-colors hover:bg-cream"
              >
                {range.label}
              </button>
            </form>
          ))}
        </div>
      ) : null}
    </div>
  );
}
