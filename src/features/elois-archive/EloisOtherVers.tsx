import getEloisById from "@/utils/getEloisById";
import CategoryCard from "@/components/CategoryCard";
import EloisCard from "@/components/EloisCard";
import { Elois } from "@/types/types";

export default async function EloisOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getEloisById(id)))).filter((elois) => elois !== null) as Elois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((elois:Elois) => (
                <EloisCard key={elois.id} elois={elois}/>
            ))}
        </div>
    );
}