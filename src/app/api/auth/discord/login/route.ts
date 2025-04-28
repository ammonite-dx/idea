// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

// NextResponse は使わないので削除
// import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🔥 RUNNING APP ROUTER LOGIN");
  console.log('▶︎ CLIENT_ID=', process.env.DISCORD_CLIENT_ID);
  console.log('▶︎ REDIRECT_URI=', process.env.DISCORD_REDIRECT_URI);

  const url = new URL('https://discord.com/api/oauth2/authorize');
  url.searchParams.set('client_id',   process.env.DISCORD_CLIENT_ID!);
  url.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI!);
  url.searchParams.set('response_type','code');
  url.searchParams.set('scope',        'identify guilds');

  const location = url.toString();
  console.log('▶︎ redirect to:', location);

  // NextResponse.redirect()/Response.redirect() を使わず、new Response で返す
  return new Response(null, {
    status: 302,
    headers: {
      Location: location
    }
  });
}