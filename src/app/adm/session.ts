import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAppSecret } from "@/lib/app-secret";

export const ADMIN_ENTRY = "5095fbbd658e0cf115c0935562225794";
export const ADMIN_COOKIE = "adm";

const SESSION_MS = 60 * 60 * 24 * 1000;

function sameValue(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(secret: string, token: string, expires: string) {
  return createHmac("sha256", secret).update(`${token}.${expires}`).digest("hex");
}

export function entryMatches(input: string) {
  return sameValue(input.trim().toLowerCase(), ADMIN_ENTRY);
}

export async function hasAdminSession() {
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  if (!value) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [token, expires, sig] = parts;
  if (!token || !/^\d+$/.test(expires) || !sig) return false;
  if (Date.now() > Number(expires)) return false;

  const secret = await getAppSecret();
  const expected = sign(secret, token, expires);
  return sameValue(sig, expected);
}

export async function setAdminSession() {
  const secret = await getAppSecret();
  const token = randomBytes(32).toString("hex");
  const expires = String(Date.now() + SESSION_MS);
  const value = `${token}.${expires}.${sign(secret, token, expires)}`;

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "strict",
    path: "/adm",
    maxAge: SESSION_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/adm" });
}
