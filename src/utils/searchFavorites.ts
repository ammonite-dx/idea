import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getWeaponById from './getWeaponById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, armorTypeCondition, armorDodgeCondition, armorInitiativeCondition, armorArmorCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Power, Weapon, Armor, Faq, Info } from '@/types/types';

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
    const armorsInCategory = await Promise.all(searchResultsInCategory.map(async searchResult => {
      const ref_weapon: Weapon|null = searchResult.ref_weapon_id ? await getWeaponById(searchResult.ref_weapon_id) : null;
      const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
      const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
      const armor:Armor = {
        kind: "armor",
        id: searchResult.id,
        supplement: searchResult.supplement,
        category: searchResult.category,
        name: searchResult.name,
        type: searchResult.type,
        dodge: searchResult.dodge,
        initiative: searchResult.initiative,
        armor: searchResult.armor,
        procure: searchResult.procure,
        stock: searchResult.stock,
        exp: searchResult.exp,
        rec: searchResult.rec,
        flavor: searchResult.flavor,
        effect: searchResult.effect,
        price: searchResult.price,
        rec_effect: searchResult.rec_effect,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
        refed_power_id: searchResult.refed_power_id,
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
      return refed_power || armor;
    }));
    return [category, armorsInCategory]
  })));
  return armors;
}