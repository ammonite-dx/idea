import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Header from '@/components/Header'
import './globals.css'
import { auth } from "@/auth"
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDEA',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect(`/api/auth/signin/discord?callbackUrl=/`)
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className}`}>
          <Header />
          <main className="max-w-9xl mx-auto p-4 lg:p-8">{children}</main>
      </body>
    </html>
  )
}

