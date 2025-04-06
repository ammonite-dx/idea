import searchWeapons from './searchWeapons';
import searchArmors from './searchArmors';
import searchVehicles from './searchVehicles';
import searchConnections from './searchConnections';
import searchGenerals from './searchGenerals';
import { toArray } from '@/utils/utils';
import { ITEM_CATEGORIES } from '@/consts/item';
import { Power, Weapon, Armor, Vehicle, Connection, General } from '@/types/types';

export default async function searchAllItems(currSearchParams: { [key: string]: string | string[] | undefined }) {
    const weapons = await searchWeapons(currSearchParams);
    const armors = await searchArmors(currSearchParams);
    const vehicles = await searchVehicles(currSearchParams);
    const connections = await searchConnections(currSearchParams);
    const generals = await searchGenerals(currSearchParams);
    const items = Object.fromEntries(toArray(currSearchParams["category"], ITEM_CATEGORIES).map(category => {
        const weaponsInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = weapons[category] || [];
        const armorsInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = armors[category] || [];
        const vehiclesInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = vehicles[category] || [];
        const connectionsInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = connections[category] || [];
        const generalsInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = generals[category] || [];
        const itemsInCategory: (Power|Weapon|Armor|Vehicle|Connection|General)[] = weaponsInCategory.concat(armorsInCategory).concat(vehiclesInCategory).concat(connectionsInCategory).concat(generalsInCategory);
        return [category, itemsInCategory]
    }));
    return items;
}