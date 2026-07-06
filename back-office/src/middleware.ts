import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "bo_access_token";

const ADMIN_ONLY_PREFIXES = ["/users"];

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function getRoles(token: string): string[] {
  try {
    const payload = token.split(".")[1];
    const claims = JSON.parse(base64UrlDecode(payload)) as {
      roles?: string[];
    };
    return claims.roles ?? [];
  } catch {
    return [];
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresAdmin = ADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!requiresAdmin) return NextResponse.next();

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const roles = getRoles(token);
  if (!roles.includes("admin")) {
    const url = new URL("/dashboard", req.url);
    url.searchParams.set("error", "forbidden");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
};
