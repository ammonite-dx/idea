import getEloisById from "@/utils/getEloisById";
import CategoryCard from "@/components/CategoryCard";
import EloisCard from "./EloisCard";
import { Elois } from "@/types/types";

export default async function RelEloises ({ rel_elois_id }: { rel_elois_id: string }) {
    const relEloises = (await Promise.all(rel_elois_id.split(" ").map(async (id) => getEloisById(id)))).filter((elois) => elois !== null) as Elois[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="関連Eロイス" hitNumber={relEloises.length} />
            {relEloises.map((elois:Elois) => (
                <EloisCard key={elois.id} elois={elois} />
            ))}
        </div>
    );
}