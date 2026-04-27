/**
 * Корневой layout приложения "Шаблоны МЭС"
 * Устанавливает базовые метаданные, шрифты и провайдеры
 */
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Подключение шрифтов Google
const geist = Geist({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono' 
})

// SEO метаданные
export const metadata: Metadata = {
  title: 'Шаблоны МЭС | Инструмент для операторов',
  description: 'Система шаблонов для операторов Мосэнергосбыт. Корректировки показаний, жалобы, письма и другие шаблоны.',
  keywords: ['МЭС', 'Мосэнергосбыт', 'шаблоны', 'оператор', 'корректировки'],
  authors: [{ name: 'МЭС Team' }],
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

// Настройки viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f2f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1117' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background min-h-screen`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
