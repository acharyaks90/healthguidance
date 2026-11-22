// Keywords for symptom detection
const symptomKeywords: Record<string, string[]> = {
  'Hair fall': ['hair fall', 'hair loss', 'baldness', 'hair thinning'],
  'Eyesight changes': ['eyesight', 'vision', 'eye strain', 'blurred vision'],
  'Back pain': ['back pain', 'back ache', 'lower back', 'upper back'],
  'Fatigue': ['fatigue', 'tired', 'exhaustion', 'low energy'],
  'Poor sleep': ['sleep', 'insomnia', 'cant sleep', 'sleepless'],
  'Stress': ['stress', 'anxiety', 'anxious', 'worried'],
  'Gut health': ['stomach', 'digestion', 'gut', 'constipation', 'diarrhea'],
  'Mood swings': ['mood', 'moody', 'irritable', 'depression'],
  'Thyroid': ['thyroid', 'hormones'],
  'Blood pressure': ['blood pressure', 'bp', 'hypertension'],
}

const careKeywords: Record<string, string[]> = {
  'General physician': ['general', 'doctor', 'physician'],
  'Medical specialist': ['specialist', 'expert'],
  'Mental health': ['mental', 'psychologist', 'counselor'],
  'Ayurveda / traditional': ['ayurveda', 'ayurvedic', 'traditional', 'herbal'],
  'Nutrition support': ['nutrition', 'diet', 'nutritionist'],
  'Physiotherapy': ['physio', 'physical', 'therapy'],
  'Lifestyle coaching': ['lifestyle', 'coach'],
}

const movementKeywords: Record<string, string[]> = {
  'Yoga': ['yoga'],
  'Gym': ['gym', 'weightlifting', 'strength'],
  'Walking': ['walk', 'walking'],
  'Swimming': ['swim', 'swimming'],
  'Cycling': ['cycle', 'cycling', 'bike'],
  'Pilates': ['pilates'],
  'High intensity': ['hiit', 'high intensity', 'running'],
}

export interface ExtractedInfo {
  symptoms: string[]
  carePreferences: string[]
  movementPreferences: string[]
  worryLevel?: number
  cohort?: string
}

// Extract symptoms and preferences from user message
export function extractHealthInfo(text: string): ExtractedInfo {
  const lowerText = text.toLowerCase()

  const symptoms: string[] = []
  const carePreferences: string[] = []
  const movementPreferences: string[] = []

  // Extract symptoms
  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      symptoms.push(symptom)
    }
  }

  // Extract care preferences
  for (const [care, keywords] of Object.entries(careKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      carePreferences.push(care)
    }
  }

  // Extract movement preferences
  for (const [movement, keywords] of Object.entries(movementKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      movementPreferences.push(movement)
    }
  }

  // Extract worry level (1-5)
  let worryLevel: number | undefined
  const worryMatch = text.match(/worry|concern|worried/gi)
  if (worryMatch) {
    const levelMatch = text.match(/\b([1-5])\b/)
    if (levelMatch) {
      worryLevel = parseInt(levelMatch[1])
    } else {
      worryLevel = 3 // default middle
    }
  }

  // Extract age cohort
  let cohort: string | undefined
  if (lowerText.match(/23|25|30|35|early|young/)) {
    cohort = '23–35'
  } else if (lowerText.match(/36|40|45|family|career/)) {
    cohort = '36–45'
  } else if (lowerText.match(/45|50|60|active|maintenance/)) {
    cohort = '45–60+'
  }

  return {
    symptoms: Array.from(new Set(symptoms)), // Remove duplicates
    carePreferences: Array.from(new Set(carePreferences)),
    movementPreferences: Array.from(new Set(movementPreferences)),
    worryLevel,
    cohort,
  }
}

// Generate system prompt for health guidance
export function getHealthSystemPrompt(): string {
  return `You are Aroha, a compassionate AI health guidance assistant. Your role is to:
1. Listen carefully to the user's health concerns
2. Ask clarifying questions about symptoms
3. Provide evidence-based guidance (never diagnose)
4. Recommend appropriate healthcare professionals
5. Suggest lifestyle modifications
6. Always emphasize consulting real healthcare providers

Important guidelines:
- Never provide medical diagnosis
- Always recommend professional consultation for serious concerns
- Be empathetic and non-judgmental
- Provide practical, actionable advice
- Focus on holistic health (physical, mental, lifestyle)
- If emergency is mentioned, strongly recommend hospital/emergency services
- Keep responses concise and conversational (2-3 sentences)`
}

// Generate context-aware follow-up question
export function generateFollowUp(info: ExtractedInfo): string {
  const { symptoms, worryLevel, carePreferences } = info

  if (symptoms.length === 0) {
    return 'Could you tell me a bit more about what health concerns brought you here today?'
  }

  if (!worryLevel) {
    return `I see you mentioned ${symptoms.slice(0, 2).join(' and ')}. How much is this affecting your daily life? Are you very concerned or just mildly worried?`
  }

  if (carePreferences.length === 0) {
    return 'What type of support would be most helpful for you? Are you interested in seeing a doctor, trying lifestyle changes, or exploring alternative approaches?'
  }

  return 'Is there anything else about your health concerns I should know?'
}
