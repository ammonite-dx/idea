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
  console.log("🔁 [callback] start:", req.url);
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    console.log("🔁 [callback] code:", code);
    if (!code) throw new Error("code missing");

    // 環境変数チェック
    console.log("🔁 [callback] DISCORD_CLIENT_ID:", !!process.env.DISCORD_CLIENT_ID);
    console.log("🔁 [callback] DISCORD_CLIENT_SECRET:", !!process.env.DISCORD_CLIENT_SECRET);
    console.log("🔁 [callback] REDIRECT_URI:", process.env.DISCORD_REDIRECT_URI);
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
    const user = await fetchDiscord("/users/@me", tokenData.access_token);
    console.log("🔁 [callback] user:", user);

    // ③ ギルド一覧
    console.log("🔁 [callback] fetchDiscord guilds start");
    const guilds = await fetchDiscord("/users/@me/guilds", tokenData.access_token);
    console.log("🔁 [callback] guilds:", guilds);

    // ④ ギルド所属チェック
    const ok = Array.isArray(guilds) && guilds.some((g: any) => g.id === process.env.REQUIRED_GUILD_ID);
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

  } catch (err: any) {
    console.error("🔥 [callback] Exception:", err.message);
    console.error(err.stack);
    return new Response("Callback processing error", { status: 500 });
  }
}