import getPowerById from "@/utils/getPowerById";
import CategoryCard from "@/components/CategoryCard";
import PowerCard from "@/components/PowerCard";
import { Power } from "@/types/types";

export default async function PowerOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getPowerById(id)))).filter((power) => power !== null) as Power[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((power:Power) => (
                <PowerCard key={power.id} power={power} category/>
            ))}
        </div>
    );
}