import prisma from '@/lib/prisma';
import getGeneralById from './getGeneralById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, generalTypeCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { General } from '@/types/types';

export default async function searchGenerals(currSearchParams: { [key: string]: string | string[] | undefined }) {

  // 検索条件に合致する一般アイテムを取得
  const generals: {[key: string]: General[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(async category => {

    // 検索を実行
    const searchResultsInCategory = await prisma.general.findMany({
      where: {
        AND: [
          {category: category},
          itemSupplementCondition(currSearchParams),
          itemUpdateCondition(currSearchParams),
          itemNameCondition(currSearchParams),
          generalTypeCondition(currSearchParams),
          itemCostCondition(currSearchParams),
          itemEffectCondition(currSearchParams),
        ]
      },
      orderBy: [
        {type_order: "asc"},
        {cost_order: "asc"},
        {ruby: "asc"}
      ],
    });
    const generalsInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => getGeneralById(searchResult.id)))).filter((general) => general !== null) as General[];
    return [category, generalsInCategory]
  })));
  return generals;
}