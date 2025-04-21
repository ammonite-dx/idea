import prisma from "@/lib/prisma";
import { auth } from "@/auth";             // ← getServerSession → auth に置き換え
import getRecordById from "./getRecordById";
import { CardRecordKind } from "@/types/types";

export default async function getFavorites(kind: CardRecordKind) {
  // セッションを取得（v5 のユニバーサル auth() を使用）
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  // お気に入りID取得
  const searchResults = await prisma.favorite.findMany({
    where: {
      user_id:     session.user.id,
      record_kind: kind,
    },
    select: { record_id: true },
  });

  // お気に入りデータ取得
  const favorites = (
    await Promise.all(
      searchResults.map(({ record_id }) =>
        getRecordById(kind, record_id)
      )
    )
  ).filter(
    (record): record is NonNullable<typeof record> => record !== null
  );

  return favorites;
}