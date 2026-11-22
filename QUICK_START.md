# ⚡ Quick Start - Grok AI + NLP Integration

## 🎯 Get Running in 2 Minutes

### Step 1: Get API Key
```
1. Visit: https://console.grok.com
2. Sign up → Create API Key
3. Copy your API key
```

### Step 2: Configure
```bash
# Edit .env.local (file already exists)
GROK_API_KEY=paste_your_key_here
```

### Step 3: Run
```bash
npm run dev
```

### Step 4: Test
1. Open http://localhost:3000
2. Click **"Ask Aroha AI"** button (bottom right)
3. Type: **"I have back pain and I'm worried"**
4. Watch AI respond + automatically extract symptoms ✨

---

## 📂 What's New (Files Added)

```
✅ .env.local                      - Config file for API key
✅ src/app/api/chat/route.ts       - Chat API endpoint
✅ src/app/api/analyze/route.ts    - Analysis API endpoint
✅ src/lib/nlp.ts                  - NLP extraction logic
✅ src/lib/aiClient.ts             - AI client
✅ src/lib/emergency.ts            - Emergency detection
✅ src/components/ChatAssistantAI.tsx - New chat component
✅ src/hooks/useHealthAnalysis.ts  - React hook
✅ AI_SETUP_GUIDE.md               - Full setup guide
✅ AI_FEATURES_CHECKLIST.md        - All possible features
✅ INTEGRATION_SUMMARY.md          - Complete overview
```

---

## 🧠 What It Does

**User Types:**
```
"I have back pain for 2 weeks and I'm very worried"
```

**AI Automatically Extracts:**
- ✅ Symptom: Back pain
- ✅ Worry Level: 5/5 (from "very worried")
- ✅ Shows in chat interface

**AI Responds:**
```
"Back pain can be caused by several factors... 
You might benefit from seeing an orthopedic specialist 
or starting with your general physician..."
```

**Then Displays:**
```
Symptoms mentioned: Back pain
Care preferences: [empty - waiting for more input]
```

---

## 💻 Code Examples

### Add Chat to Your Page
```tsx
import { ChatAssistantAI } from "@/components/ChatAssistantAI"
import { useState } from "react"

export default function MyPage() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <button onClick={() => setChatOpen(true)}>
        💬 Chat with AI
      </button>
      
      {chatOpen && (
        <ChatAssistantAI
          onClose={() => setChatOpen(false)}
          onComplete={(answers) => {
            // answers contains: symptoms, worry, cohort, care, movement
          }}
        />
      )}
    </>
  )
}
```

### Use Health Analysis
```tsx
import { useHealthAnalysis } from "@/hooks/useHealthAnalysis"

function MyComponent() {
  const { analyze, result } = useHealthAnalysis()

  const handleClick = async () => {
    await analyze({
      symptoms: ["Back pain"],
      worry: 4,
      cohort: "36–45",
      carePreferences: ["General physician"],
      movementPreferences: ["Yoga"]
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Analyze</button>
      {result && <p>{result.recommendation}</p>}
    </div>
  )
}
```

---

## 🔧 Customization (5 Minutes)

### Add New Symptoms
**File:** `src/lib/nlp.ts` (line 2-20)

```typescript
// Add this inside symptomKeywords object:
'Joint pain': ['joint pain', 'arthritis', 'stiff joints'],
```

### Change AI Personality
**File:** `src/lib/nlp.ts` (line 90-110)

```typescript
export function getHealthSystemPrompt(): string {
  return `You are Aroha, your personality here...`
}
```

### Adjust Response Length
**Files:** `src/app/api/chat/route.ts` and `src/app/api/analyze/route.ts`

```typescript
max_tokens: 500  // Higher = longer responses = more cost
temperature: 0.7 // 0 = consistent, 1 = creative
```

---

## 🧪 Testing

### Browser Test
```
1. npm run dev
2. http://localhost:3000
3. Click "Ask Aroha AI"
4. Type test messages:
   - "I have back pain"
   - "I'm very stressed and can't sleep"
   - "chest pain and difficulty breathing" (should warn)
5. Watch extraction happen automatically
```

### API Test
```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"back pain"}]}'

# Test analysis endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms":["Back pain"],
    "worry":4,
    "cohort":"36–45",
    "carePreferences":["General physician"],
    "movementPreferences":["Yoga"]
  }'
```

---

## ⚠️ Important

✅ **What Works:**
- Conversational AI chat
- Automatic symptom extraction
- Health guidance responses
- Conversation memory
- Emergency detection

❌ **What It's NOT:**
- Medical diagnosis tool
- Doctor replacement
- Emergency service
- Professional medical advice

🛡️ **Safety:**
- Always recommend professional consultation
- Flag emergencies to 911
- Never store patient data
- Always include disclaimers

---

## 📚 More Info

Need more details? Read:
- `AI_SETUP_GUIDE.md` - Full technical guide
- `AI_FEATURES_CHECKLIST.md` - All possible features (19 ideas!)
- `INTEGRATION_SUMMARY.md` - Complete overview

---

## ✅ Checklist

- [ ] Get Grok API key from https://console.grok.com
- [ ] Add key to `.env.local`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Click "Ask Aroha AI"
- [ ] Type a test message
- [ ] See AI respond + extraction happen

---

## 🚀 That's It!

Your app now has full AI + NLP capabilities. Start experimenting!

Questions? Check the docs:
- Setup: `AI_SETUP_GUIDE.md`
- Features: `AI_FEATURES_CHECKLIST.md`
- Overview: `INTEGRATION_SUMMARY.md`

Happy building! 🎉
