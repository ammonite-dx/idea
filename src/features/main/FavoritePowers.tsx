import findFavorites from "@/utils/findFavorites";
import CategoryCard from "@/components/CategoryCard";
import PowerCard from "@/components/PowerCard";
import { Power } from "@/types/types";

export default async function FavoritePowers () {
    const favoritePowers = await findFavorites({ kind: "power" }) as Power[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="お気に入りエフェクト" hitNumber={favoritePowers.length} />
            {favoritePowers.map((power:Power) => (
                <PowerCard key={power.id} power={power} category/>
            ))}
        </div>
    );
}