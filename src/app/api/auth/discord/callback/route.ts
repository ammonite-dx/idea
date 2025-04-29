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
  console.log("🔁 [callback] start:", req.url);
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    console.log("🔁 [callback] code:", code);
    if (!code) throw new Error("code missing");

    // 環境変数チェック
    console.log("🔁 [callback] NEXT_PUBLIC_DISCORD_CLIENT_ID:", !!process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
    console.log("🔁 [callback] DISCORD_CLIENT_SECRET:", !!process.env.DISCORD_CLIENT_SECRET);
    console.log("🔁 [callback] REDIRECT_URI:", process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI);
    console.log("🔁 [callback] REQUIRED_GUILD_ID:", process.env.REQUIRED_GUILD_ID);
    console.log("🔁 [callback] JWT_SECRET:", !!process.env.JWT_SECRET);

    // ① トークン取得
    console.log("🔁 [callback] exchangeCode() start");
    const tokenData = await exchangeCode(code!);
    console.log("🔁 [callback] tokenData:", tokenData);
    if (tokenData.error) {
      console.error("🔁 [callback] token error:", tokenData);
      return NextResponse.redirect("/auth/error?error=token_failed");
    }

    // ② ユーザー情報
    console.log("🔁 [callback] fetchDiscord user start");
    const user = await fetchDiscord<DiscordUser>("/users/@me", tokenData.access_token);
    console.log("🔁 [callback] user:", user);

    // ③ ギルド一覧
    console.log("🔁 [callback] fetchDiscord guilds start");
    const guilds = await fetchDiscord<Guild[]>("/users/@me/guilds", tokenData.access_token);
    console.log("🔁 [callback] guilds:", guilds);

    // ④ ギルド所属チェック
    const ok = Array.isArray(guilds) && guilds.some((g) => g.id === process.env.REQUIRED_GUILD_ID);
    console.log("🔁 [callback] in required guild?", ok);
    if (!ok) {
      return NextResponse.redirect("/auth/error?error=not_in_guild");
    }

    // ⑤ JWT 発行
    console.log("🔁 [callback] sign JWT start");
    const jwt = await new SignJWT({ sub: user.id, name: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
    console.log("🔁 [callback] jwt:", jwt.slice(0,10) + "...");

    // ⑥ リダイレクト＆Cookie 設定
    console.log("🔁 [callback] setting cookie and redirect");
    const redirectToRoot = new URL("/", req.url);
    const res = NextResponse.redirect(redirectToRoot);
    res.cookies.set("session", jwt, {
      httpOnly: true,
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    console.log("🔁 [callback] done");
    return res;

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🔥 [callback] Exception:", err);
      console.error("🔥 [callback] Exception:", err.message);
      console.error(err.stack);
    }
    return new Response("Callback processing error", { status: 500 });
  }
}