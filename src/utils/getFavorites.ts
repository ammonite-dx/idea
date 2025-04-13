import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getRecordById from './getRecordById';
import { PrimaryKind } from '@/types/types';

export default async function getFavorites( kind: PrimaryKind ) {
  
  // セッションを取得
  const session = await getServerSession(authOptions);
  if (!session) return [];
  if (!session.user.id) return [];
    
  // お気に入りID取得
  const searchResults = await prisma.favorite.findMany({
    where: {
      user_id: session.user.id,
      record_kind: kind,
    },
    select: { record_id: true },
  });

  // お気に入りデータ取得
  const favorites = (await Promise.all(
    searchResults.map(async searchResult =>
      getRecordById(kind, searchResult.record_id)
    )
  )).filter((record): record is NonNullable<typeof record> => record !== null) 

  return favorites;
}