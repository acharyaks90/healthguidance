import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()

    const response = await fetch('https://api.grok.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: body.messages,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Grok API error: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
