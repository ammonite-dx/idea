import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import SessionWrapper from '@/components/SessionWrapper';
import Header from '@/components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDEA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <SessionWrapper>
          <Header />
          <main className="max-w-9xl mx-auto p-4 lg:p-8">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  )
}

