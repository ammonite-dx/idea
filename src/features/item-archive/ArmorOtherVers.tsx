import getArmorById from "@/utils/getArmorById";
import CategoryCard from "@/components/CategoryCard";
import ArmorCard from "@/components/ArmorCard";
import { Armor } from "@/types/types";

export default async function ArmorOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getArmorById(id)))).filter((armor) => armor !== null) as Armor[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((armor:Armor) => (
                <ArmorCard key={armor.id} armor={armor} category/>
            ))}
        </div>
    );
}