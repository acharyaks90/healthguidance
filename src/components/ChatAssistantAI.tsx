'use client'

import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icon'
import { getAIClient, type ChatMessage } from '@/lib/aiClient'
import { extractHealthInfo } from '@/lib/nlp'

export type ChatAnswers = {
  cohort: string
  symptoms: string[]
  worry: number
  care: string[]
  movement: string[]
}

interface ChatAssistantAIProps {
  onClose: () => void
  onComplete?: (answers: ChatAnswers) => void
  mode?: 'guided' | 'ai' // 'guided' = old wizard, 'ai' = new conversational
}

export function ChatAssistantAI({
  onClose,
  onComplete,
  mode = 'ai',
}: ChatAssistantAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiClientRef = useRef(getAIClient())
  const [extractedInfo, setExtractedInfo] = useState<{
    symptoms: string[]
    care: string[]
    movement: string[]
    worry: number
    cohort: string
  }>({
    symptoms: [],
    care: [],
    movement: [],
    worry: 3,
    cohort: '23–35',
  })

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with greeting message
  useEffect(() => {
    const greeting: ChatMessage = {
      role: 'assistant',
      content:
        "Hi! I'm Aroha, your health guidance assistant. Tell me, what brings you here today? Feel free to describe any health concerns, symptoms, or questions you have.",
    }
    setMessages([greeting])
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Extract health info from user input
      const info = extractHealthInfo(input)
      setExtractedInfo((prev) => ({
        ...prev,
        symptoms: [...new Set([...prev.symptoms, ...info.symptoms])],
        care: [...new Set([...prev.care, ...info.carePreferences])],
        movement: [...new Set([...prev.movement, ...info.movementPreferences])],
        worry: info.worryLevel ?? prev.worry,
        cohort: info.cohort ?? prev.cohort,
      }))

      // Get AI response
      const aiClient = aiClientRef.current
      const response = await aiClient.sendMessage(input)

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMessage)
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        cohort: extractedInfo.cohort,
        symptoms: extractedInfo.symptoms,
        worry: extractedInfo.worry,
        care: extractedInfo.care,
        movement: extractedInfo.movement,
      })
    }
    onClose()
  }

  return (
    <div className="chat-overlay" onMouseDown={onClose}>
      <aside
        className="chat-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Aroha AI assistant"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-identity">
            <span>
              <Icon name="sparkle" size={18} />
            </span>
            <div>
              <strong>Aroha AI Assistant</strong>
              <small>Conversational health guidance</small>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close AI assistant">
            <Icon name="close" size={19} />
          </button>
        </div>

        {/* Safety Notice */}
        <div className="chat-safety">
          <Icon name="shield" size={14} />
          Guidance only—not a diagnosis or emergency service.
        </div>

        {/* Messages Container */}
        <div className="chat-thread" style={{ overflowY: 'auto', flex: 1 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              {msg.role === 'assistant' && (
                <span className="chat-bot-mark">
                  <Icon name="sparkle" size={14} />
                </span>
              )}
              <div>{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <span className="chat-bot-mark">
                <Icon name="sparkle" size={14} />
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal)',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal)',
                    animation: 'pulse 1.5s infinite 0.3s',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal)',
                    animation: 'pulse 1.5s infinite 0.6s',
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="chat-message assistant" style={{ color: 'red' }}>
              <div>Error: {error}</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Extracted Info Display */}
        {(extractedInfo.symptoms.length > 0 ||
          extractedInfo.care.length > 0 ||
          extractedInfo.movement.length > 0) && (
          <div className="chat-info-summary">
            {extractedInfo.symptoms.length > 0 && (
              <div>
                <small>Symptoms mentioned:</small>
                <div style={{ fontSize: '12px', color: 'var(--teal)' }}>
                  {extractedInfo.symptoms.join(', ')}
                </div>
              </div>
            )}
            {extractedInfo.care.length > 0 && (
              <div>
                <small>Care preferences:</small>
                <div style={{ fontSize: '12px', color: 'var(--teal)' }}>
                  {extractedInfo.care.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-controls">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--teal)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="arrow" size={16} />
            </button>
          </div>

          {/* Complete Button (after extracting info) */}
          {extractedInfo.symptoms.length > 0 && onComplete && (
            <button
              className="chat-primary"
              onClick={handleComplete}
              style={{ width: '100%' }}
            >
              Create my guidance <Icon name="arrow" size={16} />
            </button>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
