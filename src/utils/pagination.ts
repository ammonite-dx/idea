export interface CategoryInfoForPagination {
  id: string;    // カテゴリの一意なID
  name: string;  // カテゴリ名
  count: number; // そのカテゴリに含まれるレコードの総数
}

/**
 * 特定のページに含まれるカテゴリの定義
 */
export interface PageCategoryDefinition extends CategoryInfoForPagination {}

/**
 * 1つのページの定義
 */
export interface PageDefinition {
  page: number;                      // ページ番号
  categories: PageCategoryDefinition[]; // このページに含まれるカテゴリのリスト
}

/**
 * ページネーション構造の計算結果
 */
export interface PaginationStructure {
  totalPages: number;        // 計算された総ページ数
  pageDefinitions: PageDefinition[]; // 各ページの定義の配列
}

/**
 * カテゴリ情報を基に、ページネーションの構造を計算します。
 * 前提: itemsPerPage は、どの単一カテゴリの count よりも大きい。
 * つまり、1つのカテゴリが複数ページにまたがることはない。
 *
 * @param categoriesInfo - 各カテゴリの情報 (id, name, count) の配列
 * @param itemsPerPage - 1ページあたりの最大レコード数
 * @returns PaginationStructure (totalPages と pageDefinitions)
 */
export function calculatePageStructure(
  categoriesInfo: CategoryInfoForPagination[],
  itemsPerPage: number
): PaginationStructure {
  const pageDefinitions: PageDefinition[] = [];
  let currentPageNumber = 1;
  let currentPageCategories: PageCategoryDefinition[] = [];
  let currentItemCountInPage = 0;

  // レコード数が0のカテゴリはページネーション計算に含めない（API側で事前にフィルタ済みのはずだが念のため）
  const validCategories = categoriesInfo.filter(cat => cat.count > 0);

  for (const category of validCategories) {
    // 現在のページにこのカテゴリを追加すると最大レコード数を超えるか、
    // かつ、現在のページに既に何かしらのカテゴリが含まれている場合
    // (最初のカテゴリがitemsPerPageを超える場合は、そのカテゴリだけで1ページを構成するため、
    // currentPageItemCount > 0 の条件が必要)
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

    // (現在のカテゴリがitemsPerPageを超えてしまうことは前提により無いため、
    //  そのチェックは不要)

    // カテゴリを現在のページに追加
    currentPageCategories.push({
      id: category.id,
      name: category.name,
      count: category.count, // 元のカテゴリの総件数を保持（表示等で使う可能性あり）
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
  
  // totalPages は、作成された pageDefinitions の最後のページ番号、または length
  // もし途中で空のページができてしまう可能性があるなら、 currentPageNumber を使うのが安全
  const totalPages = pageDefinitions.length > 0 ? pageDefinitions[pageDefinitions.length - 1].page : 0;
  // または、単純に currentPageNumber (ただし、アイテムが全くない場合は0にしたい)
  // const totalPages = validCategories.length > 0 ? currentPageNumber : 0;


  return {
    totalPages: totalPages, // または currentPageNumber (アイテムがなければ0)
    pageDefinitions: pageDefinitions,
  };
}