import prisma from '@/lib/prisma';
import getConnectionById from './getConnectionById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, connectionSkillCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Connection } from '@/types/types';

export default async function searchConnections(currSearchParams: { [key: string]: string | string[] | undefined }) {

  // 検索条件に合致するコネを取得
  const connections: {[key:string]: Connection[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(async category => {

    // 検索を実行
    const searchResultsInCategory = await prisma.connection.findMany({
      where: {
        AND: [
          {category: category},
          itemSupplementCondition(currSearchParams),
          itemUpdateCondition(currSearchParams),
          itemNameCondition(currSearchParams),
          connectionSkillCondition(currSearchParams),
          itemCostCondition(currSearchParams),
          itemEffectCondition(currSearchParams),
        ]
      },
      orderBy: [
        {cost_order: "asc"},
        {ruby: "asc"}
      ],
    });
    const connectionsInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => getConnectionById(searchResult.id)))).filter((connection) => connection !== null) as Connection[];
    return [category, connectionsInCategory]
  })));
  return connections;
}