import React from 'react';

type PaginationUIProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  maxPageNumbersToShow?: number; // 表示するページ番号の最大数
};

const PaginationUI: React.FC<PaginationUIProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageNumbersToShow = 5, // デフォルトは5つのページ番号を表示
}) => {
  // 総ページ数が1以下の場合は何も表示しない
  if (totalPages <= 1) {
    return null;
  }

  // 表示するページ番号の範囲を計算
  let startPage: number;
  let endPage: number;

  if (totalPages <= maxPageNumbersToShow) {
    // 総ページ数が表示最大数以下の場合は、1からtotalPagesまで全て表示
    startPage = 1;
    endPage = totalPages;
  } else {
    // 総ページ数が表示最大数より多い場合
    const halfMax = Math.floor(maxPageNumbersToShow / 2);
    if (currentPage <= halfMax) {
      // 現在のページが最初の数ページの場合
      startPage = 1;
      endPage = maxPageNumbersToShow;
    } else if (currentPage + halfMax >= totalPages) {
      // 現在のページが最後の数ページの場合
      startPage = totalPages - maxPageNumbersToShow + 1;
      endPage = totalPages;
    } else {
      // 現在のページが中間のどこかの場合
      startPage = currentPage - halfMax;
      endPage = currentPage + halfMax;
      // maxPageNumbersToShow が偶数の場合、currentPage が少し左に寄るので調整
      if (maxPageNumbersToShow % 2 === 0) {
        endPage = currentPage + halfMax -1;
      }
    }
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // --- 省略表示 ("...") を追加する場合のロジック（簡易版） ---
  const showFirstEllipsis = startPage > 2;
  const showLastEllipsis = endPage < totalPages - 1;

  // ページ番号の配列を再構築して、先頭/末尾と省略記号を含める
  const pagesToRender: (number | string)[] = [];
  if (startPage > 1) {
    pagesToRender.push(1); // 常に1ページ目を表示
    if (showFirstEllipsis) {
      pagesToRender.push('...');
    }
  }

  pagesToRender.push(...pageNumbers.filter(num => num !== 1 && num !== totalPages)); // 1とtotalPagesは個別に追加するのでフィルタ

  if (endPage < totalPages) {
    if (showLastEllipsis && !pageNumbers.includes(totalPages -1) ) { // 最後のページの一つ手前が表示されてない場合に省略
        pagesToRender.push('...');
    }
    pagesToRender.push(totalPages); // 常に最後のページを表示
  }
  // pagesToRenderから重複するページ番号や不適切な省略を整理する必要がある。
  // この省略ロジックはもっと洗練させる必要があるため、今回はよりシンプルなページ番号リストで進めます。
  // 上記の省略ロジックはコメントアウトし、下のシンプルなものを使います。


  // シンプルなページ番号リスト（startPageからendPageまで）
  const simplePageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    simplePageNumbers.push(i);
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center space-x-2 my-8">
      {/* 前へボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-md text-sm font-medium
          ${currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        aria-disabled={currentPage === 1}
        aria-label="Previous page"
      >
        前へ
      </button>

      {/* ページ番号ボタン (シンプルなリスト) */}
      {simplePageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          className={`px-3 py-1 border rounded-md text-sm font-medium
            ${page === currentPage
              ? 'bg-blue-500 text-white border-blue-500 cursor-default dark:bg-blue-600 dark:border-blue-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* 次へボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-md text-sm font-medium
          ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        aria-disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        次へ
      </button>
    </nav>
  );
};

export default PaginationUI;