import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export const runtime = 'edge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) { // POSTリクエストでトリガーする想定
  try {
    const { userId } = await auth(); // 現在認証されているユーザーのIDを取得
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // ClerkのBackend APIを使って、ユーザーのDiscord OAuthアクセストークンを取得
    const client = await clerkClient(); 
    const oauthTokensResponse = await client.users.getUserOauthAccessToken(userId, 'discord');
    const oauthAccessTokens = oauthTokensResponse.data;

    if (!oauthAccessTokens || oauthAccessTokens.length === 0 || !oauthAccessTokens[0]?.token) {
      console.error('Discord OAuth token data not found or invalid for user:', userId, JSON.stringify(oauthTokensResponse, null, 2));
      return NextResponse.json({ error: 'Discord OAuth token not found or invalid.' }, { status: 400 });
    }
    const accessToken = oauthAccessTokens[0].token;

    // Discord APIを呼び出してギルド情報を取得
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!guildsResponse.ok) {
      const errorData = await guildsResponse.json().catch(() => ({}));
      console.error('Discord API error fetching guilds:', guildsResponse.status, errorData);
      return NextResponse.json({ error: 'Failed to fetch Discord guilds.', details: errorData }, { status: guildsResponse.status });
    }

    const guilds: { id: string; name: string; }[] = await guildsResponse.json();
    const targetGuildId = process.env.DISCORD_TARGET_GUILD_ID;

    if (!targetGuildId) {
      console.error('DISCORD_TARGET_GUILD_ID is not set in environment variables.');
      return NextResponse.json({ error: 'Target guild ID not configured.' }, { status: 500 });
    }

    const isMember = guilds.some(guild => guild.id === targetGuildId);

    // ギルド所属情報をClerkのユーザーメタデータに保存
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        isMemberOfTargetGuild: isMember,
        targetGuildId: targetGuildId,
        guildCheckTimestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({ 
      isMember, 
      message: isMember ? 'Guild membership verified.' : 'Not a member of the target guild.' 
    });

  } catch (error) {
    console.error('Error verifying guild membership:', error);
    // エラーの型に応じて詳細な情報を返すことも検討
    return NextResponse.json({ error: 'Internal server error while verifying guild membership.' }, { status: 500 });
  }
}