import searchRecords from "@/utils/searchRecords";
import CardList from "@/components/CardList";
import { Power } from "@/types/types";
import { Fragment } from "react";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const powers: { [key: string]: Power[] } | null = await searchRecords("power", searchParams);
    if (!powers) return <div className="m-4">Error: PowerSearchResultsで、エフェクトの検索結果がnullでした。</div>;

    return (
      <div className="m-4">
        {Object.keys(powers).map((category) => (
          <Fragment key={category}>
            {powers[category].length > 0 && (
              <CardList title={category} records={powers[category]} />
            )}
          </Fragment>
        ))}
      </div>
    );
  }