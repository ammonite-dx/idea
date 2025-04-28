// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

export async function GET() {
  // 環境変数はビルド時にバンドルされるため、なるべくこのまま使う
  const clientId    = process.env.DISCORD_CLIENT_ID!;  
  const redirectUri = process.env.DISCORD_REDIRECT_URI!;

  // 手動でクエリを組み立て
  const params = [
    `client_id=${encodeURIComponent(clientId)}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    `response_type=code`,
    `scope=${encodeURIComponent('identify guilds')}`
  ].join('&');
  const location = `https://discord.com/api/oauth2/authorize?${params}`;

  // デバッグログ（必要に応じて外してOK）
  console.log('▶︎ redirect to:', location);

  // HTML の meta リダイレクト
  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="refresh" content="0; URL='${location}'" />
        <title>Redirecting to Discord…</title>
      </head>
      <body>
        <p>Redirecting to <a href="${location}">${location}</a></p>
      </body>
    </html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8'
    }
  });
}