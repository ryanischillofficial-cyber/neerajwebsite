export function AboutHighlights() {
  return (
    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-0">
      <p className="font-serif text-[1.2rem] leading-snug text-ink sm:text-[1.28rem]">
        <span className="block">Provisional Member of Chartered Accountants</span>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span>Australia and New Zealand</span>
          <span className="font-sans text-[0.72em] tracking-[0.08em] text-muted">
            (CA ANZ)
          </span>
        </span>
      </p>

      <div className="flex items-center border-t border-line pt-5 sm:ml-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <div>
          <p
            className="about-years font-serif text-[1.2rem] leading-none text-ink sm:text-[1.28rem]"
            aria-label="10+ Years of experience"
          >
            <span className="about-years-num tabular-nums">
              <span className="about-years-fallback">10</span>
            </span>
            <span className="about-years-plus text-brass" aria-hidden>
              +
            </span>
          </p>
          <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted">
            Years of experience
          </p>
        </div>
      </div>
    </div>
  );
}
