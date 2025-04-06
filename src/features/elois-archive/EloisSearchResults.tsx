import searchEloises from "@/utils/searchEloises";
import EloisCard from "@/components/EloisCard";
import { Elois } from "@/types/types";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const eloises: Elois[] = await searchEloises(searchParams);

    return (
        <div className="m-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {eloises.map((elois:Elois) => (
                    <EloisCard key={elois.id} elois={elois} />
                ))}
            </div>
        </div>
    );
  }