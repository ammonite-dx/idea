import getGeneralById from "@/utils/getGeneralById";
import CategoryCard from "@/components/CategoryCard";
import GeneralCard from "@/components/GeneralCard";
import { General } from "@/types/types";

export default async function GeneralOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getGeneralById(id)))).filter((general) => general !== null) as General[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((general:General) => (
                <GeneralCard key={general.id} general={general} category/>
            ))}
        </div>
    );
}