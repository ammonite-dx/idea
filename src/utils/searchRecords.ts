import { toArray, toString } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { TypeMap } from '@/types/types';

export default async function searchRecords<K extends keyof TypeMap>(
  kind: K,
  searchParams:{ [key:string]:string|string[] | undefined } 
): Promise<{ [key: string]: TypeMap[K][] } | null> {
  if (kind === "item") {
    switch (toString(searchParams["item-type"], "指定なし")) {
      case "武器": return (await (await fetch(`/api/weapon`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
      case "防具": return (await (await fetch(`/api/armor`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
      case "ヴィークル": return (await (await fetch(`/api/vehicle`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
      case "コネ": return (await (await fetch(`/api/connection`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
      case "一般アイテム": return (await (await fetch(`/api/general`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
      default:
        const weapons = (await (await fetch(`/api/weapon`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
        const armors = (await (await fetch(`/api/armor`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
        const vehicles = (await (await fetch(`/api/vehicle`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
        const connections = (await (await fetch(`/api/connection`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
        const generals = (await (await fetch(`/api/general`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
        const items = Object.fromEntries(toArray(searchParams["category"], ITEM_CATEGORIES).map(category => {
          const weaponsInCategory = weapons[category] || [];
          const armorsInCategory: TypeMap[K][] = armors[category] || [];
          const vehiclesInCategory: TypeMap[K][] = vehicles[category] || [];
          const connectionsInCategory: TypeMap[K][] = connections[category] || [];
          const generalsInCategory: TypeMap[K][] = generals[category] || [];
          const itemsInCategory: TypeMap[K][] = weaponsInCategory.concat(armorsInCategory).concat(vehiclesInCategory).concat(connectionsInCategory).concat(generalsInCategory);
          return [category, itemsInCategory]
        }));
        return items;
    }
  } else {
    return (await (await fetch(`/api/${kind}`,{method:"POST", body:JSON.stringify(searchParams)})).json()) as { [key: string]: TypeMap[K][] };
  }
}