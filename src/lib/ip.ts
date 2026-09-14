const IPV4 =
  /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;

function isIpv4(value: string) {
  return IPV4.test(value);
}

function isIpv6(value: string) {
  if (!value || value.includes(" ")) return false;
  if (value.split("::").length > 2) return false;
  const compact = value.includes("::");
  const parts = value.split(":");
  if (parts.length > 8) return false;
  if (!compact && parts.length !== 8) return false;
  return parts.every((part) => part === "" || /^[0-9a-fA-F]{1,4}$/.test(part) || isIpv4(part));
}

export function looksLikeIp(value: string) {
  return isIpv4(value) || isIpv6(value);
}

function ipv4Int(ip: string) {
  return ip.split(".").reduce((sum, part) => (sum << 8) + Number(part), 0) >>> 0;
}

function inCidr(ip: string, base: string, bits: number) {
  const shift = 32 - bits;
  return (ipv4Int(ip) >>> shift) === (ipv4Int(base) >>> shift);
}

export function isPublicIp(ip: string) {
  if (isIpv4(ip)) {
    return !(
      inCidr(ip, "0.0.0.0", 8) ||
      inCidr(ip, "10.0.0.0", 8) ||
      inCidr(ip, "100.64.0.0", 10) ||
      inCidr(ip, "127.0.0.0", 8) ||
      inCidr(ip, "169.254.0.0", 16) ||
      inCidr(ip, "172.16.0.0", 12) ||
      inCidr(ip, "192.0.0.0", 24) ||
      inCidr(ip, "192.0.2.0", 24) ||
      inCidr(ip, "192.168.0.0", 16) ||
      inCidr(ip, "198.18.0.0", 15) ||
      inCidr(ip, "198.51.100.0", 24) ||
      inCidr(ip, "203.0.113.0", 24) ||
      inCidr(ip, "224.0.0.0", 4) ||
      inCidr(ip, "240.0.0.0", 4)
    );
  }

  if (isIpv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return false;
    if (lower.startsWith("fe80:") || lower.startsWith("fec0:")) return false;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return false;
    if (lower.startsWith("::ffff:")) {
      return isPublicIp(lower.slice("::ffff:".length));
    }
    return true;
  }

  return false;
}

export function clientIpFromHeaders(headerList: Headers) {
  const candidates = [
    headerList.get("x-visitor-ip"),
    headerList.get("cf-connecting-ip"),
    headerList.get("x-real-ip"),
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];

  for (const value of candidates) {
    if (value && looksLikeIp(value)) return value;
  }

  return "";
}
