import prisma from '@/lib/prisma';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, vehicleSkillCondition, vehicleAtkCondition, vehicleInitiativeCondition, vehicleArmorCondition, vehicleDashCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Vehicle, Faq, Info } from '@/types/types';

export default async function searchVehicles(currSearchParams: { [key: string]: string | string[] | undefined }) {

  // 検索条件に合致するヴィークルを取得
  const vehicles: {[key:string]: Vehicle[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(async category => {
    
    // 検索を実行
    const searchResultsInCategory = await prisma.vehicle.findMany({
      where: {
        AND: [
          {category: category},
          itemNameCondition(currSearchParams),
          itemUpdateCondition(currSearchParams),
          itemSupplementCondition(currSearchParams),
          vehicleSkillCondition(currSearchParams),
          vehicleAtkCondition(currSearchParams),
          vehicleInitiativeCondition(currSearchParams),
          vehicleArmorCondition(currSearchParams),
          vehicleDashCondition(currSearchParams),
          itemCostCondition(currSearchParams),
          itemEffectCondition(currSearchParams)
        ]
      },
      orderBy: [
        {cost_order: "asc"},
        {ruby: "asc"}
      ]
    });
    const vehiclesInCategory = await Promise.all(searchResultsInCategory.map(async searchResult => {
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
      const vehicle:Vehicle = {
        kind: "vehicle",
        id: searchResult.id,
        supplement: searchResult.supplement,
        category: searchResult.category,
        name: searchResult.name,
        type: searchResult.type,
        skill: searchResult.skill,
        atk: searchResult.atk,
        initiative: searchResult.initiative,
        armor: searchResult.armor,
        dash: searchResult.dash,
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
        other_ver_id: searchResult.other_ver_id,
        rel_power_id: searchResult.rel_power_id,
        rel_weapon_id: searchResult.rel_weapon_id,
        rel_armor_id: searchResult.rel_armor_id,
        rel_vehicle_id: searchResult.rel_vehicle_id,
        rel_connection_id: searchResult.rel_connection_id,
        rel_general_id: searchResult.rel_general_id,
        rel_dlois_id: searchResult.rel_dlois_id,
      };
      return vehicle;
    }));
    return [category, vehiclesInCategory]
  })));
  return vehicles;
}