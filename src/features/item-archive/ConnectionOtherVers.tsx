import getConnectionById from "@/utils/getConnectionById";
import CategoryCard from "@/components/CategoryCard";
import ConnectionCard from "@/components/ConnectionCard";
import { Connection } from "@/types/types";

export default async function ConnectionOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getConnectionById(id)))).filter((connection) => connection !== null) as Connection[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((connection:Connection) => (
                <ConnectionCard key={connection.id} connection={connection} category/>
            ))}
        </div>
    );
}