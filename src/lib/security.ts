import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { headers } from "next/headers";
import { getAppSecret } from "@/lib/app-secret";
import { clientIpFromHeaders } from "@/lib/ip";
import { site } from "@/lib/site";

export { clientIpFromHeaders, isPublicIp, looksLikeIp } from "@/lib/ip";

export const FIELD_LIMITS = {
  name: 120,
  firm: 200,
  email: 254,
  phoneDigits: 15,
  requirements: 8000,
  password: 256,
  referrer: 400,
  path: 200,
  country: 80,
  uaPart: 40,
} as const;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function stripHeader(value: string) {
  return value.replace(/[\r\n\0\u2028\u2029]/g, "").trim();
}

export function isValidEmail(value: string) {
  const email = stripHeader(value);
  return email.length <= FIELD_LIMITS.email && EMAIL_PATTERN.test(email);
}

export async function requestIp() {
  return clientIpFromHeaders(await headers());
}

export async function isTrustedAction() {
  const headerList = await headers();
  const origin = headerList.get("origin");
  const referer = headerList.get("referer");
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "";
  const proto =
    headerList.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  const allowed = new Set(
    [
      host ? `${proto}://${host}` : "",
      `https://${site.domain}`,
      `https://www.${site.domain}`,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean),
  );

  if (origin) {
    try {
      return allowed.has(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return process.env.NODE_ENV !== "production";
}

async function encryptionKey() {
  const secret = await getAppSecret();
  return scryptSync(secret, "nzat-mail-v1", 32);
}

export async function encryptSecret(plain: string) {
  if (!plain) return "";
  const key = await encryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export async function decryptSecret(value: string) {
  if (!value) return "";
  if (!value.startsWith("enc:v1:")) return value;

  const parts = value.split(":");
  if (parts.length !== 5) return "";

  try {
    const key = await encryptionKey();
    const iv = Buffer.from(parts[2], "hex");
    const tag = Buffer.from(parts[3], "hex");
    const data = Buffer.from(parts[4], "hex");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

export function isEncryptedSecret(value: string) {
  return value.startsWith("enc:v1:");
}
