import findFavorites from "@/utils/findFavorites";
import CategoryCard from "@/components/CategoryCard";
import DloisSummaryCard from "@/components/DloisSummaryCard";
import { Dlois } from "@/types/types";

export default async function FavoriteDloises () {
    const favoriteDloiss = await findFavorites({ kind: "dlois" }) as Dlois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="お気に入りDロイス" hitNumber={favoriteDloiss.length} />
            {favoriteDloiss.map((dlois:Dlois) => (
                <DloisSummaryCard key={dlois.id} dlois={dlois}/>
            ))}
        </div>
    );
}