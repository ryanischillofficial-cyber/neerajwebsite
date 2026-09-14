import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  getAdminSessions,
  saveAdminSessions,
} from "@/lib/site-data";

export const ADMIN_ENTRY = "5095fbbd658e0cf115c0935562225794";
export const ADMIN_COOKIE = "adm";

const SESSION_MS = 60 * 60 * 24;

function sameValue(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function entryMatches(input: string) {
  return sameValue(input.trim().toLowerCase(), ADMIN_ENTRY);
}

export async function hasAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || token.length < 32) return false;

  const hash = hashToken(token);
  const sessions = await getAdminSessions();
  return sessions.some((session) => sameValue(session.hash, hash));
}

export async function setAdminSession() {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_MS);

  await saveAdminSessions([
    {
      hash: hashToken(token),
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    },
  ]);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/adm",
    maxAge: SESSION_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) {
    const hash = hashToken(token);
    const sessions = await getAdminSessions();
    await saveAdminSessions(
      sessions.filter((session) => !sameValue(session.hash, hash)),
    );
  }
  jar.delete({ name: ADMIN_COOKIE, path: "/adm" });
}
