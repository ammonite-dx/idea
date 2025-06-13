'use client';

import React, { useState } from 'react';
import { ChevronUp,ChevronDown } from 'lucide-react';
import { PageDefinition } from '@/types/pagination';

// 目次の各アイテムの型定義
export type TocItem = {
  categoryId: string;    // カテゴリの一意なID (スクロールターゲット用)
  categoryName: string;  // 表示するカテゴリ名
  pageNumber: number;    // このカテゴリが含まれるページ番号
}

export default function TableOfContents({pageDefinitions, onNavigate}: {pageDefinitions: PageDefinition[], onNavigate: (pageNumber: number, categoryId: string) => void}) {

  const [ isOpen, setIsOpen ] = useState(false);

  // 目次データがない場合は何も表示しない
  if (!pageDefinitions || pageDefinitions.length === 0) {
    return null;
  }

  const tableOfContents = pageDefinitions.flatMap((pageDefinition) => 
    pageDefinition.categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      pageNumber: pageDefinition.page,
    }))
  );

  return (
    <nav aria-labelledby="toc-heading" className="bg-light-dark border border-neutral-500 p-2 lg:p-4 my-4">
      <div className="flex justify-between items-center">
        <h3 className="title-text text-neutral-900 dark:text-neutral-100 font-bold">目次</h3>
        <button onClick={() => setIsOpen((prev) => !prev)} className="ring-1 ring-neutral-900 dark:ring-neutral-100 rounded-sm">{isOpen ? <ChevronUp className='base-icon' /> : <ChevronDown className='base-icon' />}</button>
      </div>
      <div hidden={!isOpen}>
        <hr className="border-neutral-900 dark:border-neutral-200 my-1 lg:my-2"/>
        <ul>
          {tableOfContents.map((item) => (
            <li key={item.categoryId}>
              <button
                onClick={() => onNavigate(item.pageNumber, item.categoryId)}
                className="w-full base-text text-left p-1"
                title={item.categoryName}
              >
              {item.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
