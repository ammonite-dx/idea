// src/app/api/auth/discord/callback/route.ts

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export const runtime = "edge";

interface TokenResponse {
  access_token: string;
  token_type:   string;
  expires_in:   number;
  refresh_token?: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface DiscordUser {
  id: string;
  username: string;
}

interface Guild {
  id: string;
}

async function exchangeCode(code: string): Promise<TokenResponse> {
  try {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
    });
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    return res.json();
  } catch (e) {
    console.error("⚠️ exchangeCode failed:", e);
    throw e;
  }
}

async function fetchDiscord<T>(path: string, token: string): Promise<T> {
  return fetch(`https://discord.com/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json() as Promise<T>);
}

export async function GET(req: Request) {
  try {
    const url  = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) throw new Error("missing_code");

    // 1) トークン交換
    const tokenData = await exchangeCode(code);
    if ((tokenData as any).error) throw new Error("token_failed");

    // 2) ユーザー情報・ギルド一覧取得
    const user   = await fetchDiscord<{ id: string; username: string }>("/users/@me", tokenData.access_token);
    const guilds = await fetchDiscord<Array<{ id: string }>>("/users/@me/guilds", tokenData.access_token);
    const inGuild = guilds.some(g => g.id === process.env.REQUIRED_GUILD_ID);
    if (!inGuild) throw new Error("not_in_guild");

    // 3) JWT 発行
    const jwt = await new SignJWT({ sub: user.id, name: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // 4) Cookie とリダイレクトヘッダを自前で設定
    const redirectTo = new URL("/", req.url).toString();
    const headers = new Headers({
      Location:    redirectTo,
      "Set-Cookie": `session=${jwt}; HttpOnly; Path=/; Max-Age=${8 * 60 * 60}`,
    });

    console.log("🔁 [callback] success, redirecting");
    return new Response(null, { status: 302, headers });

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🔥 [callback] error:", err.message);
      // エラーコードに応じたページへ絶対URLでリダイレクト
      const errorUrl = new URL(`/auth/error?error=${err.message}`, req.url).toString();
      const headers  = new Headers({ Location: errorUrl });
      return new Response(null, { status: 302, headers });
    }
    return new Response("Callback processing error", { status: 500 });
  }
}