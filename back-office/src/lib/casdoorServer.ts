import "server-only";

const CASDOOR_URL = process.env.CASDOOR_URL ?? "http://localhost:8000";
const CLIENT_ID = process.env.CASDOOR_CLIENT_ID ?? "acme-back-office";
const CLIENT_SECRET = process.env.CASDOOR_CLIENT_SECRET ?? "";

const TOKEN_URL = `${CASDOOR_URL}/api/login/oauth/access_token`;
const REFRESH_URL = `${CASDOOR_URL}/api/login/oauth/refresh_token`;

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

export const ACCESS_COOKIE = "cd_access_token";
export const REFRESH_COOKIE = "cd_refresh_token";

function clientCredentials(): Record<string, string> {
  return { client_id: CLIENT_ID, client_secret: CLIENT_SECRET };
}

function normalizeTokens(data: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}): TokenResponse {
  const expiresIn = data.expires_in ?? 3600;
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? "",
    expires_in: expiresIn,
    refresh_expires_in: expiresIn * 24,
    token_type: data.token_type ?? "Bearer",
  };
}

function tokenError(data: { access_token?: string; error_description?: string }) {
  if (data.access_token?.startsWith("error:")) {
    return data.access_token.replace(/^error:\s*/, "");
  }
  return data.error_description ?? "Invalid username or password";
}

export async function passwordGrant(
  username: string,
  password: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      ...clientCredentials(),
      username,
      password,
      scope: "openid",
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token || data.access_token.startsWith("error:")) {
    return { ok: false, error: tokenError(data) };
  }

  return { ok: true, tokens: normalizeTokens(data as TokenResponse) };
}

export async function refreshGrant(
  refreshToken: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false }> {
  const res = await fetch(REFRESH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      ...clientCredentials(),
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false };

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  if (!data.access_token || data.access_token.startsWith("error:")) {
    return { ok: false };
  }

  return { ok: true, tokens: normalizeTokens(data as TokenResponse) };
}

export async function endSession(_refreshToken: string): Promise<void> {
  // Casdoor BFF logout clears cookies locally; no back-channel logout required for dev.
}

function extractRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((role) =>
      typeof role === "string" ? role : ((role as { name?: string }).name ?? ""),
    )
    .filter(Boolean);
}

export function decodeUser(accessToken: string): DecodedUser | null {
  try {
    const payload = accessToken.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json) as {
      name?: string;
      displayName?: string;
      email?: string;
      exp?: number;
      roles?: unknown;
    };
    return {
      username: claims.name,
      name: claims.displayName,
      email: claims.email,
      exp: claims.exp,
      roles: extractRoles(claims.roles),
    };
  } catch {
    return null;
  }
}

export function isExpired(exp?: number, skewSeconds = 10): boolean {
  if (!exp) return true;
  return Date.now() / 1000 >= exp - skewSeconds;
}
