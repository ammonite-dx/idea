// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  // — デバッグ用ログ — 
  console.log("▶︎ ENV KEYS:", Object.keys(process.env));
  console.log("▶︎ RAW REDIRECT_URI:", process.env.DISCORD_REDIRECT_URI);
  console.log("▶︎ CHAR CODES:", process.env.DISCORD_REDIRECT_URI!.split("").map(c=>c.charCodeAt(0)).join(","));

  // Discord OAuth2 の authorize エンドポイントを組み立て
  const authorizeUrl = new URL('https://discord.com/api/oauth2/authorize');
  authorizeUrl.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID!);
  authorizeUrl.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI!);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'identify guilds');

  console.log('▶︎ redirecting to', authorizeUrl.toString());

  return NextResponse.redirect(authorizeUrl.toString());
}