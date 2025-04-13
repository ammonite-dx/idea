import searchRecords from "@/utils/searchRecords";
import CardList from "@/components/CardList";
import { Dlois } from "@/types/types";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const dloises: { [key: string]: Dlois[] } | null = await searchRecords("dlois", searchParams);
    if (!dloises) return <div className="m-4">Error: DloisSearchResultsで、Dロイスの検索結果がnullでした。</div>;

    return (
      <div className="m-4">
        <CardList title="検索結果" records={dloises["Dロイス"]}/>
      </div>
    );
  }