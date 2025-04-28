// src/app/api/auth/discord/callback/route.ts

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export const runtime = "edge";

async function exchangeCode(code: string) {
  try {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
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

async function fetchDiscord(path: string, token: string) {
  return fetch(`https://discord.com/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json());
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  console.log("▶︎ incoming req.url:", url);
  const code = url.searchParams.get("code");
  if (!code) {
    console.error("⚠️ code がない");
    return new Response("code is required", { status: 400 });
  }

  const tokenData = await exchangeCode(code);
  if (tokenData.error) {
    return NextResponse.redirect("/auth/error?error=token_failed");
  }

  // ユーザー情報取得
  const user = await fetchDiscord("/users/@me", tokenData.access_token);
  // ギルド一覧取得
  const guilds: Array<{ id: string }> = await fetchDiscord(
    "/users/@me/guilds",
    tokenData.access_token
  );

  // ギルド所属チェック
  const ok = guilds.some(g => g.id === process.env.REQUIRED_GUILD_ID);
  if (!ok) {
    return NextResponse.redirect("/auth/error?error=not_in_guild");
  }

  // JWT 発行
  const jwt = await new SignJWT({ sub: user.id, name: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  // --- 絶対 URL を生成する ---
  const redirectToRoot = new URL("/", req.url);
  const res = NextResponse.redirect(redirectToRoot);

  // httpOnly cookie に保存
  res.cookies.set("session", jwt, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}