"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  entryMatches,
  hasAdminSession,
  setAdminSession,
} from "@/app/adm/session";
import { rateLimit } from "@/lib/rate-limit";
import {
  FIELD_LIMITS,
  isTrustedAction,
  isValidEmail,
  requestIp,
  stripHeader,
} from "@/lib/security";
import { logSecurityEvent } from "@/lib/security-log";
import {
  clearEnquiries,
  clearVisitors,
  getEnquiries,
  getSiteConfig,
  getVisitors,
  saveSiteConfig,
  type AdminClearRange,
} from "@/lib/site-data";

export type AdminState = {
  ok: boolean;
  error?: string;
  sent?: boolean;
  message?: string;
};

async function requireAdmin() {
  if (!(await hasAdminSession())) {
    redirect("/adm/");
  }
}

function refreshAdmin() {
  revalidatePath("/adm/");
  revalidatePath("/", "layout");
}

const genericActionError = { ok: false, error: "The request could not be completed." };

export async function signInAdmin(
  _previous: AdminState,
  formData: FormData,
): Promise<AdminState> {
  if (!(await isTrustedAction())) return genericActionError;

  const ip = (await requestIp()) || "unknown";
  const attempts = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!attempts.ok) {
    await logSecurityEvent("admin-login-locked", ip);
    return { ok: false, error: "Please try again later." };
  }

  const password = formData.get("password");
  const input = typeof password === "string" ? password.slice(0, FIELD_LIMITS.password) : "";

  if (!entryMatches(input)) {
    await logSecurityEvent("admin-login-failed", ip);
    return { ok: false, error: "The password is incorrect." };
  }

  try {
    await logSecurityEvent("admin-login-ok", ip);
    await setAdminSession();
  } catch {
    return genericActionError;
  }
  redirect("/adm/");
}

export async function signOutAdmin() {
  await clearAdminSession();
  redirect("/adm/");
}

export async function toggleSiteStatus() {
  await requireAdmin();
  const config = await getSiteConfig();
  await saveSiteConfig({ ...config, offline: !config.offline });
  refreshAdmin();
}

export async function addEnquiryRecipient(formData: FormData) {
  await requireAdmin();
  const email = stripHeader(String(formData.get("recipientEmail") ?? ""))
    .toLowerCase()
    .slice(0, FIELD_LIMITS.email);

  if (!isValidEmail(email)) {
    return;
  }

  const config = await getSiteConfig();
  if (config.enquiryRecipients.includes(email) || config.enquiryRecipients.length >= 20) {
    return;
  }

  await saveSiteConfig({
    ...config,
    enquiryRecipients: [...config.enquiryRecipients, email],
  });
  refreshAdmin();
}

function readClearRange(formData: FormData): AdminClearRange | null {
  const range = String(formData.get("range") ?? "");
  if (range !== "day" && range !== "week" && range !== "month" && range !== "all") {
    return null;
  }
  return range;
}

export async function loadAdminVisitors() {
  if (!(await hasAdminSession())) return [];
  return getVisitors();
}

export async function loadAdminEnquiries() {
  if (!(await hasAdminSession())) return [];
  return getEnquiries();
}

export async function clearVisitorLogs(formData: FormData) {
  await requireAdmin();
  const range = readClearRange(formData);
  if (!range) return;
  await clearVisitors(range);
  refreshAdmin();
}

export async function clearEnquiryLogs(formData: FormData) {
  await requireAdmin();
  const range = readClearRange(formData);
  if (!range) return;
  await clearEnquiries(range);
  refreshAdmin();
}

export async function removeEnquiryRecipient(formData: FormData) {
  await requireAdmin();
  const email = stripHeader(String(formData.get("recipientEmail") ?? ""))
    .toLowerCase()
    .slice(0, FIELD_LIMITS.email);
  const config = await getSiteConfig();
  const next = config.enquiryRecipients.filter((item) => item !== email);
  await saveSiteConfig({
    ...config,
    enquiryRecipients: next.length ? next : config.enquiryRecipients,
  });
  refreshAdmin();
}
