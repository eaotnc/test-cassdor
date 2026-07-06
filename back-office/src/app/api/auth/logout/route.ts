import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { REFRESH_COOKIE, endSession } from "@/lib/casdoorServer";
import { clearAuthCookies } from "@/lib/authCookies";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await endSession(refreshToken);
  }

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
