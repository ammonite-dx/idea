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
    <nav aria-labelledby="toc-heading" className="my-4 p-4 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-800">
        <h3 className="title-text font-bold">目次</h3>
        <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
        <ul className="space-y-1">
            {tocData.map((item) => (
                <li key={item.categoryId}>
                    <button
                        onClick={() => {
                          console.log('[TableOfContents] onClick: Navigating to page:', item.pageNumber, 'for categoryId:', item.categoryId);
                          onNavigate(item.pageNumber, item.categoryId);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded py-1 px-2 text-left w-full transition-colors duration-150"
                        title={item.categoryName}
                    >
                    {item.categoryName} <span className="text-sm text-gray-500 dark:text-gray-400">(p.{item.pageNumber})</span>
                    </button>
                </li>
            ))}
        </ul>
    </nav>
  );
};

export default TableOfContents;