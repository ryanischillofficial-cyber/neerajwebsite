import type { CSSProperties } from "react";
import { site } from "@/lib/site";

type LogoMarkProps = {
  className?: string;
  style?: CSSProperties;
};

export function LogoMark({ className = "", style }: LogoMarkProps) {
  return (
    <span
      className={`flex h-11 w-12 shrink-0 items-center justify-center bg-ink font-serif text-[0.7rem] tracking-[0.06em] text-paper ${className}`}
      style={style}
      aria-hidden="true"
    >
      {site.shortMark}
    </span>
  );
}
