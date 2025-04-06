import getDloisById from "@/utils/getDloisById";
import CategoryCard from "@/components/CategoryCard";
import DloisSummaryCard from "./DloisSummaryCard";
import { Dlois } from "@/types/types";

export default async function RelDloises ({ rel_dlois_id }: { rel_dlois_id: string }) {
    const relDloises = (await Promise.all(rel_dlois_id.split(" ").map(async (id) => getDloisById(id)))).filter((dlois) => dlois !== null) as Dlois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="関連Dロイス" hitNumber={relDloises.length} />
            {relDloises.map((dlois:Dlois) => (
                <DloisSummaryCard key={dlois.id} dlois={dlois} />
            ))}
        </div>
    );
}