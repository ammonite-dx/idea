export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId    = process.env.DISCORD_CLIENT_ID!;
  const redirectUri = process.env.DISCORD_REDIRECT_URI!;

  // OAuth URL を組み立て
  const params = new URLSearchParams({
    client_id:    clientId,
    redirect_uri: redirectUri,
    response_type:'code',
    scope:        'identify guilds',
  });
  const url = `https://discord.com/api/oauth2/authorize?${params}`;

  // JSON で返却
  return NextResponse.json({ url });
}