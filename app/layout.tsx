import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Tracker Manager - AI Study Assistant',
  description: 'AI-powered study assistant for UPSC, NEET, JEE, and competitive exams with task management, Pomodoro timer, and notes',
  keywords: 'UPSC, NEET, JEE, study assistant, AI tutor, task manager, pomodoro timer, competitive exams',
  authors: [{ name: 'Adarsh Tiwari' }],
  creator: 'Adarsh Tiwari',
  publisher: 'Task Tracker Manager',
  robots: 'index, follow',
  openGraph: {
    title: 'Task Tracker Manager - AI Study Assistant',
    description: 'AI-powered study assistant for competitive exams',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Tracker Manager - AI Study Assistant',
    description: 'AI-powered study assistant for competitive exams',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}