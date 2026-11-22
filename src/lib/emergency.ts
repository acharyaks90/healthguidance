// Emergency detection for health guidance AI
// Use this to flag dangerous situations immediately

export interface EmergencyLevel {
  isEmergency: boolean
  level: 'critical' | 'urgent' | 'important' | 'normal'
  message: string
  action: string
  keywords: string[]
}

const criticalConditions = [
  // Cardiac
  'chest pain', 'chest tightness', 'heart attack', 'mi ',

  // Respiratory
  'can\'t breathe', 'choking', 'anaphylaxis', 'asthma attack',
  'shortness of breath',

  // Neurological
  'stroke', 'seizure', 'convulsion', 'loss of consciousness',
  'unconscious', 'unresponsive', 'coma', 'head injury',
  'severe headache', 'loss of vision', 'paralysis',

  // Trauma
  'severe bleeding', 'bleeding won\'t stop', 'profuse blood',
  'crushing injury', 'impalement', 'gunshot', 'stab wound',

  // Poisoning
  'poisoning', 'overdose', 'toxic', 'swallowed poison',
  'chemical burn', 'acid burn',

  // Other Critical
  'suicidal', 'harming myself', 'suicidal thoughts',
  'hurting myself', 'self harm', 'cut myself',
  'can\'t feel', 'numb', 'can\'t move',
]

const urgentConditions = [
  // Severe
  'severe fever', 'high fever', 'fever 104', 'fever 105',
  'severe vomiting', 'can\'t stop vomiting',
  'severe dehydration', 'haven\'t urinated',
  'severe allergic reaction', 'swelling face',
  'severe abdominal pain', 'abdomen pain 10/10',
  'broken bone', 'fracture', 'dislocated',
  'major burns', 'burned', 'burn injury',

  // Dangerous
  'can\'t wake up', 'won\'t wake', 'confused',
  'extreme dizziness', 'can\'t stand', 'keep fainting',
  'vision loss', 'loss of vision',
  'severe weakness', 'weakness all over',
]

const importantConditions = [
  'persistent pain', 'worsening',
  'new symptoms', 'spreading',
  'doesn\'t improve', 'getting worse',
  'can\'t take it', 'unbearable',
]

export function detectEmergencyLevel(text: string): EmergencyLevel {
  const lowerText = text.toLowerCase()
  const mentionedKeywords: string[] = []

  // Check critical conditions
  for (const condition of criticalConditions) {
    if (lowerText.includes(condition)) {
      mentionedKeywords.push(condition)
      return {
        isEmergency: true,
        level: 'critical',
        message: '🚨 CRITICAL EMERGENCY DETECTED',
        action: 'CALL 911 OR GO TO EMERGENCY ROOM IMMEDIATELY',
        keywords: mentionedKeywords,
      }
    }
  }

  // Check urgent conditions
  for (const condition of urgentConditions) {
    if (lowerText.includes(condition)) {
      mentionedKeywords.push(condition)
      return {
        isEmergency: true,
        level: 'urgent',
        message: '⚠️ URGENT MEDICAL ATTENTION NEEDED',
        action: 'Call your doctor immediately or go to urgent care/ER',
        keywords: mentionedKeywords,
      }
    }
  }

  // Check important conditions
  for (const condition of importantConditions) {
    if (lowerText.includes(condition)) {
      mentionedKeywords.push(condition)
      return {
        isEmergency: false,
        level: 'important',
        message: '⚠️ Needs professional medical evaluation',
        action: 'Schedule an appointment with your doctor soon',
        keywords: mentionedKeywords,
      }
    }
  }

  return {
    isEmergency: false,
    level: 'normal',
    message: '',
    action: '',
    keywords: [],
  }
}

// Generate warning message for display
export function getEmergencyWarning(level: EmergencyLevel): string {
  if (!level.isEmergency && level.level === 'normal') {
    return ''
  }

  if (level.level === 'critical') {
    return `${level.message}

${level.action}

If you are in immediate danger, hang up and dial 911.`
  }

  if (level.level === 'urgent') {
    return `${level.message}

${level.action}

Detected: ${level.keywords.join(', ')}`
  }

  return `${level.message}

${level.action}`
}

// Check if should disable normal chat flow
export function shouldBlockChat(level: EmergencyLevel): boolean {
  return level.level === 'critical' || level.level === 'urgent'
}

// Get follow-up message after emergency
export function getEmergencyFollowUp(level: EmergencyLevel): string {
  if (level.level === 'critical') {
    return 'Please seek emergency medical care immediately. I cannot provide adequate help for this situation.'
  }

  if (level.level === 'urgent') {
    return 'This requires urgent professional medical attention. Please contact your doctor or visit urgent care.'
  }

  return 'Please schedule an appointment with your healthcare provider soon to discuss this.'
}

// Safety keywords for different concerns
export const emergencyCategories = {
  cardiac: ['chest pain', 'heart attack', 'cardiac', 'arrhythmia'],
  respiratory: ['can\'t breathe', 'choking', 'asthma attack'],
  neurological: ['stroke', 'seizure', 'loss of consciousness'],
  trauma: ['severe bleeding', 'broken bone', 'crushing'],
  mental: ['suicidal', 'self harm', 'harming'],
  poison: ['poisoning', 'overdose', 'toxic'],
}
