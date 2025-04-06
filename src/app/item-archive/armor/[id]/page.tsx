import ArmorCard from "@/components/ArmorCard";
import ArmorOtherVers from "@/features/item-archive/ArmorOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getArmorById from "@/utils/getArmorById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const armor = await getArmorById(decodeURIComponent(id));

    if (!armor) {
        return <div>Armor not found</div>;
    } else {
        return (
            <div>
                <ArmorCard armor={armor} category details/>
                {armor.other_ver_id && <ArmorOtherVers other_ver_id={armor.other_ver_id} />}
                {armor.rel_power_id && <RelPowers rel_power_id={armor.rel_power_id} />}
                {(armor.rel_weapon_id || armor.rel_armor_id || armor.rel_vehicle_id || armor.rel_connection_id || armor.rel_general_id) && <RelItems rel_weapon_id={armor.rel_weapon_id||""} rel_armor_id={armor.rel_armor_id||""} rel_vehicle_id={armor.rel_vehicle_id||""} rel_connection_id={armor.rel_connection_id||""} rel_general_id={armor.rel_general_id||""} />}
                {armor.rel_dlois_id && <RelDloises rel_dlois_id={armor.rel_dlois_id} />}
            </div>
        );
    }
}