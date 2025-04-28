// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  // — デバッグ用ログ — 
  console.log("▶︎ RAW VALUE (JSON):", JSON.stringify(process.env.DISCORD_REDIRECT_URI));
  console.log("▶︎ LENGTH:", process.env.DISCORD_REDIRECT_URI?.length);

  // Discord OAuth2 の authorize エンドポイントを組み立て
  const authorizeUrl = new URL('https://discord.com/api/oauth2/authorize');
  authorizeUrl.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID!);
  authorizeUrl.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI!);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'identify guilds');

  console.log('▶︎ redirecting to', authorizeUrl.toString());

  return NextResponse.redirect(authorizeUrl.toString());
}