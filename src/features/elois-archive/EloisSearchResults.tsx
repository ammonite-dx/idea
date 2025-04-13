import searchRecords from "@/utils/searchRecords";
import CardList from "@/components/CardList";
import { Elois } from "@/types/types";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const eloises: { [key: string]: Elois[] } | null = await searchRecords("elois", searchParams);
    if (!eloises) return <div className="m-4">Error: EloisSearchResultsで、Eロイスの検索結果がnullでした。</div>;

    return (
      <div className="m-4">
        <CardList title="検索結果" records={eloises["Eロイス"]}/>
      </div>
    );
  }