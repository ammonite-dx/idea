'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  jwt?: string;
  error?: string;
}

export default function SetSessionCookie({ jwt, error }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace(`/auth/error?error=${error}`);
      return;
    }
    if (jwt) {
      // クライアントサイドで cookie をセット
      document.cookie = `session=${jwt}; Path=/; Max-Age=${8 * 60 * 60}`;
      router.replace('/');
    }
  }, [jwt, error, router]);

  return (
    <div className="p-4 text-center">
      {error ? (
        <p className="text-red-600">エラー: {error}</p>
      ) : (
        <p>ログイン処理中…</p>
      )}
    </div>
  );
}