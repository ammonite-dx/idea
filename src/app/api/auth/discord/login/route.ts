export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 [login API] start');
  try {
    const clientId    = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    console.log('🚀 [login API] env:', { clientId, redirectUri });

    const params = new URLSearchParams({ client_id: clientId!, redirect_uri: redirectUri!, response_type: 'code', scope: 'identify guilds' });
    const url = `https://discord.com/api/oauth2/authorize?${params}`;
    console.log('🚀 [login API] url:', url);

    return NextResponse.json({ url });
  } catch (err) {
    console.error('🔥 [login API] Exception:', err);
    if (err instanceof Error) console.error(err.stack);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}