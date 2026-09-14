import { NextResponse, type NextRequest } from "next/server";
import { looksLikeIp } from "@/lib/ip";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwarded?.split(",")[0]?.trim() ||
    "";

  if (looksLikeIp(ip)) {
    headers.set("x-visitor-ip", ip);
  }

  const response = NextResponse.next({
    request: { headers },
  });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
