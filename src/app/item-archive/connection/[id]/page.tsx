import ConnectionCard from "@/components/ConnectionCard";
import ConnectionOtherVers from "@/features/item-archive/ConnectionOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getConnectionById from "@/utils/getConnectionById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const connection = await getConnectionById(decodeURIComponent(id));

    if (!connection) {
        return <div>Connection not found</div>;
    } else {
        return (
            <div>
                <ConnectionCard connection={connection} category details/>
                {connection.other_ver_id && <ConnectionOtherVers other_ver_id={connection.other_ver_id} />}
                {connection.rel_power_id && <RelPowers rel_power_id={connection.rel_power_id} />}
                {(connection.rel_weapon_id || connection.rel_armor_id || connection.rel_vehicle_id || connection.rel_connection_id || connection.rel_general_id) && <RelItems rel_weapon_id={connection.rel_weapon_id||""} rel_armor_id={connection.rel_armor_id||""} rel_vehicle_id={connection.rel_vehicle_id||""} rel_connection_id={connection.rel_connection_id||""} rel_general_id={connection.rel_general_id||""} />}
                {connection.rel_dlois_id && <RelDloises rel_dlois_id={connection.rel_dlois_id} />}
            </div>
        );
    }
}