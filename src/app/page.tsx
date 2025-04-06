import Link from "next/link";
import FavoritePowers from "@/features/main/FavoritePowers";
import FavoriteItems from "@/features/main/FavoriteItems";
import FavoriteDloises from "@/features/main/FavoriteDloises";
import FavoriteEloises from "@/features/main/FavoriteEloises";
import SignOutButton from '@/components/SignOutButton';

export default function Home() {
  return (
    <div>
      <h1>Idea</h1>
      <div><Link href="/effect-archive">エフェクトアーカイブ</Link></div>
      <div><Link href="/item-archive">アイテムアーカイブ</Link></div>
      <div><Link href="/dlois-archive">Dロイスアーカイブ</Link></div>
      <div><Link href="/elois-archive">Eロイスアーカイブ</Link></div>
      <h2>ユーザー情報</h2>
      <FavoritePowers/>
      <FavoriteItems/>
      <FavoriteDloises/>
      <FavoriteEloises/>
      <SignOutButton/>
    </div>
  );
}
