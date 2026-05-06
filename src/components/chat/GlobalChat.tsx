'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ChatDrawer, { Message } from './ChatDrawer'
import { useChat } from './ChatContext'

export default function GlobalChat() {
  const { isOpen, closeChat, toggleChat } = useChat()
  const pathname = usePathname()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pageContext: pathname }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'The connection is lost. Try again later.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <ChatDrawer
        isOpen={isOpen}
        onClose={closeChat}
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        onSend={handleSend}
      />
    </>
  )
}
