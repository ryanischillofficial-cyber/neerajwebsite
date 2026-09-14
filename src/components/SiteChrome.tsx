"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConstructionScreen } from "@/components/ConstructionScreen";
import { SiteHeader } from "@/components/SiteHeader";

function isAdminPath(pathname: string) {
  return pathname === "/adm" || pathname.startsWith("/adm/");
}

function isLegalPath(pathname: string) {
  return (
    pathname === "/privacy" ||
    pathname.startsWith("/privacy/") ||
    pathname === "/terms" ||
    pathname.startsWith("/terms/")
  );
}

function withSlash(path: string) {
  if (!path || path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

export function SiteChrome({
  children,
  offline,
  initialPathname,
  footer,
}: {
  children: React.ReactNode;
  offline: boolean;
  initialPathname: string;
  footer: React.ReactNode;
}) {
  const clientPathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const pathname = withSlash(hydrated ? clientPathname : initialPathname);

  if (isAdminPath(pathname)) {
    return children;
  }

  if (offline && !isLegalPath(pathname)) {
    return (
      <>
        <ConstructionScreen />
        {footer}
      </>
    );
  }

  return (
    <>
      <SiteHeader pathname={pathname} />
      {children}
      {footer}
    </>
  );
}
