import "server-only";

const API_URL = process.env.API_SERVICE_URL ?? "http://localhost:4000";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface DecodedUser {
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
  exp?: number;
}

export const ACCESS_COOKIE = "bo_access_token";
export const REFRESH_COOKIE = "bo_refresh_token";

export async function passwordGrant(
  username: string,
  password: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      error:
        (data as { message?: string }).message ??
        "Invalid username or password",
    };
  }

  return { ok: true, tokens: (await res.json()) as TokenResponse };
}

export async function refreshGrant(
  refreshToken: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false }> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false };
  return { ok: true, tokens: (await res.json()) as TokenResponse };
}

export async function endSession(refreshToken: string): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  }).catch(() => {});
}

export function decodeUser(accessToken: string): DecodedUser | null {
  try {
    const payload = accessToken.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json) as {
      username?: string;
      name?: string;
      email?: string;
      exp?: number;
      roles?: string[];
    };
    return {
      username: claims.username,
      name: claims.name,
      email: claims.email,
      exp: claims.exp,
      roles: claims.roles ?? [],
    };
  } catch {
    return null;
  }
}

export function isExpired(exp?: number, skewSeconds = 10): boolean {
  if (!exp) return true;
  return Date.now() / 1000 >= exp - skewSeconds;
}
