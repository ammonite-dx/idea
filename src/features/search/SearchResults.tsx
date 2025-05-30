"use client";

import { useState, useEffect } from 'react';
import searchRecords from "@/utils/searchRecords";
import CardList from "@/components/CardList";
import { Card, CardDivider } from "@/components/Card";
import { CardRecord, Work, TypeMap } from "@/types/types";
import { Fragment } from "react";
import ScaledText from "@/components/ScaledText";

export default function SearchResults<K extends keyof TypeMap> ({
    kind,
    searchParams,
  }: {
    kind: K,
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const [records, setRecords] = useState<{ [key: string]: TypeMap[K][] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchRecords = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await searchRecords(kind, searchParams);
          setRecords(result);
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.error("searchRecords failed:", e);
          setError(e.message || "データの取得に失敗しました。");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecords();
    }, [kind, JSON.stringify(searchParams)]);

    if (isLoading) {
      return <div className='base-text'>検索中...</div>; // ローディング表示
    }

    if (error) {
      return <div className='base-text'>エラー: {error}</div>; // エラー表示
    }

    if (!records) {
      // records が null (または初期値のまま) の場合、
      // searchRecords がデータを返さなかった（該当なし、またはエラー以外の理由で空）と解釈
      return (
        <section>
          <h2 className="headline-text font-bold">検索結果</h2>
          <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
          <div className="base-text m-4">条件に一致するデータがありません。</div>
        </section>
      );
    }

    // 全カテゴリーのレコードの数をカウントする
    const totalCount = Object.values(records).reduce((sum, items) => sum + items.length, 0);
    return (
      <section>
        <h2 className="headline-text font-bold">検索結果</h2>
        <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
        { (totalCount > 0) && (["power", "item", "dlois", "elois"].includes(kind)) 
          ? <SearchResultsCardList kind={kind} records={records} />
          : (kind==="work") 
          ? <SearchResultsTable kind={kind} records={records} />
          : <div className="base-text m-4">条件に一致するデータがありません。</div>
        }
      </section> 
    );
  }

// エフェクト・Dロイス・Eロイスの検索結果を表示するコンポーネント
function SearchResultsCardList<K extends keyof TypeMap> ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    kind,
    records,
  }: {
    kind: K,
    records: { [key: string]: TypeMap[K][] },
  }) {
    return (
      <div className="mx-0 my-4">
        {Object.keys(records).map((category) => {
          const recordsInCategory = records[category] as TypeMap[K][];
          return (
            <Fragment key={category}>
              {recordsInCategory.length > 0 && (
                <CardList title={category} records={recordsInCategory as CardRecord[]} />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  }

// ワークスの検索結果を表示するコンポーネント
function SearchResultsTable<K extends keyof TypeMap> ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    kind,
    records,
  }: {
    kind: K,
    records: { [key: string]: TypeMap[K][] },
  }) {
    const works = records["ワークス"] as Work[];
    return (
      <Card>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3 text-center base-text font-bold"><ScaledText text="名称"/></div>
          <div className="col-span-2 text-center base-text font-bold"><ScaledText text="能力値"/></div>
          <div className="col-span-7 text-left base-text font-bold"><ScaledText text="技能"/></div>
        </div>
        <CardDivider />
        <div className="grid grid-cols-12 gap-2">
          {works.map((work) => (
            <Fragment key={work.id}>
              <div className="col-span-3 text-center base-text"><ScaledText text={work.name}/></div>
              <div className="col-span-2 text-center base-text"><ScaledText text={work.stat}/></div>
              <div className="col-span-7 text-left base-text"><ScaledText text={work.skills}/></div>
            </Fragment>
          ))}
        </div>
      </Card>
    );
  }
