import React from "react";
import ScaledText from "./ScaledText";

export default function CategoryCard ({ title, hitNumber }: { title: string, hitNumber: number }) {
    return (
        <div className="text-neutral-200 dark:text-neutral-900 bg-neutral-900 dark:bg-neutral-300 border border-neutral-900 dark:border-neutral-300 rounded-lg p-1 lg:p-2 m-1 lg:m-2">
            <CategoryCardHeader title={title} />
            <CategoryCardDivider />
            <div className="text-sm lg:text-lg text-center px-1 lg:px-2 pt-1 lg:pt-2">
                検索結果：{hitNumber}件
            </div>
        </div>
    )
}

function CategoryCardHeader ({ title }: { title:string }) {
    return (
        <div className="text-sm lg:text-lg font-black px-1 lg:px-2 pt-0 pb-1 lg:pb-2 text-center">
            <ScaledText text={title}/>
        </div>
    )
}

function CategoryCardDivider () {
    return <hr className="border-neutral-200 dark:border-neutral-600"/>
}