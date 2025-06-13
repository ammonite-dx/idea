import { Category, PageDefinition, PaginationStructure } from '@/types/pagination';

// ページネーションの計算を行う関数
export function calculatePageStructure(
  categories: Category[],
  itemsPerPage: number
): PaginationStructure {

  const pageDefinitions: PageDefinition[] = [];
  let currentPageNumber = 1;
  let currentPageCategories: Category[] = [];
  let currentItemCountInPage = 0;

  for (const category of categories) {

    if (!category.count || category.count === 0) {
      continue; // カテゴリのレコード数が0の場合はスキップ
    }

    // 現在のページにこのカテゴリを追加すると最大レコード数を超え、かつ、現在のページに既に何かしらのカテゴリが含まれている場合
    if (currentItemCountInPage > 0 && currentItemCountInPage + category.count > itemsPerPage) {
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

  // もし categories が空だった場合（表示するカテゴリが一つもない場合）
  if (pageDefinitions.length === 0 && categories.length === 0) {
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