import { NextResponse } from "next/server";
import { passwordGrant, decodeUser } from "@/lib/authServer";
import { setAuthCookies } from "@/lib/authCookies";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  const result = await passwordGrant(username, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const user = decodeUser(result.tokens.access_token);
  const res = NextResponse.json({ user });
  setAuthCookies(res, result.tokens);
  return res;
}
