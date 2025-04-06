import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getArmorById from './getArmorById';
import getGeneralById from './getGeneralById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, weaponTypeCondition, weaponSkillCondition, weaponAccCondition, weaponAtkCondition, weaponGuardCondition, weaponRngCondition, itemCostCondition, itemEffectCondition, weaponRefedArmorCondition, weaponRefedGeneralCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Power, Weapon, Armor, General, Faq, Info } from '@/types/types';

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
    const weaponsInCategory = await Promise.all(searchResultsInCategory.map(async searchResult => {
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
      const weapon:Weapon = {
        kind: "weapon",
        id: searchResult.id,
        supplement: searchResult.supplement,
        category: searchResult.category,
        name: searchResult.name,
        type: searchResult.type,
        skill: searchResult.skill,
        acc: searchResult.acc,
        atk: searchResult.atk,
        guard: searchResult.guard,
        rng: searchResult.rng,
        procure: searchResult.procure,
        stock: searchResult.stock,
        exp: searchResult.exp,
        rec: searchResult.rec,
        flavor: searchResult.flavor,
        effect: searchResult.effect,
        price: searchResult.price,
        rec_effect: searchResult.rec_effect,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
        refed_power_id: searchResult.refed_power_id,
        refed_armor_id: searchResult.refed_armor_id,
        refed_general_id: searchResult.refed_general_id,
        other_ver_id: searchResult.other_ver_id,
        rel_power_id: searchResult.rel_power_id,
        rel_weapon_id: searchResult.rel_weapon_id,
        rel_armor_id: searchResult.rel_armor_id,
        rel_vehicle_id: searchResult.rel_vehicle_id,
        rel_connection_id: searchResult.rel_connection_id,
        rel_general_id: searchResult.rel_general_id,
        rel_dlois_id: searchResult.rel_dlois_id,
      };
      const refed_power: Power|null = searchResult.refed_power_id ? await getPowerById(searchResult.refed_power_id) : null;
      const refed_armor: Armor|null = searchResult.refed_armor_id ? await getArmorById(searchResult.refed_armor_id) : null;
      const refed_general: General|null = searchResult.refed_general_id ? await getGeneralById(searchResult.refed_general_id) : null;
      return refed_power || refed_armor || refed_general || weapon;
    }));
    return [category, weaponsInCategory]
  })));
  return weapons;
}