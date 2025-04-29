'use client';

import { useState } from 'react';

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/discord/login');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = await res.json();
      // ここでクライアントサイド遷移
      window.location.href = url;
    } catch (e) {
      console.error('Discord login failed', e);
      setLoading(false);
      alert('ログイン用URLの取得に失敗しました');
    }
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