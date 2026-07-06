import "server-only";
import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  type TokenResponse,
} from "@/lib/casdoorServer";

const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(res: NextResponse, tokens: TokenResponse): void {
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };

  res.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    ...base,
    maxAge: tokens.expires_in,
  });
  res.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
    ...base,
    maxAge: tokens.refresh_expires_in,
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}
