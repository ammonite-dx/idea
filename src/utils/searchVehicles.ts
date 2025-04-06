import prisma from '@/lib/prisma';
import getVehicleById from './getVehicleById';
import { itemSupplementCondition, itemUpdateCondition, itemNameCondition, vehicleSkillCondition, vehicleAtkCondition, vehicleInitiativeCondition, vehicleArmorCondition, vehicleDashCondition, itemCostCondition, itemEffectCondition } from './searchConditions';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Vehicle } from '@/types/types';

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
    const vehiclesInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => getVehicleById(searchResult.id)))).filter((vehicle) => vehicle !== null) as Vehicle[];
    return [category, vehiclesInCategory]
  })));
  return vehicles;
}