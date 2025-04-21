import prisma from "@/lib/prisma";
import { auth } from "@/auth";           // ← getToken ではなく auth() を使う
import getRecordById from "./getRecordById";
import { CardRecordKind } from "@/types/types";

export default async function getFavorites(kind: CardRecordKind) {
  // Server Component／ユーティリティからは auth() だけで OK
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const searchResults = await prisma.favorite.findMany({
    where: {
      user_id:     session.user.id,
      record_kind: kind,
    },
    select: { record_id: true },
  });

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