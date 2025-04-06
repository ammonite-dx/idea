import React from "react";
import CategoryCardHeader from "./CategoryCardHeader";
import CategoryCardDivider from "./CategoryCardDivider";

export default function CategoryCard ({ categoryName, hitNumber }: { categoryName: string, hitNumber: number }) {
    return (
        <div className="text-neutral-200 dark:text-neutral-900 bg-neutral-900 dark:bg-neutral-300 border border-neutral-900 dark:border-neutral-300 rounded-lg p-1 lg:p-2 m-1 lg:m-2">
            <CategoryCardHeader categoryName={categoryName} />
            <CategoryCardDivider />
            <div className="text-sm lg:text-lg text-center px-1 lg:px-2 pt-1 lg:pt-2">
                検索結果：{hitNumber}件
            </div>
        </div>
    )
}