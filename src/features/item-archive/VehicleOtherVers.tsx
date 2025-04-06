import getVehicleById from "@/utils/getVehicleById";
import CategoryCard from "@/components/CategoryCard";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/types";

export default async function VehicleOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getVehicleById(id)))).filter((vehicle) => vehicle !== null) as Vehicle[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((vehicle:Vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} category/>
            ))}
        </div>
    );
}