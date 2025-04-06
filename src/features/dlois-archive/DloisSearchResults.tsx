import searchDloises from "@/utils/searchDloises";
import DloisSummaryCard from "@/components/DloisSummaryCard";
import { Dlois } from "@/types/types";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const dloises: Dlois[] = await searchDloises(searchParams);

    return (
        <div className="m-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {dloises.map((dlois:Dlois) => (
                    <DloisSummaryCard key={dlois.id} dlois={dlois} />
                ))}
            </div>
        </div>
    );
  }