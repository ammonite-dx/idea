import getFavorites from "@/utils/getFavorites";
import CardList from "@/components/CardList";

export default async function FavoriteRecords() {
    const favPowers = await getFavorites("power");
    const favWeapons = await getFavorites("weapon");
    const favArmors = await getFavorites("armor");
    const favVehicles = await getFavorites("vehicle");
    const favConnections = await getFavorites("connection");
    const favGenerals = await getFavorites("general");
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