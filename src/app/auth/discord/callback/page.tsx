export const runtime = 'edge';

import SetSessionCookie from '@/components/SetSessionCookie';

interface Props {
  searchParams: { code?: string };
}

export default async function CallbackPage({ searchParams }: Props) {
  const code = searchParams.code;
  if (!code) {
    // クライアントサイドで error ページに遷移
    return <SetSessionCookie error="missing_code" />;
  }

  // ----- サーバーサイド：Discord OAuth トークン交換 -----
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
    }),
  });
  const tokenData = await tokenRes.json();

  if ((tokenData as any).error) {
    return <SetSessionCookie error="token_failed" />;
  }

  // ギルドチェック（同様に実装）
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds: Array<{ id: string }> = await guildsRes.json();
  if (!guilds.some(g => g.id === process.env.REQUIRED_GUILD_ID)) {
    return <SetSessionCookie error="not_in_guild" />;
  }

  // JWT 発行
  const jwt = await new (await import('jose')).SignJWT({ sub: user.id, name: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  // 成功時は client コンポーネントに JWT を渡す
  return <SetSessionCookie jwt={jwt} />;
}