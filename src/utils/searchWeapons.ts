import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getWeaponById from './getWeaponById';
import getArmorById from './getArmorById';
import getGeneralById from './getGeneralById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, weaponTypeCondition, weaponSkillCondition, weaponAccCondition, weaponAtkCondition, weaponGuardCondition, weaponRngCondition, itemCostCondition, itemEffectCondition, weaponRefedArmorCondition, weaponRefedGeneralCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Power, Weapon, Armor, General } from '@/types/types';

export default async function searchWeapons(currSearchParams: { [key: string]: string | string[] | undefined }) {
  
  // 検索条件に合致する武器を取得
  const weapons: {[key: string]: (Weapon|Power|Armor|General)[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(async category => {

    // 検索を実行
    const searchResultsInCategory = await prisma.weapon.findMany({
      where: {
        AND: [
          {category: category},
          itemSupplementCondition(currSearchParams),
          itemUpdateCondition(currSearchParams),
          itemNameCondition(currSearchParams),
          weaponTypeCondition(currSearchParams),
          weaponSkillCondition(currSearchParams),
          weaponAccCondition(currSearchParams),
          weaponAtkCondition(currSearchParams),
          weaponGuardCondition(currSearchParams),
          weaponRngCondition(currSearchParams),
          itemCostCondition(currSearchParams),
          itemEffectCondition(currSearchParams),
          weaponRefedArmorCondition(currSearchParams),
          weaponRefedGeneralCondition(currSearchParams),
        ]
      },
      orderBy: [
        {type_order: "asc"},
        {cost_order: "asc"},
        {ruby: "asc"}
      ],
    });

    // 検索結果を整形
    const weaponsInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => {
      const weapon: Weapon|null = await getWeaponById(searchResult.id);
      const refed_power: Power|null = (weapon && weapon.refed_power_id) ? await getPowerById(weapon.refed_power_id) : null;
      const refed_armor: Armor|null = (weapon && weapon.refed_armor_id) ? await getArmorById(weapon.refed_armor_id) : null;
      const refed_general: General|null = (weapon && weapon.refed_general_id) ? await getGeneralById(weapon.refed_general_id) : null;
      return refed_power || refed_armor || refed_general || weapon;
    }))).filter((weapon) => weapon !== null) as (Weapon|Power|Armor|General)[];
    return [category, weaponsInCategory]
  })));
  return weapons;
}