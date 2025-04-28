// src/app/api/auth/discord/login/route.ts

export const runtime = 'edge';

// 🔥🔥🔥 ここが出るはず！
// この文字列が出てこなければ、まだ古いコードが走っています
console.log('🔥 APP-ROUTER LOGIN HANDLER v2 🔥');

export async function GET() {
  console.log('🔥 APP-ROUTER LOGIN HANDLER v2 in GET 🔥');

  const clientId    = process.env.DISCORD_CLIENT_ID!;
  const redirectUri = process.env.DISCORD_REDIRECT_URI!;  // ここには正しく ".../discord/callback" が入っているはず

  // 手動でクエリを組み立て
  const params = [
    `client_id=${encodeURIComponent(clientId)}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    `response_type=code`,
    `scope=${encodeURIComponent('identify guilds')}`
  ].join('&');
  const location = `https://discord.com/api/oauth2/authorize?${params}`;

  console.log('▶︎ redirect to:', location);

  // メタリダイレクト用の HTML を返す
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