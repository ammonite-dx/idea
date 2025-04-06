'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return <button onClick={() => signIn('discord')}>Discordでログイン</button>;
  }

  return (
    <div>
      <h1>Idea</h1>
      <div><Link href="/effect-archive">エフェクトアーカイブ</Link></div>
      <div><Link href="/item-archive">アイテムアーカイブ</Link></div>
      <div><Link href="/dlois-archive">Dロイスアーカイブ</Link></div>
      <div><Link href="/elois-archive">Eロイスアーカイブ</Link></div>
      <p>ようこそ、{session.user?.name} さん</p>
      <button onClick={() => signOut()}>ログアウト</button>
    </div>
  );
}
