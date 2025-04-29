'use client';

import { useState } from 'react';

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    // クライアント環境変数から直接読んで URL を組み立て
    const clientId    = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!;
    const params = new URLSearchParams({
      client_id:    clientId,
      redirect_uri: redirectUri,
      response_type:'code',
      scope:        'identify guilds',
    });
    const url = `https://discord.com/api/oauth2/authorize?${params}`;

    // そのままブラウザを遷移させる
    window.location.href = url;
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      {loading ? 'Redirecting…' : 'Sign in with Discord'}
    </button>
  );
}