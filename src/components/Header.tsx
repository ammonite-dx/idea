'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/search/power', label: 'エフェクト' },
    { href: '/search/item', label: 'アイテム' },
    { href: '/search/dlois', label: 'Dロイス' },
    { href: '/search/elois', label: 'Eロイス' },
    { href: '/search/work', label: 'ワークス' },
  ]

  const getLinkStyle = (href: string) =>
    `hover:opacity-80 transition ${pathname === href ? 'font-bold' : ''}`

  return (
    <header className="w-full bg-dark">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* ロゴ */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          IDEA
        </Link>

        {/* PC用ナビゲーション */}
        <nav className="hidden md:flex space-x-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={getLinkStyle(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ユーザーボタン（Clerk） */}
        <div className="block">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>

        {/* ハンバーガーアイコン */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー切り替え"
        >
          {isOpen ? (
            // 閉じるアイコン
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // ハンバーガーアイコン
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* モバイルメニュー（縦並び＆リンククリックで閉じる） */}
      {isOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 space-y-2 title-text">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkStyle(link.href)}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
