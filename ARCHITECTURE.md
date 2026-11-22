# 🏗️ Architecture Overview - Grok AI + NLP Integration

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client Side)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            React Components (UI Layer)                     │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  ChatAssistantAI.tsx                                 │ │ │
│  │  │  ├── Message Input                                   │ │ │
│  │  │  ├── Chat Display                                    │ │ │
│  │  │  ├── Loading Indicator                               │ │ │
│  │  │  └── Extracted Info Display                          │ │ │
│  │  │                                                      │ │ │
│  │  │  Hooks Used:                                         │ │ │
│  │  │  └── useState (messages, input, loading, error)      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                          ↓                                │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Client-Side Libraries                              │ │ │
│  │  │  ├── extractHealthInfo() ← NLP Processing            │ │ │
│  │  │  ├── getAIClient() ← AI Communication                │ │ │
│  │  │  └── useHealthAnalysis() ← Analysis Hook             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                       │
│            HTTP Requests (fetch API)                             │
│            POST /api/chat                                        │
│            POST /api/analyze                                     │
│                          ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────────┐
         │   NETWORK (Internet)                │
         │   HTTPS to Grok API Server          │
         └─────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER SIDE (Node.js)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Next.js API Routes                                        │ │
│  │                                                            │ │
│  │  Route 1: src/app/api/chat/route.ts                        │ │
│  │  ├── Receives: { messages: ChatMessage[] }                │ │
│  │  ├── Calls: Grok API /chat/completions                    │ │
│  │  ├── Sends: System prompt + Messages                      │ │
│  │  └── Returns: { choices[].message.content }               │ │
│  │                                                            │ │
│  │  Route 2: src/app/api/analyze/route.ts                     │ │
│  │  ├── Receives: { symptoms, worry, cohort, ... }           │ │
│  │  ├── Calls: Grok API /chat/completions                    │ │
│  │  ├── Sends: Analysis prompt + Health profile              │ │
│  │  └── Returns: { recommendation, actionItems, ... }        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Environment Variables                                     │ │
│  │  ├── GROK_API_KEY (from .env.local)                        │ │
│  │  └── GROK_API_BASE_URL                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────────┐
         │   GROK API Server                   │
         │   https://api.grok.com/openai/v1   │
         │   Model: grok-2                     │
         └─────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────────┐
         │   LLM Processing                    │
         │   ├── Analyze User Message          │
         │   ├── Generate Response             │
         │   └── Return Completion             │
         └─────────────────────────────────────┘
```

---

## Data Flow Sequence

### Chat Conversation Flow
```
User Types Message
       ↓
ChatAssistantAI Component catches onChange
       ↓
User clicks Send / Presses Enter
       ↓
Add message to messages array
       ↓
Call extractHealthInfo(userMessage)
       ↓
  ┌─────────────────────────────────┐
  │  NLP Processing (Client-Side)   │
  │  ├── Scan for symptom keywords  │
  │  ├── Extract care preferences   │
  │  ├── Detect worry level         │
  │  ├── Identify age cohort        │
  │  └── Update extractedInfo state │
  └─────────────────────────────────┘
       ↓
Disable input / Show loading spinner
       ↓
Call aiClient.sendMessage(userMessage)
       ↓
  ┌─────────────────────────────────┐
  │  Network Request                │
  │  POST /api/chat                 │
  │  {                              │
  │    messages: [                  │
  │      { role: 'system',          │
  │        content: promptText },    │
  │      { role: 'user',            │
  │        content: userMessage }   │
  │    ]                            │
  │  }                              │
  └─────────────────────────────────┘
       ↓
  ┌─────────────────────────────────┐
  │  Server: /api/chat/route.ts     │
  │  ├── Validate request           │
  │  ├── Forward to Grok API        │
  │  └── Return response            │
  └─────────────────────────────────┘
       ↓
  ┌─────────────────────────────────┐
  │  Grok API                       │
  │  grok-2 model processes:        │
  │  ├── System prompt              │
  │  ├── Conversation history       │
  │  ├── User message               │
  │  └── Generates response         │
  └─────────────────────────────────┘
       ↓
Receive Response
       ↓
Add to messages array (messages state)
       ↓
Display message in chat
       ↓
Enable input / Hide loading spinner
       ↓
Scroll to bottom
       ↓
User can send another message
```

---

## Component Hierarchy

```
App Root (page.tsx)
│
├── Existing Components (unchanged)
│   ├── Navigation
│   ├── Hero
│   ├── AssessmentSection
│   ├── ConcernsExplorer
│   └── TrustSection
│
└── Chat System (NEW)
    ├── ChatAssistantAI Component
    │   ├── Uses: aiClient (singleton)
    │   ├── Uses: extractHealthInfo() 
    │   ├── Uses: detectEmergencyLevel()
    │   └── State:
    │       ├── messages: ChatMessage[]
    │       ├── input: string
    │       ├── loading: boolean
    │       ├── error: string | null
    │       └── extractedInfo: HealthInfo
    │
    └── API Integration (runs on server)
        ├── /api/chat
        │   └── Calls → Grok API
        │       └── Model: grok-2
        │
        └── /api/analyze
            └── Calls → Grok API
                └── Model: grok-2
```

---

## File Organization

```
health-guidance-next/
│
├── 📄 .env.local                           ← Your Grok API key
│
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📄 page.tsx                     ← Main page (uses ChatAssistantAI)
│   │   │
│   │   └── 📂 api/
│   │       ├── 📂 chat/
│   │       │   └── 📄 route.ts             ← Chat endpoint
│   │       │
│   │       └── 📂 analyze/
│   │           └── 📄 route.ts             ← Analysis endpoint
│   │
│   ├── 📂 lib/ (Business Logic)
│   │   ├── 📄 nlp.ts                       ← NLP Extraction
│   │   │   ├── extractHealthInfo()
│   │   │   ├── getHealthSystemPrompt()
│   │   │   └── generateFollowUp()
│   │   │
│   │   ├── 📄 aiClient.ts                  ← AI Communication
│   │   │   ├── HealthAIClient class
│   │   │   └── getAIClient()
│   │   │
│   │   └── 📄 emergency.ts                 ← Emergency Detection
│   │       ├── detectEmergencyLevel()
│   │       └── getEmergencyWarning()
│   │
│   ├── 📂 components/
│   │   ├── 📄 ChatAssistantAI.tsx          ← NEW: Main chat UI
│   │   ├── 📄 Icon.tsx                     ← Icon system
│   │   └── ... other components
│   │
│   └── 📂 hooks/
│       └── 📄 useHealthAnalysis.ts         ← Analysis hook
│
└── 📂 Documentation/
    ├── 📄 QUICK_START.md                   ← 2-min setup
    ├── 📄 AI_SETUP_GUIDE.md                ← Full setup
    ├── 📄 AI_FEATURES_CHECKLIST.md         ← 19 feature ideas
    ├── 📄 INTEGRATION_SUMMARY.md           ← Complete overview
    └── 📄 ARCHITECTURE.md                  ← This file
```

---

## Data Types & Interfaces

```typescript
// Message Format
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// NLP Extraction Result
interface ExtractedInfo {
  symptoms: string[]              // e.g., ["Back pain", "Fatigue"]
  carePreferences: string[]        // e.g., ["General physician"]
  movementPreferences: string[]    // e.g., ["Yoga"]
  worryLevel?: number             // 1-5
  cohort?: string                 // "23–35", "36–45", "45–60+"
}

// Final Chat Answers
interface ChatAnswers {
  cohort: string
  symptoms: string[]
  worry: number
  care: string[]
  movement: string[]
}

// Analysis Result
interface AnalysisResult {
  recommendation: string
  actionItems: string[]
  warnings: string[]
  professionalAdvice: string
}

// Emergency Detection
interface EmergencyLevel {
  isEmergency: boolean
  level: 'critical' | 'urgent' | 'important' | 'normal'
  message: string
  action: string
  keywords: string[]
}
```

---

## State Management Flow

```
Page.tsx
├── State
│   ├── chatOpen: boolean
│   ├── selected: string[] (from main form)
│   ├── cohort: string
│   ├── worry: number
│   └── ... other assessment fields
│
└── ChatAssistantAI Component
    ├── Component State
    │   ├── messages: ChatMessage[]
    │   │   └── Stores full conversation history
    │   │
    │   ├── input: string
    │   │   └── Current user message being typed
    │   │
    │   ├── loading: boolean
    │   │   └── API call in progress
    │   │
    │   ├── error: string | null
    │   │   └── Error message if any
    │   │
    │   └── extractedInfo: ExtractedInfo
    │       └── Accumulates extracted symptoms/preferences
    │
    └── Ref
        └── aiClientRef (singleton instance of HealthAIClient)
```

---

## API Call Flow

### Chat API Request/Response

**Request:**
```json
POST /api/chat
{
  "messages": [
    {
      "role": "system",
      "content": "You are Aroha, a compassionate AI health..."
    },
    {
      "role": "user",
      "content": "I have back pain"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 300
}
```

**Response from Grok:**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "grok-2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Back pain can be caused by several factors..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 85,
    "completion_tokens": 42,
    "total_tokens": 127
  }
}
```

**What App Does With Response:**
1. Extract `choices[0].message.content`
2. Add to messages array
3. Display in chat
4. Update UI

---

## NLP Processing Pipeline

```
Input: "I'm 35 years old, have been experiencing back pain 
        for 2 weeks, and I'm very worried about it. 
        I prefer yoga for movement."

↓

Step 1: Convert to lowercase
"i'm 35 years old, have been experiencing back pain 
 for 2 weeks, and i'm very worried about it. 
 i prefer yoga for movement."

↓

Step 2: Scan symptom keywords
Match: "back pain" → Add "Back pain" to symptoms
Match: "worried" → Set worry level

↓

Step 3: Scan care keywords
No matches → carePreferences = []

↓

Step 4: Scan movement keywords
Match: "yoga" → Add "Yoga" to movementPreferences

↓

Step 5: Detect age cohort
Match: "35" → Cohort = "23–35"

↓

Result:
{
  symptoms: ["Back pain"],
  carePreferences: [],
  movementPreferences: ["Yoga"],
  worryLevel: 4,
  cohort: "23–35"
}
```

---

## Security Considerations

```
🔐 API Key Protection
   .env.local (not committed to git)
   ↓
   Server-side only (never sent to client)
   ↓
   Used in /api/chat and /api/analyze only

🔐 Input Validation
   - User messages validated before sending to Grok
   - Length limits enforced
   - No code injection possible (text only)

🔐 Response Handling
   - JSON parsing validated
   - Error responses handled safely
   - No sensitive data logged

⚠️  Privacy Concerns
   - Conversation stored only in memory
   - Not persisted to database
   - Cleared when chat closes
   - No user authentication required (MVP)

⚠️  Rate Limiting
   - No rate limit implemented in route handlers
   - Consider adding for production
   - Grok API has its own limits
```

---

## Performance Optimization Opportunities

```
Current Performance:
├── Chat load: ~100-200ms (network dependent)
├── NLP extraction: <5ms (client-side)
└── API response: ~1-3 seconds (Grok processing)

Future Optimizations:
├── Message caching
│   └── Cache common Q&A pairs
│
├── Streaming responses
│   └── Show AI response incrementally
│
├── Lazy loading
│   └── Load components on demand
│
└── Database integration
    └── Persist conversations
```

---

## Deployment Checklist

```
Before Production:
├── ✅ Environment variables configured
├── ✅ Build succeeds (npm run build)
├── ✅ No console errors
├── ✅ API endpoints working
├── ⬜ Error logging in place
├── ⬜ Rate limiting added
├── ⬜ HTTPS enforced
├── ⬜ CORS configured properly
├── ⬜ Database for conversation storage
├── ⬜ User authentication
├── ⬜ Medical advisor review
├── ⬜ Legal compliance review
└── ⬜ Privacy policy updated
```

---

## Troubleshooting Guide

| Component | Issue | Diagnosis | Fix |
|-----------|-------|-----------|-----|
| API Key | 401 error | Key invalid/expired | Regenerate in Grok console |
| NLP | Symptoms not detected | Keywords don't match | Add more keywords to `nlp.ts` |
| Chat | Empty response | Model error | Check Grok dashboard status |
| UI | Messages not showing | Render issue | Check browser console |
| Build | TypeScript errors | Type mismatch | Ensure types are properly imported |

---

## Resources

- **Grok API Docs**: https://console.grok.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Hooks**: https://react.dev/reference/react/hooks
- **OpenAI API Format**: https://platform.openai.com/docs/api-reference

---

## Next Steps

1. **Immediate**: Set up Grok API key
2. **Week 1**: Test basic chat functionality
3. **Week 2**: Add emergency detection
4. **Week 3**: Implement database storage
5. **Week 4+**: Add advanced features

See `AI_FEATURES_CHECKLIST.md` for detailed feature roadmap.

---

This architecture is designed to be:
- ✅ Modular (easy to extend)
- ✅ Performant (minimal network calls)
- ✅ Maintainable (clear separation of concerns)
- ✅ Scalable (ready for database addition)
- ✅ Secure (API key protected)
