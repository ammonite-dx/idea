"use client";

import { useState, useEffect, useLayoutEffect, useCallback, Fragment } from 'react';
import CardList from "@/components/CardList";
import { Card, CardDivider } from "@/components/Card";
import { TypeMap, CategoryWithCardRecords, TableRecord } from "@/types/types";
import ScaledText from "@/components/ScaledText";
import TableOfContents, { TocItem } from './TableOfContents';
import PaginationUI from './PaginationUI';

export default function SearchResults<K extends keyof TypeMap> ({
    kind,
    searchParams,
  }: {
    kind: K,
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    // レコードの種類を分類
    const isCardListKind = ["power", "item", "dlois", "elois"].includes(kind as string);
    const isTableKind = ["work"].includes(kind as string);

    // ページネーション用のState
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [tableOfContentsData, setTableOfContentsData] = useState<TocItem[]>([]);
    const [categoriesForCurrentPage, setcategoriesForCurrentPage] = useState<CategoryWithCardRecords[]>([]);
    const [scrollToCategoryId, setScrollToCategoryId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tableRecords, setTableRecords] = useState<TableRecord[]>([]);

    // apiに渡すクエリ文字列を生成
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (typeof value === 'string') {
        params.append(key, value);
      }
    });
    const query = params.toString();

    // 総ページ数と目次データを取得する関数
    const fetchPaginationInfo = useCallback(async () => {
      setIsLoading(true); // 全体ローディング
      setError(null);
      try {
        const response = await fetch(`/api/search/${kind}?action=getInfo&${query}`);
        if (!response.ok) throw new Error('Failed to fetch pagination info');
        const data = await response.json();

        setTotalPages(data.totalPages || 0);
        setTableOfContentsData(data.tableOfContents || []);

        if (data.totalPages > 0) {
          setActivePage(1); // データがあれば1ページ目を表示
        } else {
          setActivePage(0); // データがなければ0ページ（表示なし）
          setcategoriesForCurrentPage([]);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error("fetchPaginationInfo failed:", e);
        setError(e.message || "ページ情報の取得に失敗しました。");
        setTotalPages(0);
        setTableOfContentsData([]);
        setcategoriesForCurrentPage([]);
      }
    }, [kind, JSON.stringify(searchParams)]);

    // 特定のページのデータを取得する関数
    const fetchPageData = useCallback(async (page: number) => {
      if (page === 0 || totalPages === 0) {
        setcategoriesForCurrentPage([]);
        setIsLoading(false); // ここでローディング解除
        return;
      }
      setIsLoading(true); // ページデータ取得中のローディング
      setError(null);
      try {
        const response = await fetch(`/api/search/${kind}?action=getPage&${query}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch page data');
        const data = await response.json();
        setcategoriesForCurrentPage(data.dataForPage || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error("fetchPageData failed:", e);
        setError(e.message || "ページデータの取得に失敗しました。");
        setcategoriesForCurrentPage([]);
      } finally {
        setIsLoading(false); // ページデータ取得完了またはエラーでローディング解除
      }
    }, [kind, JSON.stringify(searchParams), totalPages]);

    // テーブルレコード用のデータ取得 (全件取得)
    const fetchTableRecords = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search/${kind}?${query}`);
        if (!response.ok) throw new Error('Failed to fetch table records');
        const records: TableRecord[] = await response.json();
        setTableRecords(records || []); // テーブル表示用のデータをセット
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error("fetchTableRecords failed:", e);
        setError(e.message || "データの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    }, [kind, JSON.stringify(searchParams)]);

    // 初期ロード時（または検索条件変更時）にページネーション情報を取得
    useEffect(() => {
      // kind がカードリストを表示する対象の場合のみページネーション情報を取得
      if (isCardListKind) {
        fetchPaginationInfo();
      } else if (isTableKind) {
        fetchTableRecords();
        setTotalPages(0); // テーブル表示の場合はページネーション関連をリセット
        setTableOfContentsData([]);
        setcategoriesForCurrentPage([]);
      } else {
        setIsLoading(false);
      }
    }, [kind, fetchPaginationInfo, searchParams]); // searchParams はfetchPaginationInfo内で使われるので注意

    // アクティブページ変更時に該当ページのデータを取得
    useEffect(() => {
      // kind がカードリスト対象 かつ activePage が有効な場合
      if (isCardListKind && activePage > 0 && totalPages > 0) {
        fetchPageData(activePage);
      }
    }, [activePage, totalPages, fetchPageData, kind]);

    useEffect(() => {
      console.log('[DEBUG useEffect] scrollToCategoryId changed to:', scrollToCategoryId);
    }, [scrollToCategoryId]);

    // スクロール処理
    useLayoutEffect(() => {
      console.log('[useLayoutEffect] Triggered. scrollToCategoryId:', scrollToCategoryId, 'dataForCurrentPage length:', categoriesForCurrentPage.length);
      if (scrollToCategoryId && Object.keys(categoriesForCurrentPage).length > 0) {
        const targetId = `category-anchor-${scrollToCategoryId}`;
        const element = document.getElementById(targetId);
        console.log(`[useLayoutEffect] Attempting to find element with ID: ${targetId}`, element);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset;
          console.log(`[useLayoutEffect] Scrolling to offsetPosition: ${offsetPosition}`);
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          setScrollToCategoryId(null); // スクロール後はリセット
        } else {
          console.warn(`[useLayoutEffect] Element with ID ${targetId} not found.`);
        }
      }
    }, [categoriesForCurrentPage, scrollToCategoryId]);

    const handleNavigate = useCallback((pageNumber: number, categoryIdToScroll: string | null = null) => {
      console.log(`[handleNavigate START] pageNumber: ${pageNumber}, categoryIdToScroll: ${categoryIdToScroll}, current activePage: ${activePage}`);
      setScrollToCategoryId(categoryIdToScroll); // スクロール対象を更新
      if (pageNumber !== activePage) {
        console.log(`[handleNavigate] Different page, setting activePage to: ${pageNumber}`);
        setActivePage(pageNumber);
      } else {
        console.log('[handleNavigate] Same page, no activePage change.');
        if (categoryIdToScroll) { // 同ページで特定のIDにスクロールしたい場合
          const element = document.getElementById(`category-anchor-${categoryIdToScroll}`);
          if (element) {
              console.log(`[handleNavigate] Element for same-page scroll FOUND. Attempting immediate scroll.`);
              const headerOffset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          } else {
              console.warn(`[handleNavigate] Element for same-page scroll NOT FOUND immediately. Relying on useLayoutEffect.`);
          }
        }
      }
    }, [activePage]);

    // --- レンダリング部分 ---
    if (isLoading) { // 初回かつ全件数未取得
      return <div className='base-text'>検索中...</div>;
    }
    if (error) {
      return <div className='base-text'>エラー: {error}</div>;
    }

    if (isCardListKind) {
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
          <TableOfContents tocData={tableOfContentsData} onNavigate={handleNavigate} />
          {isLoading && categoriesForCurrentPage.length === 0 && <div className='base-text m-4'>データを読み込んでいます...</div>}
          {!isLoading && categoriesForCurrentPage.length === 0 && totalPages > 0 && <div className='base-text m-4'>このページに表示するデータはありません。</div>}
          <SearchResultsCardList categories={categoriesForCurrentPage} />
          <PaginationUI
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page:number) => handleNavigate(page, null)}
          />
        </section>
      );
    } else if (isTableKind) {
      if (!tableRecords || tableRecords.length === 0 && !isLoading) {
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
          {tableRecords && <SearchResultsTable records={tableRecords} />}
        </section>
      );
    } else {
      // その他のkindの場合 (該当なしなど)
      return (
        <section>
          <h2 className="headline-text font-bold">検索結果</h2>
          <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
          <div className="base-text m-4">この種類のデータは表示できません。</div>
        </section>
      );
    }
  }

  // エフェクト・Dロイス・Eロイスの検索結果を表示するコンポーネント
  function SearchResultsCardList ({
    categories,
  }: {
    categories: CategoryWithCardRecords[],
  }) {
    return (
      <div className="mx-0 my-4">
        {categories.map((category) => {
          return (
            <div key={category.id} id={`category-anchor-${category.id}`}>
              {category.records.length > 0 && (
                <CardList title={category.name} records={category.records} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

// ワークスの検索結果を表示するコンポーネント
function SearchResultsTable ({
    records,
  }: {
    records: TableRecord[],
  }) {
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
