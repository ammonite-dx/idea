import GeneralCard from "@/components/GeneralCard";
import GeneralOtherVers from "@/features/item-archive/GeneralOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getGeneralById from "@/utils/getGeneralById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const general = await getGeneralById(decodeURIComponent(id));

    if (!general) {
        return <div>General not found</div>;
    } else {
        return (
            <div>
                <GeneralCard general={general} category details/>
                {general.other_ver_id && <GeneralOtherVers other_ver_id={general.other_ver_id} />}
                {general.rel_power_id && <RelPowers rel_power_id={general.rel_power_id} />}
                {(general.rel_weapon_id || general.rel_armor_id || general.rel_vehicle_id || general.rel_connection_id || general.rel_general_id) && <RelItems rel_weapon_id={general.rel_weapon_id||""} rel_armor_id={general.rel_armor_id||""} rel_vehicle_id={general.rel_vehicle_id||""} rel_connection_id={general.rel_connection_id||""} rel_general_id={general.rel_general_id||""} />}
                {general.rel_dlois_id && <RelDloises rel_dlois_id={general.rel_dlois_id} />}
            </div>
        );
    }
}