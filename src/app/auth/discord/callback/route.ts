export const runtime = "edge";

import { NextResponse } from "next/server";
import { SignJWT }    from "jose";

async function exchangeCode(code: string) {
  const params = new URLSearchParams({
    client_id:     process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type:    "authorization_code",
    code,
    redirect_uri:  process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
  });
  const res = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:     params.toString(),
    }
  );
  return res.json();
}

async function fetchDiscord<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`https://discord.com/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function GET(req: Request) {
  try {
    const url  = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) throw new Error("missing_code");

    // 1) トークン交換
    const tokenData = await exchangeCode(code);
    if (tokenData.error) throw new Error("token_failed");

    // 2) ユーザー＆ギルド情報取得
    const user   = await fetchDiscord<{ id: string; username: string }>("/users/@me", tokenData.access_token);
    const guilds = await fetchDiscord<Array<{ id: string }>>("/users/@me/guilds", tokenData.access_token);
    if (!guilds.some(g => g.id === process.env.REQUIRED_GUILD_ID)) {
      throw new Error("not_in_guild");
    }

    // 3) JWT 発行
    const jwt = await new SignJWT({ sub: user.id, name: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // 4) NextResponse でクッキーとリダイレクトを同時に設定
    const redirectTo = new URL("/", req.url).toString();
    const res = NextResponse.redirect(redirectTo);
    res.cookies.set("session", jwt, {
      httpOnly: true,
      path:     "/",
      maxAge:   8 * 60 * 60,
    });
    return res;

  } catch (err: unknown) {
    const code = err instanceof Error ? err.message : "unknown_error";
    const errorUrl = new URL(`/auth/error?error=${code}`, req.url).toString();
    return NextResponse.redirect(errorUrl);
  }
}
