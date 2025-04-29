// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔥 in GET start');

  const clientId    = process.env.DISCORD_CLIENT_ID!;
  const redirectUri = process.env.DISCORD_REDIRECT_URI!;

  // 文字列でクエリを手動組み立て
  const params = [
    `client_id=${encodeURIComponent(clientId)}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    `response_type=code`,
    `scope=${encodeURIComponent('identify guilds')}`
  ].join('&');
  const location = `https://discord.com/api/oauth2/authorize?${params}`;

  console.log('▶︎ redirect to:', location);

  // ← ここだけを使う。NextResponse.redirect は静的メソッドなので this 問題を起こしません
  return NextResponse.redirect(location);
}