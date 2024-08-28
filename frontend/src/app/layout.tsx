import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import { ReactNode } from 'react'
import StoreProvider from '@/shared/providers/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Анализатор видео'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
