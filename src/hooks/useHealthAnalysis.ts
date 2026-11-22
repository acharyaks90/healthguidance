import { useState } from 'react'

export interface AnalysisResult {
  recommendation: string
  actionItems: string[]
  warnings: string[]
  professionalAdvice: string
}

export function useHealthAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyze = async (profile: {
    symptoms: string[]
    worry: number
    cohort: string
    carePreferences: string[]
    movementPreferences: string[]
  }): Promise<AnalysisResult | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { analyze, loading, error, result }
}
