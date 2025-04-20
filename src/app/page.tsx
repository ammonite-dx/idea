import Link from "next/link"
import FavoriteRecords from "@/features/main/FavoriteRecords"

export const runtime = 'edge'

export default function Home() {
  return (
    <div className="p-0 mx-auto">
      {/* ヒーローセクション */}
      <h1 className="text-4xl font-bold text-center mb-6">IDEA</h1>

      {/* リンク一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-4 mb-12">
        <HomeLink href="/search/power" label="エフェクトアーカイブ" />
        <HomeLink href="/search/item" label="アイテムアーカイブ" />
        <HomeLink href="/search/dlois" label="Dロイスアーカイブ" />
        <HomeLink href="/search/elois" label="Eロイスアーカイブ" />
        <HomeLink href="/search/work" label="ワークスアーカイブ" />
      </div>

      {/* お気に入りレコード */}
      <section>
        <h2 className="headline-text font-bold">お気に入り</h2>
        <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
        <FavoriteRecords />
      </section>
    </div>
  )
}

// サブコンポーネント：リンクカード
function HomeLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="button-light font-bold p-4">
      {label}
    </Link>
  )
}
