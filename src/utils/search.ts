import { Power, Item } from '../types/types';
import { Category } from '../types/pagination';

export function categorizeRecords(
  categories: Category[],
  records: (Power|Item)[]
): Category[] {

    // カテゴリごとにレコードを分類するためのMapを作成
    const recordsByCategoryName = new Map<string, (Power|Item)[]>();
    for (const record of records) {
        // もしMapにそのカテゴリ名のキーがなければ初期化
        if (!recordsByCategoryName.has(record.category)) {
            recordsByCategoryName.set(record.category, []);
        }
        // 対応するカテゴリ名の配列にレコードを追加
        recordsByCategoryName.get(record.category)!.push(record);
    }

    // カテゴリごとにレコードをまとめた新しい配列を作成
    const resultCategories: Category[] = categories.map(category => ({
        ...category,
        records: recordsByCategoryName.get(category.name) || [],
    }));

    // レコード数が0のカテゴリは除外
    const filteredCategories = resultCategories.filter(category => category.records && category.records.length > 0);

    return filteredCategories;
}