"use client";

import { useState, useEffect, useCallback, Fragment, useMemo, useRef, useLayoutEffect } from 'react';
import CardList from "@/components/CardList";
import { Card, CardDivider } from "@/components/Card";
import TableOfContents from './TableOfContents';
import { TypeMap, TableRecord } from "@/types/types";
import type { Category, PageDefinition } from "@/types/pagination";
import ScaledText from "@/components/ScaledText";
import PaginationUI from './PaginationUI';

const CARD_KINDS = ["power", "item", "dlois", "elois"];
const TABLE_KINDS = ["work"];

export default function SearchResults<K extends keyof TypeMap> ({
    kind,
    searchParams,
  }: {
    kind: K,
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const isCardListKind = CARD_KINDS.includes(kind as string);
    const isTableKind = TABLE_KINDS.includes(kind as string);

    // --- State定義 ---
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageDefinitions, setPageDefinitions] = useState<PageDefinition[]>([]);
    const [categoriesForCurrentPage, setCategoriesForCurrentPage] = useState<Category[]>([]);
    const [scrollToCategoryId, setScrollToCategoryId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tableRecords, setTableRecords] = useState<TableRecord[]>([]);

    // ★重要: データ取得の準備完了フラグ
    const [isPaginationReady, setIsPaginationReady] = useState(false);

    // --- パラメータ制御 ---
    const params = useMemo(() => {
      const p = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => p.append(key, v));
        } else if (typeof value === 'string' && value !== "") {
          p.append(key, value);
        }
      });
      return p;
    }, [searchParams]);

    // ★重要: パラメータをRefに保持（useEffectの発火抑制用）
    const paramsRef = useRef(params);
    // レンダリングのたびに最新値をセットする（副作用なし）
    paramsRef.current = params;


    // --- データ取得関数 ---

    // 1. 総ページ数などのメタ情報を取得
    const fetchPaginationInfo = useCallback(async () => {
      setError(null);
      try {
        const response = await fetch(`/api/search/${kind}?action=getInfo&${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch pagination info');
        const data = await response.json();

        const newTotalPages = data.totalPages || 0;
        setTotalPages(newTotalPages);
        setPageDefinitions(data.pageDefinitions || []);
        
        // ★重要: ページがある場合のみ「準備完了」としてバトンを渡す
        if (newTotalPages > 0) {
            setIsPaginationReady(true);
            // ここではまだ isLoading(false) にしない！ (次のデータ取得が終わるまで待つ)
        } else {
            // 0件の場合はここで終了
            setIsPaginationReady(false); 
            setIsLoading(false);
        }

      } catch (e: any) {
        console.error("fetchPaginationInfo failed:", e);
        setError(e.message || "ページ情報の取得に失敗しました。");
        setTotalPages(0);
        setIsPaginationReady(false);
        setIsLoading(false);
      }
    }, [kind, params]);


    // 2. 特定ページのデータ本体を取得
    const fetchPageData = useCallback(async (page: number) => {
      // ★重要: paramsの代わりにRefを使うことで、この関数自体の再生成を防ぐ
      const currentParams = paramsRef.current;
      
      const def = pageDefinitions.find(def => String(def.page) === String(page));
      const categories = def?.categories || [];
      
      // ガード: 定義がない場合は何もしない（エラー表示もしない）
      if (categories.length === 0) return;

      setIsLoading(true); // ページ切り替え時用
      setError(null);
      
      const paramsForPage = new URLSearchParams(currentParams.toString());
      for (const category of categories) paramsForPage.append('category', category.name);
      
      try {
        const response = await fetch(`/api/search/${kind}?action=getPage&${paramsForPage.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch page data');
        const data = await response.json();
        
        setCategoriesForCurrentPage(data.dataForPage || []);
        
      } catch (e: any) {
        console.error("fetchPageData failed:", e);
        setError(e.message || "ページデータの取得に失敗しました。");
        setCategoriesForCurrentPage([]);
      } finally {
        // ★重要: ここで初めてローディングを解除
        setIsLoading(false);
      }
    // ★重要: 依存配列にparamsを含めない（Refを使うため）
    }, [kind, pageDefinitions]); 


    // 3. テーブル形式のデータ取得
    const fetchTableRecords = useCallback(async () => {
      setError(null);
      try {
        const response = await fetch(`/api/search/${kind}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch table records');
        const records: TableRecord[] = (await response.json()).records;
        setTableRecords(records || []);
      } catch (e: any) {
        console.error("fetchTableRecords failed:", e);
        setError(e.message || "データの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    }, [kind, params]);


    // --- Effect ---

    // A. 初期ロード・検索条件変更時のリセットと開始
    useEffect(() => {
      // 1. まず全状態をリセット
      setIsPaginationReady(false); // ★ゲートを閉じる
      setTotalPages(0);
      setPageDefinitions([]);
      setCategoriesForCurrentPage([]);
      setTableRecords([]);
      setActivePage(1);
      setError(null);
      setIsLoading(true); // ★ローディング開始

      // 2. 種類に応じて取得開始
      if (isCardListKind) {
        fetchPaginationInfo();
      } else if (isTableKind) {
        fetchTableRecords();
      } else {
        setIsLoading(false);
      }
    }, [kind, params, fetchPaginationInfo, fetchTableRecords, isCardListKind, isTableKind]);


    // B. データ取得（ゲートが開いている時のみ実行）
    useEffect(() => {
      // ★シンプルで強固な条件: 「準備完了」かつ「ページ指定あり」のみ通す
      if (isCardListKind && isPaginationReady && activePage > 0) {
        fetchPageData(activePage);
      }
    }, [
      activePage, 
      isPaginationReady, // ★ここがトリガーの核心
      fetchPageData, 
      isCardListKind
    ]);


    // --- その他の処理 (スクロール等) ---
    useLayoutEffect(() => {
        if (scrollToCategoryId && categoriesForCurrentPage.length > 0) {
            const targetId = `category-anchor-${scrollToCategoryId}`;
            const element = document.getElementById(targetId);
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                setScrollToCategoryId(null);
            }
        }
    }, [categoriesForCurrentPage, scrollToCategoryId]);

    const handleNavigate = useCallback((pageNumber: number, categoryIdToScroll: string | null = null) => {
        setScrollToCategoryId(categoryIdToScroll);
        if (pageNumber !== activePage) {
            setActivePage(pageNumber);
        } else {
            if (categoryIdToScroll) {
                const element = document.getElementById(`category-anchor-${categoryIdToScroll}`);
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        }
    }, [activePage]);


    // --- レンダリング ---
    
    // 全体のローディング表示 (初回のみ)
    if (isLoading && totalPages === 0 && tableRecords.length === 0) {
       return <div className='base-text'>検索中...</div>;
    }
    
    if (error) {
      return <div className='base-text'>エラー: {error}</div>;
    }

    if (isCardListKind) {
      // 0件かつローディング完了時
      if (totalPages === 0 && !isLoading) {
        return (
          <section>
            <h2 className="headline-text font-bold">検索結果</h2>
            <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
            <div className="base-text m-4">条件に一致するデータがありません。</div>
          </section>
        );
      }

      return (
        <section>
          <h2 className="headline-text font-bold">検索結果</h2>
          <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
          <TableOfContents pageDefinitions={pageDefinitions} onNavigate={handleNavigate} />
          
          {/* データ取得中の表示 */}
          {isLoading && (
             <div className='base-text m-4'>データを読み込んでいます...</div>
          )}
          
          <SearchResultsCardList categories={categoriesForCurrentPage} />
          
          <PaginationUI
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page:number) => handleNavigate(page, null)}
          />
        </section>
      );
    } else if (isTableKind) {
      // テーブルの0件表示 (カッコで優先順位を明確化)
      if ((!tableRecords || tableRecords.length === 0) && !isLoading) {
        return (
          <section>
            <h2 className="headline-text font-bold">検索結果</h2>
            <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
            <div className="base-text m-4">条件に一致するデータがありません。</div>
          </section>
        );
      }
      return (
        <section>
          <h2 className="headline-text font-bold">検索結果</h2>
          <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
          <SearchResultsTable records={tableRecords} />
        </section>
      );
    } else {
      return (
        <section>
          <h2 className="headline-text font-bold">検索結果</h2>
          <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
          <div className="base-text m-4">この種類のデータは表示できません。</div>
        </section>
      );
    }
}

// サブコンポーネントは変更なし
function SearchResultsCardList ({ categories }: { categories: Category[] }) {
    return (
      <div className="mx-0 my-4">
        {categories.map((category) => {
          if (!category.records || category.records.length === 0) return null;
          return (
            <div key={category.id} id={`category-anchor-${category.id}`}>
              <CardList title={category.name} records={category.records} />
            </div>
          );
        })}
      </div>
    );
}

function SearchResultsTable ({ records }: { records: TableRecord[] }) {
    return (
      <Card>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3 text-center base-text font-bold"><ScaledText text="名称"/></div>
          <div className="col-span-2 text-center base-text font-bold"><ScaledText text="能力値"/></div>
          <div className="col-span-7 text-left base-text font-bold"><ScaledText text="技能"/></div>
        </div>
        <CardDivider />
        <div className="grid grid-cols-12 gap-2">
          {records.map((work) => (
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