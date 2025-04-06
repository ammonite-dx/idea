import DloisDetailCard from "@/components/DloisDetailCard";
import DloisOtherVers from "@/features/dlois-archive/DloisOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getDloisById from "@/utils/getDloisById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const dlois = await getDloisById(decodeURIComponent(id));

    if (!dlois) {
        return <div>Dlois not found</div>;
    } else {
        return (
            <div>
                <DloisDetailCard dlois={dlois}/>
                {dlois.other_ver_id && <DloisOtherVers other_ver_id={dlois.other_ver_id} />}
                {dlois.rel_power_id && <RelPowers rel_power_id={dlois.rel_power_id} />}
                {(dlois.rel_weapon_id || dlois.rel_armor_id || dlois.rel_vehicle_id || dlois.rel_connection_id || dlois.rel_general_id) && <RelItems rel_weapon_id={dlois.rel_weapon_id||""} rel_armor_id={dlois.rel_armor_id||""} rel_vehicle_id={dlois.rel_vehicle_id||""} rel_connection_id={dlois.rel_connection_id||""} rel_general_id={dlois.rel_general_id||""} />}
                {dlois.rel_dlois_id && <RelDloises rel_dlois_id={dlois.rel_dlois_id} />}
            </div>
        );
    }
}