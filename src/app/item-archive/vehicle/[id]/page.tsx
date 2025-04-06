import VehicleCard from "@/components/VehicleCard";
import VehicleOtherVers from "@/features/item-archive/VehicleOtherVers";
import RelPowers from "@/components/RelPowers";
import RelItems from "@/components/RelItems";
import RelDloises from "@/components/RelDloises";
import getVehicleById from "@/utils/getVehicleById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const vehicle = await getVehicleById(decodeURIComponent(id));

    if (!vehicle) {
        return <div>Vehicle not found</div>;
    } else {
        return (
            <div>
                <VehicleCard vehicle={vehicle} category details/>
                {vehicle.other_ver_id && <VehicleOtherVers other_ver_id={vehicle.other_ver_id} />}
                {vehicle.rel_power_id && <RelPowers rel_power_id={vehicle.rel_power_id} />}
                {(vehicle.rel_weapon_id || vehicle.rel_armor_id || vehicle.rel_vehicle_id || vehicle.rel_connection_id || vehicle.rel_general_id) && <RelItems rel_weapon_id={vehicle.rel_weapon_id||""} rel_armor_id={vehicle.rel_armor_id||""} rel_vehicle_id={vehicle.rel_vehicle_id||""} rel_connection_id={vehicle.rel_connection_id||""} rel_general_id={vehicle.rel_general_id||""} />}
                {vehicle.rel_dlois_id && <RelDloises rel_dlois_id={vehicle.rel_dlois_id} />}
            </div>
        );
    }
}