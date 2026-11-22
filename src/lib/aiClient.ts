import { getHealthSystemPrompt } from './nlp'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export class HealthAIClient {
  private messages: ChatMessage[] = []

  constructor() {
    this.messages = [
      {
        role: 'assistant',
        content: 'Hi! I\'m Aroha, your health guidance assistant. What brings you here today?',
      },
    ]
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage,
    })

    try {
      // Call our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: getHealthSystemPrompt(),
            },
            ...this.messages,
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const assistantMessage = data.choices?.[0]?.message?.content

      if (!assistantMessage) {
        throw new Error('No response from AI')
      }

      // Add assistant response to history
      this.messages.push({
        role: 'assistant',
        content: assistantMessage,
      })

      return assistantMessage
    } catch (error) {
      console.error('AI Client error:', error)
      throw error
    }
  }

  getConversation(): ChatMessage[] {
    return this.messages
  }

  clearConversation(): void {
    this.messages = [
      {
        role: 'assistant',
        content: 'Hi! I\'m Aroha, your health guidance assistant. What brings you here today?',
      },
    ]
  }
}

// Singleton instance
let aiClient: HealthAIClient | null = null

export function getAIClient(): HealthAIClient {
  if (!aiClient) {
    aiClient = new HealthAIClient()
  }
  return aiClient
}
