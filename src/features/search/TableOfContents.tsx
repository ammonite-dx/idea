import React from 'react';

// 目次の各アイテムの型定義
export type TocItem = {
  categoryId: string;    // カテゴリの一意なID (スクロールターゲット用)
  categoryName: string;  // 表示するカテゴリ名
  pageNumber: number;    // このカテゴリが含まれるページ番号
}

// TableOfContentsコンポーネントのPropsの型定義
type TableOfContentsProps = {
  tocData: TocItem[]; // 目次データの配列
  onNavigate: (pageNumber: number, categoryId: string) => void; // ナビゲーション実行関数
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ tocData, onNavigate }) => {
  // 目次データがない場合は何も表示しない
  if (!tocData || tocData.length === 0) {
    return null;
  }

  return (
    <nav aria-labelledby="toc-heading" className="bg-light-dark border border-neutral-500 p-4 my-4">
        <h3 className="title-text text-neutral-900 dark:text-neutral-100 font-bold">目次</h3>
        <hr className="border-neutral-900 dark:border-neutral-200 lg:mb-2"/>
        <ul>
            {tocData.map((item) => (
                <li key={item.categoryId}>
                    <button
                        onClick={() => {
                          console.log('[TableOfContents] onClick: Navigating to page:', item.pageNumber, 'for categoryId:', item.categoryId);
                          onNavigate(item.pageNumber, item.categoryId);
                        }}
                        className="w-full base-text text-left"
                        title={item.categoryName}
                    >
                    {item.categoryName}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
  );
};

export default TableOfContents;