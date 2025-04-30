import getFavorites from "@/utils/getFavorites";

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
            {favPowers.length>0 && favPowers.map((power) => (<div key={power.id}>{power.record_id}</div>))}
            {favItems.length>0 && favItems.map((item) => (<div key={item.id}>{item.record_id}</div>))}
            {favDloises.length>0 && favDloises.map((dlois) => (<div key={dlois.id}>{dlois.record_id}</div>))}
            {favEloises.length>0 && favEloises.map((elois) => (<div key={elois.id}>{elois.record_id}</div>))}
        </div>
    );
}