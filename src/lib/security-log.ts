import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { clip } from "@/lib/security";

export type SecurityEvent = {
  at: string;
  event: string;
  ip: string;
  detail?: string;
};

const MAX_EVENTS = 400;
const logPath = path.join(process.cwd(), "data", "security.json");

export async function logSecurityEvent(
  event: string,
  ip: string,
  detail?: string,
) {
  try {
    await mkdir(path.dirname(logPath), { recursive: true });
    let current: SecurityEvent[] = [];
    try {
      current = JSON.parse(await readFile(logPath, "utf8")) as SecurityEvent[];
      if (!Array.isArray(current)) current = [];
    } catch {
      current = [];
    }

    const entry: SecurityEvent = {
      at: new Date().toISOString(),
      event,
      ip: clip(ip || "unknown", 64),
      ...(detail ? { detail: clip(detail, 160) } : {}),
    };

    await writeFile(
      logPath,
      JSON.stringify([entry, ...current].slice(0, MAX_EVENTS), null, 2),
      "utf8",
    );
  } catch {
    /* logging must never break a request */
  }
}
