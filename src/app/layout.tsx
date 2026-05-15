import type { Metadata } from 'next'
import './globals.css'
import { ChatProvider } from '@/components/chat/ChatContext'
import GlobalChat from '@/components/chat/GlobalChat'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Manish Raj \u2014 Full Stack Developer & IoT Engineer',
  description: 'Full Stack Developer & IoT Engineer based in Bengaluru. Building at the intersection of software and hardware \u2014 React, FastAPI, PostgreSQL, ESP32.',
  openGraph: {
    title: 'Manish Raj \u2014 Full Stack Developer & IoT Engineer',
    description: 'Full Stack Developer & IoT Engineer based in Bengaluru.',
    url: 'https://www.manishraj.me',
    siteName: 'Manish Raj',
    images: [
      {
        url: 'https://www.manishraj.me/images/og-cover.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
          <GlobalChat />
        </ChatProvider>
        <Analytics />
      </body>
    </html>
  )
}