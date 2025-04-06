import getWeaponById from "@/utils/getWeaponById";
import getArmorById from "@/utils/getArmorById";
import getVehicleById from "@/utils/getVehicleById";
import getConnectionById from "@/utils/getConnectionById";
import getGeneralById from "@/utils/getGeneralById";
import CategoryCard from "@/components/CategoryCard";
import WeaponCard from "./WeaponCard";
import ArmorCard from "./ArmorCard";
import VehicleCard from "./VehicleCard";
import ConnectionCard from "./ConnectionCard";
import GeneralCard from "./GeneralCard";
import { Weapon, Armor, Vehicle, Connection, General } from "@/types/types";

export default async function RelItems ({ rel_weapon_id, rel_armor_id, rel_vehicle_id, rel_connection_id, rel_general_id }: { rel_weapon_id:string, rel_armor_id:string, rel_vehicle_id:string, rel_connection_id:string, rel_general_id:string }) {
    const relWeapons = (await Promise.all(rel_weapon_id.split(" ").map(async (id) => getWeaponById(id)))).filter((weapon) => weapon !== null) as Weapon[];
    const relArmors = (await Promise.all(rel_armor_id.split(" ").map(async (id) => getArmorById(id)))).filter((armor) => armor !== null) as Armor[];
    const relVehicles = (await Promise.all(rel_vehicle_id.split(" ").map(async (id) => getVehicleById(id)))).filter((vehicle) => vehicle !== null) as Vehicle[];
    const relConnections = (await Promise.all(rel_connection_id.split(" ").map(async (id) => getConnectionById(id)))).filter((connection) => connection !== null) as Connection[];
    const relGenerals = (await Promise.all(rel_general_id.split(" ").map(async (id) => getGeneralById(id)))).filter((general) => general !== null) as General[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="関連アイテム" hitNumber={relWeapons.length+relArmors.length+relVehicles.length+relConnections.length+relGenerals.length} />
            {relWeapons.map((weapon:Weapon) => (
                <WeaponCard key={weapon.id} weapon={weapon} category/>
            ))}
            {relArmors.map((armor:Armor) => (
                <ArmorCard key={armor.id} armor={armor} category/>
            ))}
            {relVehicles.map((vehicle:Vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} category/>
            ))}
            {relConnections.map((connection:Connection) => (
                <ConnectionCard key={connection.id} connection={connection} category/>
            ))}
            {relGenerals.map((general:General) => (
                <GeneralCard key={general.id} general={general} category/>
            ))}
        </div>
    );
}