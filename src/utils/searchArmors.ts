import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getArmorById from './getArmorById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, armorTypeCondition, armorDodgeCondition, armorInitiativeCondition, armorArmorCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Power, Armor } from '@/types/types';

export default async function searchArmors(currSearchParams: { [key: string]: string | string[] | undefined }) {
  
// 検索条件に合致する防具を取得
  const armors: {[key:string] : (Armor|Power)[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(async category => {
    
    // 検索を実行
    const searchResultsInCategory = await prisma.armor.findMany({
      where: {
        AND: [
          {category: category},
          itemNameCondition(currSearchParams),
          itemUpdateCondition(currSearchParams),
          itemSupplementCondition(currSearchParams),
          armorTypeCondition(currSearchParams),
          armorDodgeCondition(currSearchParams),
          armorInitiativeCondition(currSearchParams),
          armorArmorCondition(currSearchParams),
          itemCostCondition(currSearchParams),
          itemEffectCondition(currSearchParams)
        ]
      },
      orderBy: [
        {type_order: "asc"},
        {cost_order: "asc"},
        {ruby: "asc"}
      ],
    });

    // 検索結果を整形
    const armorsInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => {
      const armor = await getArmorById(searchResult.id);
      const refed_power: Power|null = (armor && armor.refed_power_id) ? await getPowerById(armor.refed_power_id) : null;
      return refed_power || armor;
    }))).filter((armor) => armor !== null) as (Armor|Power)[];
    return [category, armorsInCategory]
  })));
  return armors;
}