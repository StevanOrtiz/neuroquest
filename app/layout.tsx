import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
<<<<<<< HEAD
import { PomodoroTimer } from '@/components/pomodoro/pomodoro-timer'
=======
>>>>>>> f7fef1e511e8ef115bd771a4ec6bdde2208272c5
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'QuestMind - RPG Educativo',
  description: 'Convierte tus apuntes en aventuras. Sube un PDF, enfrenta preguntas tipo RPG y aprende jugando.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className="font-sans antialiased">
        {children}
<<<<<<< HEAD
        <PomodoroTimer />
=======
>>>>>>> f7fef1e511e8ef115bd771a4ec6bdde2208272c5
        <Toaster theme="dark" richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
