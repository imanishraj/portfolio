'use client'
import { useRef, useEffect } from 'react'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  input: string
  setInput: (val: string) => void
  loading: boolean
  onSend: () => void
}

export default function ChatDrawer({ 
  isOpen, 
  onClose, 
  messages, 
  input, 
  setInput, 
  loading, 
  onSend 
}: ChatDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Invisible overlay to block page interaction and scrolling when open */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1400,
          pointerEvents: isOpen ? 'auto' : 'none',
          touchAction: 'none',
        }}
      />
      
      <div
        style={{
          position: 'fixed',
          top: 'env(safe-area-inset-top, 1.5rem)',
          left: '1.5rem',
          width: 'calc(100vw - 3rem)',
          maxWidth: '400px',
          height: 'calc(100vh - env(safe-area-inset-top, 1.5rem) - env(safe-area-inset-bottom, 1.5rem) - 3rem)',
          backgroundColor: 'rgba(5, 5, 5, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(-100% - 3rem))',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1500,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '20px 0 50px rgba(0,0,0,0.8)',
          borderRadius: '12px',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.2em',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#ffffff',
        }}>
          <span>SYSTEM CHAT</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '1.2rem',
              lineHeight: 1,
              transition: 'color 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={e => e.currentTarget.style.color = '#666'}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chat-drawer-scroll" style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'none',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.9rem',
        }}>
          {messages.length === 0 && (
            <div style={{ color: '#444', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', letterSpacing: '0.1em' }}>
              AWAITING INPUT...
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              color: msg.role === 'user' ? '#000000' : '#ffffff',
              backgroundColor: msg.role === 'user' ? '#ffffff' : 'rgba(255,255,255,0.03)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
              padding: '1rem 1.2rem',
              borderRadius: msg.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
              lineHeight: 1.6,
              fontWeight: msg.role === 'user' ? 500 : 300,
            }}>
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: 'flex-start', color: '#666', padding: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              PROCESSING...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontFamily: '"Inter", sans-serif',
              fontSize: '16px', /* 16px explicitly to prevent iOS auto-zoom */
            }}
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.1em',
              fontSize: '0.8rem',
              fontWeight: 700,
              opacity: loading || !input.trim() ? 0.2 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </>
  )
}
