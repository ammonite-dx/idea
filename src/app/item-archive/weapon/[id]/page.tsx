import WeaponCard from "@/components/WeaponCard";
import WeaponOtherVers from "@/features/item-archive/WeaponOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getWeaponById from "@/utils/getWeaponById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const weapon = await getWeaponById(decodeURIComponent(id));

    if (!weapon) {
        return <div>Weapon not found</div>;
    } else {
        return (
            <div>
                <WeaponCard weapon={weapon} category details/>
                {weapon.other_ver_id && <WeaponOtherVers other_ver_id={weapon.other_ver_id} />}
                {weapon.rel_power_id && <RelPowers rel_power_id={weapon.rel_power_id} />}
                {(weapon.rel_weapon_id || weapon.rel_armor_id || weapon.rel_vehicle_id || weapon.rel_connection_id || weapon.rel_general_id) && <RelItems rel_weapon_id={weapon.rel_weapon_id||""} rel_armor_id={weapon.rel_armor_id||""} rel_vehicle_id={weapon.rel_vehicle_id||""} rel_connection_id={weapon.rel_connection_id||""} rel_general_id={weapon.rel_general_id||""} />}
                {weapon.rel_dlois_id && <RelDloises rel_dlois_id={weapon.rel_dlois_id} />}
            </div>
        );
    }
}