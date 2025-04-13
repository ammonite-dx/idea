import Link from "next/link";
import FavoriteRecords from "@/features/main/FavoriteRecords";
import SignOutButton from '@/components/SignOutButton';

export default function Home() {
  return (
    <div>
      <h1>Idea</h1>
      <div><Link href="/effect-archive">エフェクトアーカイブ</Link></div>
      <div><Link href="/item-archive">アイテムアーカイブ</Link></div>
      <div><Link href="/dlois-archive">Dロイスアーカイブ</Link></div>
      <div><Link href="/elois-archive">Eロイスアーカイブ</Link></div>
      <div><Link href="/works-archive">ワークスアーカイブ</Link></div>
      <h2>ユーザー情報</h2>
      <FavoriteRecords />
    </div>
  );
}
