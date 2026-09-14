import { countryFlag } from "@/lib/admin-display";
import { addVisitor, getVisitors } from "@/lib/site-data";
import { clientIpFromHeaders, isPublicIp, looksLikeIp } from "@/lib/ip";
import { clip, FIELD_LIMITS } from "@/lib/security";

export { countryFlag };

const skipped = [
  /^\/adm/,
  /^\/_next/,
  /^\/icon/,
  /^\/apple-icon/,
  /^\/robots\.txt/,
  /^\/sitemap\.xml/,
  /^\/opengraph-image/,
  /^\/api/,
];

const recent = new Map<string, number>();
const DEDUPE_MS = 15_000;

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let device = "Desktop";
  if (/iPad|Tablet/.test(ua)) device = "Tablet";
  else if (/Mobi|iPhone|Android/.test(ua)) device = "Mobile";

  return { browser, os, device };
}

function safeReferrer(value: string) {
  const trimmed = clip(value, FIELD_LIMITS.referrer);
  if (!trimmed) return "";
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "";
  return trimmed;
}

async function lookupCountry(ip: string) {
  if (!looksLikeIp(ip) || !isPublicIp(ip)) {
    return { country: looksLikeIp(ip) ? "Local" : "Unknown", countryCode: "" };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode`,
      {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(2000),
      },
    );
    if (!response.ok) {
      return { country: "Unknown", countryCode: "" };
    }
    const data = (await response.json()) as {
      status?: string;
      country?: string;
      countryCode?: string;
    };
    if (data.status === "success" && data.country) {
      return {
        country: clip(data.country, FIELD_LIMITS.country),
        countryCode: /^[A-Za-z]{2}$/.test(data.countryCode ?? "")
          ? (data.countryCode ?? "").toUpperCase()
          : "",
      };
    }
  } catch {
    /* keep empty country */
  }

  return { country: "Unknown", countryCode: "" };
}

export async function recordVisit(headers: Headers, pathname: string) {
  if (!pathname || skipped.some((pattern) => pattern.test(pathname))) return;

  const ip = clientIpFromHeaders(headers) || "Unknown";
  const path = clip(pathname, FIELD_LIMITS.path);
  const stampKey = `${ip}:${path}`;
  const now = Date.now();
  const last = recent.get(stampKey);
  if (last && now - last < DEDUPE_MS) return;
  recent.set(stampKey, now);
  if (recent.size > 2000) {
    for (const [key, at] of recent) {
      if (now - at > DEDUPE_MS) recent.delete(key);
    }
  }

  const ua = headers.get("user-agent") ?? "";
  const { browser, os, device } = parseUserAgent(ua);
  const { country, countryCode } = await lookupCountry(ip);

  const visitors = await getVisitors();
  const duplicate = visitors[0];
  if (
    duplicate &&
    duplicate.ip === ip &&
    duplicate.path === path &&
    Date.now() - Date.parse(duplicate.timestamp) < DEDUPE_MS
  ) {
    return;
  }

  await addVisitor({
    ip,
    country,
    countryCode,
    timestamp: new Date().toISOString(),
    browser,
    os,
    device,
    referrer: safeReferrer(
      headers.get("referer") || headers.get("referrer") || "",
    ),
    path,
  });
}
