import searchRecords from "@/utils/searchRecords";
import CardList from "@/components/CardList";
import { Fragment } from "react";
import { Item } from "@/types/types";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const items: { [key: string]: Item[] } | null = await searchRecords("item", searchParams);
    if (!items) return <div className="m-4">Error: ItemSearchResultsで、アイテムの検索結果がnullでした。</div>;

    return (
      <div className="m-4">
        {Object.keys(items).map((category) => (
          <Fragment key={category}>
            {items[category].length > 0 && (
              <CardList title={category} records={items[category]} />
            )}
          </Fragment>
        ))}
      </div>
    );
  }