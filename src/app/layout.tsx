import type { Metadata } from 'next'
import './globals.css'
import { ChatProvider } from '@/components/chat/ChatContext'
import GlobalChat from '@/components/chat/GlobalChat'

export const metadata: Metadata = {
  title: 'Manish',
  description: 'Portfolio — Privacy is a myth.',
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
      </body>
    </html>
  )
}