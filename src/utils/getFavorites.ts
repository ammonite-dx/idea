import { prisma } from '@/lib/prisma'
import getRecordById from '@/utils/getRecordById'
import { CardRecordKind } from '@/types/types'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export default async function getFavorites(kind: CardRecordKind) {
  // 1. Cookie から JWT を取り出す
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return []

  let userId: string
  try {
    // 2. JWT を検証して payload.sub から userId を取得
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )
    if (!payload.sub || typeof payload.sub !== 'string') return []
    userId = payload.sub
  } catch {
    // トークンが無効 or 期限切れ
    return []
  }

  // 3. お気に入りレコードを取得
  const searchResults = await prisma.favorite.findMany({
    where: {
      user_id: userId,
      record_kind: kind,
    },
    select: { record_id: true },
  })

  // 4. 各レコードを getRecordById でフェッチし、null を除去して返却
  const favorites = (
    await Promise.all(
      searchResults.map(({ record_id }: { record_id: string }) =>
        getRecordById(kind, record_id)
      )
    )
  ).filter(
    (record): record is NonNullable<typeof record> => record !== null
  )

  return favorites
}