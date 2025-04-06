import searchWeapons from "./searchWeapons";
import searchArmors from "./searchArmors";
import searchVehicles from "./searchVehicles";
import searchConnections from "./searchConnections";
import searchGenerals from "./searchGenerals";
import searchAllItems from "./searchAllItems";
import { Power,Weapon,Armor,Vehicle,Connection,General } from "@/types/types";

export default async function searchItems (currSearchParams: { [key: string]: string | string[] | undefined }) {
    const searchResults: {[key:string]: (Power|Weapon|Armor|Vehicle|Connection|General)[]} = (
        currSearchParams["item-type"]=="武器" ? await searchWeapons(currSearchParams) :
        currSearchParams["item-type"]=="防具" ? await searchArmors(currSearchParams) :
        currSearchParams["item-type"]=="ヴィークル" ? await searchVehicles(currSearchParams) :
        currSearchParams["item-type"]=="コネ" ? await searchConnections(currSearchParams) :
        currSearchParams["item-type"]=="一般アイテム" ? await searchGenerals(currSearchParams) :
        await searchAllItems(currSearchParams)
    );
    return searchResults;
}