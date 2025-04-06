import getDloisById from "@/utils/getDloisById";
import CategoryCard from "@/components/CategoryCard";
import DloisSummaryCard from "@/components/DloisSummaryCard";
import { Dlois } from "@/types/types";

export default async function DloisOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getDloisById(id)))).filter((dlois) => dlois !== null) as Dlois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((dlois:Dlois) => (
                <DloisSummaryCard key={dlois.id} dlois={dlois}/>
            ))}
        </div>
    );
}