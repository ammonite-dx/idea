type CategoryInfoForPagination = {
  id: string;    // カテゴリの一意なID
  name: string;  // カテゴリ名
  count: number; // そのカテゴリに含まれるレコードの総数
}

type PageDefinition = {
  page: number;                      // ページ番号
  categories: CategoryInfoForPagination[]; // このページに含まれるカテゴリのリスト
}

type PaginationStructure = {
  totalPages: number;        // 計算された総ページ数
  pageDefinitions: PageDefinition[]; // 各ページの定義の配列
}

// ページネーションの計算を行う関数
export function calculatePageStructure(
  categoriesInfo: CategoryInfoForPagination[],
  itemsPerPage: number
): PaginationStructure {
  const pageDefinitions: PageDefinition[] = [];
  let currentPageNumber = 1;
  let currentPageCategories: CategoryInfoForPagination[] = [];
  let currentItemCountInPage = 0;

  // レコード数が0のカテゴリはページネーション計算に含めない
  const validCategories = categoriesInfo.filter(cat => cat.count > 0);

  for (const category of validCategories) {
    // 現在のページにこのカテゴリを追加すると最大レコード数を超え、かつ、現在のページに既に何かしらのカテゴリが含まれている場合
    if (
        currentItemCountInPage > 0 &&
        currentItemCountInPage + category.count > itemsPerPage
    ) {
        // 現在のページをページ定義に追加
        pageDefinitions.push({
            page: currentPageNumber,
            categories: currentPageCategories,
        });

        // 次のページの準備
        currentPageNumber++;
        currentPageCategories = []; // 新しいページ用にカテゴリリストをリセット
        currentItemCountInPage = 0;  // 新しいページ用にアイテムカウントをリセット
    }

    // カテゴリを現在のページに追加
    currentPageCategories.push({
      id: category.id,
      name: category.name,
      count: category.count,
    });
    currentItemCountInPage += category.count;
  }

  // ループ終了後、現在のページにカテゴリが残っていれば、それを最後のページとして追加
  if (currentPageCategories.length > 0) {
    pageDefinitions.push({
      page: currentPageNumber,
      categories: currentPageCategories,
    });
  }

  // もし validCategories が空だった場合（表示するカテゴリが一つもない場合）
  if (pageDefinitions.length === 0 && validCategories.length === 0) {
    return {
      totalPages: 0,
      pageDefinitions: [],
    };
  }

  // 合計ページ数を計算
  const totalPages = pageDefinitions.length > 0 ? pageDefinitions[pageDefinitions.length - 1].page : 0;

  return {
    totalPages: totalPages, // または currentPageNumber (アイテムがなければ0)
    pageDefinitions: pageDefinitions,
  };
}