import findFavorites from "@/utils/findFavorites";
import CategoryCard from "@/components/CategoryCard";
import EloisCard from "@/components/EloisCard";
import { Elois } from "@/types/types";

export default async function FavoriteEloises () {
    const favoriteEloiss = await findFavorites({ kind: "elois" }) as Elois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="お気に入りEロイス" hitNumber={favoriteEloiss.length} />
            {favoriteEloiss.map((elois:Elois) => (
                <EloisCard key={elois.id} elois={elois}/>
            ))}
        </div>
    );
}