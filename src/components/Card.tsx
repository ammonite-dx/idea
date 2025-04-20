import React from 'react'
import clsx from 'clsx';

// カード本体
export function Card ({ children, invert=false }: { children:React.ReactNode; invert?:boolean }) {
    return (
        <div className={clsx("card", invert ? "bg-dark" : "bg-light")}>
            { children }
        </div>
    );
}

// カードのヘッダー
export function CardHeader ({ children }: { children:React.ReactNode }) {
    return (
        <div className="px-1 lg:px-2 py-0">
            { children }
        </div>
    )
}

// カードのボディ
export function CardBody ({ children }: { children:React.ReactNode }) {
    return (
        <div className="base-text px-1 lg:px-2">
            { children }
        </div>
    )
}

// カードボディ内の行
export function CardBodyRow ({ children }: { children:React.ReactNode }) {
    // 子要素の数が1の場合は1列、2以上の場合はそれに応じた列数を指定する
    if (React.Children.count(children) === 1) {
        return(
        <div className={`grid grid-cols-none pb-1`}>
            { children }
        </div>
        )
    } else {
        return(
        <div className={`grid grid-cols-${React.Children.count(children)} pb-1`}>
            { children }
        </div>
        )
    }
}

// カードの区切り線
export function CardDivider ({ invert=false }: { invert?:boolean }) {
    return (
        <hr className={clsx("my-2", invert ? "border-neutral-100 dark:border-neutral-900" : "border-neutral-900 dark:border-neutral-400")}/>
    )
}