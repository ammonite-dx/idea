import findFavorites from "@/utils/findFavorites";
import CategoryCard from "@/components/CategoryCard";
import WeaponCard from "@/components/WeaponCard";
import ArmorCard from "@/components/ArmorCard";
import VehicleCard from "@/components/VehicleCard";
import ConnectionCard from "@/components/ConnectionCard";
import GeneralCard from "@/components/GeneralCard";
import { Weapon, Armor, Vehicle, Connection, General } from "@/types/types";

export default async function FavoriteItems () {
    const favoriteWeapons = await findFavorites({ kind: "weapon" }) as Weapon[];
    const favoriteArmors = await findFavorites({ kind: "armor" }) as Armor[];
    const favoriteVehicles = await findFavorites({ kind: "vehicle" }) as Vehicle[];
    const favoriteConnections = await findFavorites({ kind: "connection" }) as Connection[];
    const favoriteGenerals = await findFavorites({ kind: "general" }) as General[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="お気に入りアイテム" hitNumber={favoriteWeapons.length+favoriteArmors.length+favoriteVehicles.length+favoriteConnections.length+favoriteGenerals.length} />
            {favoriteWeapons.map((weapon:Weapon) => (
                <WeaponCard key={weapon.id} weapon={weapon} category/>
            ))}
            {favoriteArmors.map((armor:Armor) => (
                <ArmorCard key={armor.id} armor={armor} category/>
            ))}
            {favoriteVehicles.map((vehicle:Vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} category/>
            ))}
            {favoriteConnections.map((connection:Connection) => (
                <ConnectionCard key={connection.id} connection={connection} category/>
            ))}
            {favoriteGenerals.map((general:General) => (
                <GeneralCard key={general.id} general={general} category/>
            ))}
        </div>
    );
}