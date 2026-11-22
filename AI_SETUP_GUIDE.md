# 🤖 Grok AI Integration Guide - Aroha Health Guidance

## Overview

This guide walks through the AI/NLP integration added to your Next.js health guidance app. The system now supports conversational AI-powered health guidance using the Grok API.

---

## 📦 What Was Added

### New Files Created

```
├── src/app/api/
│   ├── chat/route.ts           # Main chat API endpoint
│   └── analyze/route.ts         # Health analysis & recommendations
├── src/lib/
│   ├── nlp.ts                   # NLP utilities for symptom extraction
│   └── aiClient.ts              # AI client for chat management
├── src/hooks/
│   └── useHealthAnalysis.ts     # React hook for analysis
├── src/components/
│   └── ChatAssistantAI.tsx      # New conversational chat component
└── .env.local                   # Configuration file
```

### Dependencies Added

- `axios` - HTTP client (ready if needed)
- Next.js built-in `fetch` for API calls

---

## 🔑 Setup Instructions

### 1. Get Your Grok API Key

1. Visit [Grok API Console](https://console.grok.com)
2. Create an account or log in
3. Generate an API key
4. Copy your API key

### 2. Configure Environment Variables

**File**: `.env.local` (already created)

```bash
GROK_API_KEY=your_actual_grok_api_key_here
GROK_API_BASE_URL=https://api.grok.com/openai/v1
NEXT_PUBLIC_APP_NAME=Aroha Health Guidance
```

**Replace `your_actual_grok_api_key_here` with your real key.**

⚠️ **IMPORTANT**: Never commit `.env.local` to git (already in `.gitignore`)

### 3. Start Development Server

```bash
npm install  # Already done
npm run dev
```

Server runs at: http://localhost:3000

---

## 🎯 Key Features

### 1. **Conversational Chat**
- Users can type naturally
- AI responds with health guidance
- Full conversation history maintained

### 2. **NLP Symptom Extraction** (`src/lib/nlp.ts`)
- Automatically detects symptoms mentioned
- Extracts care preferences
- Identifies movement preferences
- Estimates worry level (1-5)
- Determines age cohort

### 3. **AI Client** (`src/lib/aiClient.ts`)
- Manages conversation state
- Sends messages to Grok API
- Maintains chat history
- Singleton pattern for consistency

### 4. **API Routes**

#### `/api/chat` - Conversational Chat
```typescript
POST /api/chat
{
  messages: [
    { role: "user", content: "I have back pain" }
  ],
  temperature: 0.7,
  max_tokens: 500
}
```

#### `/api/analyze` - Health Analysis
```typescript
POST /api/analyze
{
  symptoms: ["Back pain", "Fatigue"],
  worry: 4,
  cohort: "36–45",
  carePreferences: ["General physician"],
  movementPreferences: ["Yoga"]
}
```

---

## 🧠 How NLP Works

### Supported Symptoms
- Hair fall, Eyesight changes, Back pain
- Fatigue, Poor sleep, Stress
- Gut health, Mood swings, Thyroid, Blood pressure

### Supported Preferences
**Care**: General physician, Specialist, Mental health, Ayurveda, Nutrition, Physiotherapy, Lifestyle

**Movement**: Yoga, Gym, Walking, Swimming, Cycling, Pilates, High intensity

### Example
```
User: "I'm 35 and I've been having terrible back pain. 
       I'm pretty worried, maybe a 4 out of 5."

Extracted:
- symptoms: ["Back pain"]
- worry: 4
- cohort: "23–35"
```

---

## 🚀 Usage in Components

### Using the AI Chat Component

```tsx
import { ChatAssistantAI } from "@/components/ChatAssistantAI"

export default function MyPage() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <button onClick={() => setChatOpen(true)}>
        Open AI Chat
      </button>
      
      {chatOpen && (
        <ChatAssistantAI
          onClose={() => setChatOpen(false)}
          onComplete={(answers) => {
            console.log("Chat completed with:", answers)
          }}
          mode="ai"
        />
      )}
    </>
  )
}
```

### Using Health Analysis Hook

```tsx
import { useHealthAnalysis } from "@/hooks/useHealthAnalysis"

export function MyComponent() {
  const { analyze, loading, result } = useHealthAnalysis()

  const handleAnalyze = async () => {
    const analysis = await analyze({
      symptoms: ["Back pain", "Fatigue"],
      worry: 4,
      cohort: "36–45",
      carePreferences: ["General physician"],
      movementPreferences: ["Yoga"]
    })
    
    if (analysis) {
      console.log("Recommendation:", analysis.recommendation)
      console.log("Action items:", analysis.actionItems)
    }
  }

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && <p>{result.recommendation}</p>}
    </div>
  )
}
```

---

## 🔧 Customization

### Add New Symptoms

**File**: `src/lib/nlp.ts`

```typescript
const symptomKeywords: Record<string, string[]> = {
  'Your Symptom': ['keyword1', 'keyword2', 'keyword3'],
  // ... existing entries
}
```

### Modify AI Personality

**File**: `src/lib/nlp.ts` - `getHealthSystemPrompt()` function

```typescript
export function getHealthSystemPrompt(): string {
  return `You are Aroha, a ... 
          Your personality: ...
          Guidelines: ...`
}
```

### Change Temperature/Creativity

**Files**: `src/app/api/chat/route.ts` and `src/app/api/analyze/route.ts`

```typescript
temperature: 0.7,  // 0 = deterministic, 1 = creative
max_tokens: 500,   // Response length
```

---

## 🧪 Testing

### Test Chat API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "I have back pain"}
    ]
  }'
```

### Test Analysis API

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["Back pain"],
    "worry": 4,
    "cohort": "36–45",
    "carePreferences": ["General physician"],
    "movementPreferences": ["Yoga"]
  }'
```

### Test in Browser
1. Open http://localhost:3000
2. Click "Ask Aroha AI" button
3. Type a message like: "I have back pain and I'm worried"
4. Watch AI respond and extract symptoms automatically

---

## ⚠️ Important Notes

### API Rate Limits
- Grok API has rate limits per tier
- Monitor your usage in Grok dashboard
- Implement retry logic for production

### Error Handling
- API key validation happens on every request
- Check `.env.local` if getting 401 errors
- Look at browser console for errors
- Server logs at terminal where `npm run dev` runs

### HIPAA/Privacy
- Do NOT store actual patient data
- This is guidance only, not diagnosis
- Always recommend professional consultation
- Never store sensitive medical records

### Production Deployment

**Before deploying to production:**
1. Use environment variables only (never hardcode keys)
2. Implement rate limiting
3. Add authentication if needed
4. Add error logging/monitoring
5. Test with real Grok API quotas
6. Review Grok API pricing

---

## 🔄 Data Flow

```
User Types Message
        ↓
ChatAssistantAI Component
        ↓
extractHealthInfo() - Parse user input
        ↓
/api/chat endpoint
        ↓
Grok API (grok-2 model)
        ↓
Response returned
        ↓
Display in chat + store conversation
        ↓
Extract info from user message for display
```

---

## 📊 Types & Interfaces

### ChatMessage
```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
```

### ChatAnswers (from chat completion)
```typescript
interface ChatAnswers {
  cohort: string
  symptoms: string[]
  worry: number
  care: string[]
  movement: string[]
}
```

### ExtractedInfo (from NLP)
```typescript
interface ExtractedInfo {
  symptoms: string[]
  carePreferences: string[]
  movementPreferences: string[]
  worryLevel?: number
  cohort?: string
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
  recommendation: string
  actionItems: string[]
  warnings: string[]
  professionalAdvice: string
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API error: 401" | Check GROK_API_KEY in .env.local |
| "No response from AI" | Ensure API key is valid and active |
| Slow responses | Check Grok API status page |
| Symptoms not extracted | Add more keywords to symptomKeywords in nlp.ts |
| Chat not loading | Check browser console (F12) for errors |

---

## 📚 Next Steps

1. **Test the basic flow** - Open chat and talk to AI
2. **Customize NLP** - Add more symptoms/keywords for your region
3. **Enhance recommendations** - Modify AI prompt in `getHealthSystemPrompt()`
4. **Add database** - Store conversations and user profiles
5. **Add authentication** - Protect user data
6. **Deploy** - Push to production with proper env vars

---

## 📖 Resources

- [Grok API Docs](https://console.grok.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat/create) (Grok follows same API)

---

## 💡 Tips

1. **Keep system prompt focused** - Longer prompts use more tokens
2. **Use lower temperature for consistency** - 0.5-0.7 for health guidance
3. **Test different max_tokens** - Balance quality vs. speed
4. **Monitor API costs** - Grok charges per token
5. **Cache common responses** - Reduce API calls for FAQ-type questions

---

## 🎉 You're Ready!

Your health guidance app now has:
- ✅ Conversational AI chat
- ✅ NLP symptom extraction
- ✅ Personalized health analysis
- ✅ Grok API integration

Start with `npm run dev` and explore! 🚀
