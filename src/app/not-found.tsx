export const runtime = 'edge'

export default function NotFound() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">ページが見つかりません</h1>
      <p>お探しのページは存在しないか、削除された可能性があります。</p>
    </main>
  )
}