import { cache } from "react";
import {
  clip,
  decryptSecret,
  encryptSecret,
  FIELD_LIMITS,
  isEncryptedSecret,
  isValidEmail,
} from "@/lib/security";
import {
  readJsonStore,
  updateJsonStore,
  writeJsonStore,
} from "@/lib/persistent-store";

export type SiteConfig = {
  offline: boolean;
  senderEmail: string;
  senderPassword: string;
  enquiryRecipients: string[];
};

export type VisitorRecord = {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  timestamp: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  path: string;
};

export type EnquiryRecord = {
  id: string;
  receivedAt: string;
  yourName: string;
  firmName: string;
  email: string;
  phone: string;
  requirements: string;
};

export type AdminSessionRecord = {
  hash: string;
  createdAt: string;
  expiresAt: string;
};

const DEFAULT_SENDER = "neeraj@nzaccountingandtax.org";
const DEFAULT_RECIPIENT = "neeraj@nzaccountingandtax.org";
const MAX_VISITORS = 500;
const MAX_ENQUIRIES = 500;
const MAX_RECIPIENTS = 20;
const MAX_SESSIONS = 8;

const CONFIG_FILE = "config.json";
const VISITORS_FILE = "visitors.json";
const ENQUIRIES_FILE = "enquiries.json";
const SESSIONS_FILE = "sessions.json";

function defaultConfig(): SiteConfig {
  return {
    offline: false,
    senderEmail: DEFAULT_SENDER,
    senderPassword: "",
    enquiryRecipients: [DEFAULT_RECIPIENT],
  };
}

function cleanRecipients(value: unknown) {
  if (!Array.isArray(value)) return defaultConfig().enquiryRecipients;
  const emails = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter(isValidEmail)
    .slice(0, MAX_RECIPIENTS);
  return emails.length ? emails : defaultConfig().enquiryRecipients;
}

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const stored = await readJsonStore<Partial<SiteConfig>>(CONFIG_FILE, {});
  const base = defaultConfig();
  const senderEmail =
    typeof stored.senderEmail === "string" && isValidEmail(stored.senderEmail)
      ? stored.senderEmail.trim()
      : base.senderEmail;

  return {
    offline: Boolean(stored.offline),
    senderEmail,
    senderPassword:
      typeof stored.senderPassword === "string" ? stored.senderPassword : "",
    enquiryRecipients: cleanRecipients(stored.enquiryRecipients),
  };
});

export async function saveSiteConfig(next: SiteConfig) {
  const senderPassword = next.senderPassword
    ? isEncryptedSecret(next.senderPassword)
      ? next.senderPassword
      : await encryptSecret(next.senderPassword)
    : "";

  await writeJsonStore(CONFIG_FILE, {
    offline: Boolean(next.offline),
    senderEmail: isValidEmail(next.senderEmail)
      ? next.senderEmail.trim()
      : defaultConfig().senderEmail,
    senderPassword,
    enquiryRecipients: cleanRecipients(next.enquiryRecipients),
  });
}

export async function getMailAccount() {
  const config = await getSiteConfig();
  if (config.senderPassword && !isEncryptedSecret(config.senderPassword)) {
    await saveSiteConfig(config);
  }
  return {
    user: config.senderEmail,
    pass:
      (await decryptSecret(config.senderPassword)) || "",
  };
}

export const getVisitors = cache(async () => {
  const list = await readJsonStore<VisitorRecord[]>(VISITORS_FILE, []);
  return Array.isArray(list) ? list : [];
});

export async function addVisitor(entry: Omit<VisitorRecord, "id">) {
  const record: VisitorRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ip: clip(entry.ip, 64),
    country: clip(entry.country, FIELD_LIMITS.country),
    countryCode: /^[A-Za-z]{2}$/.test(entry.countryCode)
      ? entry.countryCode.toUpperCase()
      : "",
    timestamp: entry.timestamp,
    browser: clip(entry.browser, FIELD_LIMITS.uaPart),
    os: clip(entry.os, FIELD_LIMITS.uaPart),
    device: clip(entry.device, FIELD_LIMITS.uaPart),
    referrer: clip(entry.referrer, FIELD_LIMITS.referrer),
    path: clip(entry.path, FIELD_LIMITS.path),
  };
  await updateJsonStore<VisitorRecord[]>(VISITORS_FILE, [], (list) => {
    const current = Array.isArray(list) ? list : [];
    return [record, ...current].slice(0, MAX_VISITORS);
  });
}

export type AdminClearRange = "day" | "week" | "month" | "all";
export type VisitorClearRange = AdminClearRange;

function rangeCutoff(range: Exclude<AdminClearRange, "all">) {
  const ms =
    range === "day"
      ? 24 * 60 * 60 * 1000
      : range === "week"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;
  return Date.now() - ms;
}

export async function clearVisitors(range: AdminClearRange) {
  if (range === "all") {
    await writeJsonStore(VISITORS_FILE, []);
    return;
  }
  const cutoff = rangeCutoff(range);
  await updateJsonStore<VisitorRecord[]>(VISITORS_FILE, [], (list) => {
    const current = Array.isArray(list) ? list : [];
    return current.filter((visit) => new Date(visit.timestamp).getTime() < cutoff);
  });
}

export const getEnquiries = cache(async () => {
  const list = await readJsonStore<EnquiryRecord[]>(ENQUIRIES_FILE, []);
  return Array.isArray(list) ? list : [];
});

export async function addEnquiry(entry: Omit<EnquiryRecord, "id" | "receivedAt">) {
  const record: EnquiryRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    yourName: clip(entry.yourName, FIELD_LIMITS.name),
    firmName: clip(entry.firmName, FIELD_LIMITS.firm),
    email: clip(entry.email, FIELD_LIMITS.email),
    phone: clip(entry.phone, 20),
    requirements: clip(entry.requirements, FIELD_LIMITS.requirements),
  };
  await updateJsonStore<EnquiryRecord[]>(ENQUIRIES_FILE, [], (list) => {
    const current = Array.isArray(list) ? list : [];
    return [record, ...current].slice(0, MAX_ENQUIRIES);
  });
}

export async function clearEnquiries(range: AdminClearRange) {
  if (range === "all") {
    await writeJsonStore(ENQUIRIES_FILE, []);
    return;
  }
  const cutoff = rangeCutoff(range);
  await updateJsonStore<EnquiryRecord[]>(ENQUIRIES_FILE, [], (list) => {
    const current = Array.isArray(list) ? list : [];
    return current.filter((item) => new Date(item.receivedAt).getTime() < cutoff);
  });
}

export async function getAdminSessions() {
  const list = await readJsonStore<AdminSessionRecord[]>(SESSIONS_FILE, []);
  if (!Array.isArray(list)) return [];
  const now = Date.now();
  return list.filter((item) => Date.parse(item.expiresAt) > now);
}

export async function saveAdminSessions(next: AdminSessionRecord[]) {
  await writeJsonStore(SESSIONS_FILE, next.slice(0, MAX_SESSIONS));
}
