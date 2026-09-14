"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { LogoMark } from "@/components/LogoMark";
import { navItems, site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  const current = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return current === href || current.startsWith(href);
}

const phoneBarStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  gap: 12,
  padding: "16px 20px",
};

const phoneBrandStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  flex: "1 1 auto",
  minWidth: 0,
  gap: 12,
  textDecoration: "none",
  color: "inherit",
};

const phoneTitleStyle: CSSProperties = {
  display: "block",
  overflow: "hidden",
  fontFamily: "var(--font-playfair), serif",
  fontSize: "0.78rem",
  lineHeight: 1.15,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "var(--ink)",
};

const phoneBylineStyle: CSSProperties = {
  display: "block",
  marginTop: 7,
  fontSize: "0.58rem",
  lineHeight: 1,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--brass-deep)",
};

const phoneBurgerStyle: CSSProperties = {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  flex: "0 0 44px",
  gap: 5,
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  border: "1px solid var(--ink)",
  background: "var(--paper)",
  borderRadius: 0,
  textDecoration: "none",
};

const phoneBurgerLineStyle: CSSProperties = {
  display: "block",
  width: 18,
  height: 2,
  background: "var(--ink)",
};

function keepPageStill() {
  const x = window.scrollX;
  const y = window.scrollY;
  requestAnimationFrame(() => {
    window.scrollTo(x, y);
    requestAnimationFrame(() => window.scrollTo(x, y));
  });
}

function BurgerBars() {
  return (
    <>
      <span className="phone-burger-line" style={phoneBurgerLineStyle} />
      <span className="phone-burger-line" style={phoneBurgerLineStyle} />
      <span className="phone-burger-line" style={phoneBurgerLineStyle} />
    </>
  );
}

export function SiteHeader({ pathname }: { pathname: string }) {
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (
      window.location.hash === "#nav-open" ||
      window.location.hash === "#nav-closed"
    ) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 isolate border-b border-line bg-paper">
      <div className="desktop-header mx-auto max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link href="/home/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <span className="min-w-0">
            <span className="block font-serif text-[0.82rem] leading-snug tracking-[0.14em] text-ink uppercase lg:text-[0.9rem] lg:tracking-[0.16em]">
              NZ ACCOUNTING AND TAX SERVICES
            </span>
            <span className="mt-2 block text-[0.62rem] leading-none tracking-[0.32em] text-brass-deep uppercase">
              {site.highlight}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-[0.72rem] tracking-[0.22em] transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-brass transition-all ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="phone-header">
        <span id="nav-closed" className="nav-hash" />
        <span id="nav-open" className="nav-hash" />
        <div className="phone-bar" style={phoneBarStyle}>
          <a href="/home/" className="phone-brand" style={phoneBrandStyle}>
            <LogoMark
              style={{
                width: 48,
                height: 44,
                flexShrink: 0,
              }}
            />
            <span className="phone-brand-text" style={{ minWidth: 0 }}>
              <span className="phone-brand-title" style={phoneTitleStyle}>
                NZ A<span className="font-sans">&</span>T SERVICES
              </span>
              <span className="phone-brand-line" style={phoneBylineStyle}>
                {site.highlight}
              </span>
            </span>
          </a>

          <a
            href="#nav-open"
            className="phone-burger phone-burger-open"
            style={phoneBurgerStyle}
            aria-controls="phone-menu"
            aria-label="Open menu"
            onClick={keepPageStill}
          >
            <BurgerBars />
          </a>
          <a
            href="#nav-closed"
            className="phone-burger phone-burger-close"
            style={phoneBurgerStyle}
            aria-controls="phone-menu"
            aria-label="Close menu"
            onClick={keepPageStill}
          >
            <BurgerBars />
          </a>
        </div>

        <nav id="phone-menu" aria-label="Mobile">
          <ul className="phone-menu-list">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex min-h-12 items-center text-[0.78rem] tracking-[0.2em] ${
                      active ? "text-ink" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
