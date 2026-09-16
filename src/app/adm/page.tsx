import type { Metadata } from "next";
import { AdminHome } from "@/app/adm/AdminHome";
import { AdminLogin } from "@/app/adm/AdminLogin";
import { hasAdminSession } from "@/app/adm/session";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const signedIn = await hasAdminSession();
  return signedIn ? <AdminHome /> : <AdminLogin />;
}
