import { NextRequest, NextResponse } from 'next/server'

interface AnalysisRequest {
  symptoms: string[]
  worry: number
  cohort: string
  carePreferences: string[]
  movementPreferences: string[]
}

interface AnalysisResponse {
  recommendation: string
  actionItems: string[]
  warnings: string[]
  professionalAdvice: string
}

export async function POST(req: NextRequest): Promise<NextResponse<AnalysisResponse | { error: string }>> {
  try {
    const body: AnalysisRequest = await req.json()

    const prompt = `You are a health guidance assistant. Based on the following health profile, provide a brief personalized recommendation:

Health Profile:
- Symptoms: ${body.symptoms.join(', ') || 'None mentioned'}
- Worry Level: ${body.worry}/5
- Age Group: ${body.cohort}
- Preferred Care Types: ${body.carePreferences.join(', ') || 'Open to suggestions'}
- Preferred Movement: ${body.movementPreferences.join(', ') || 'Not specified'}

Provide:
1. A main recommendation (1-2 sentences)
2. 3 actionable items
3. Any warning signs to watch for
4. When to seek professional advice

Format your response as JSON with keys: recommendation, actionItems (array), warnings (array), professionalAdvice`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'You are a healthcare guidance assistant. Always respond in valid JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: `Groq API error: ${error}` }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse JSON response from AI
    try {
      const parsed = JSON.parse(content)
      return NextResponse.json({
        recommendation: parsed.recommendation || '',
        actionItems: parsed.actionItems || [],
        warnings: parsed.warnings || [],
        professionalAdvice: parsed.professionalAdvice || '',
      })
    } catch {
      // Fallback if AI doesn't return valid JSON
      return NextResponse.json({
        recommendation: content,
        actionItems: [],
        warnings: [],
        professionalAdvice: 'Please consult a healthcare professional.',
      })
    }
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
