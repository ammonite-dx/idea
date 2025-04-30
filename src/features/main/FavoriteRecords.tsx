import getFavorites from "@/utils/getFavorites";
import CardList from "@/components/CardList";
import { Item } from "@/types/types";

export default async function FavoriteRecords() {
    const favPowers = await getFavorites("power");
    const favWeapons = await getFavorites("weapon") as Item[];
    const favArmors = await getFavorites("armor") as Item[];
    const favVehicles = await getFavorites("vehicle") as Item[];
    const favConnections = await getFavorites("connection") as Item[];
    const favGenerals = await getFavorites("general") as Item[];
    const favItems = favWeapons.concat(favArmors, favVehicles, favConnections, favGenerals);
    const favDloises = await getFavorites("dlois");
    const favEloises = await getFavorites("elois");
    return (
        <div>
            {favPowers.length>0 && <CardList title="お気に入りエフェクト" records={favPowers} category />}
            {favItems.length>0 && <CardList title="お気に入りアイテム" records={favItems} category />}
            {favDloises.length>0 && <CardList title="お気に入りDロイス" records={favDloises} category />}
            {favEloises.length>0 && <CardList title="お気に入りEロイス" records={favEloises} category />}
        </div>
    );
}