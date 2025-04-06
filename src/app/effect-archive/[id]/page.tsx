import PowerCard from "@/components/PowerCard";
import PowerOtherVers from "@/features/effect-archive/PowerOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getPowerById from "@/utils/getPowerById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const power = await getPowerById(decodeURIComponent(id));

    if (!power) {
        return <div>Power not found</div>;
    } else {
        return (
            <div>
                <PowerCard power={power} category details/>
                {power.other_ver_id && <PowerOtherVers other_ver_id={power.other_ver_id} />}
                {power.rel_power_id && <RelPowers rel_power_id={power.rel_power_id} />}
                {(power.rel_weapon_id || power.rel_armor_id || power.rel_vehicle_id || power.rel_connection_id || power.rel_general_id) && <RelItems rel_weapon_id={power.rel_weapon_id||""} rel_armor_id={power.rel_armor_id||""} rel_vehicle_id={power.rel_vehicle_id||""} rel_connection_id={power.rel_connection_id||""} rel_general_id={power.rel_general_id||""} />}
                {power.rel_dlois_id && <RelDloises rel_dlois_id={power.rel_dlois_id} />}
            </div>
        );
    }
}