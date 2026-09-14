"use client";

import { useCallback, useEffect, useState } from "react";

const POLL_MS = 2000;

export function useAdminLive<T>(
  loader: () => Promise<T[]>,
  initial: T[],
) {
  const [items, setItems] = useState(initial);

  const reload = useCallback(async () => {
    const next = await loader();
    setItems(next);
  }, [loader]);

  useEffect(() => {
    let timer = 0;
    let active = true;

    const tick = async () => {
      if (!active) return;
      if (document.visibilityState === "visible") {
        await reload();
      }
      if (active) {
        timer = window.setTimeout(tick, POLL_MS);
      }
    };

    timer = window.setTimeout(tick, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void reload();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [reload]);

  return { items, reload };
}
