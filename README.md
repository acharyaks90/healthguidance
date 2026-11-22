# Aroha Health Guidance App - Next.js Version

A modern health guidance application built with **Next.js 14+**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

## 🎯 Overview

This is a Next.js conversion of the original Vite + React application. The app provides:

- 🏥 Multi-step health assessment wizard
- 💬 AI-powered chat assistant for guided health conversations
- 🎯 Personalized health recommendations
- 👨‍⚕️ Expert-reviewed clinical pathways
- 📋 Customizable care plans based on user preferences

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main application page (client component)
│   └── globals.css         # Global styles & design system
│
└── components/
    ├── Icon.tsx            # Reusable SVG icon system (15 icons)
    ├── Navigation.tsx       # Top navigation bar
    ├── Hero.tsx            # Hero section with search & symptoms
    ├── Assessment.tsx      # Multi-step wizard (Steps 1-3)
    ├── Recommendation.tsx  # Final guidance display (Step 4)
    ├── AssessmentSection.tsx  # Wrapper for assessment flow
    ├── ChatAssistant.tsx   # Chat modal with AI flow
    ├── ConcernsExplorer.tsx # Concern cards section
    └── TrustSection.tsx    # Expert panel & trust section
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm or npm

### Installation

```bash
cd health-guidance-next
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 🎨 Design System

### Colors (CSS Variables)
- **Primary**: `--teal` (#17695f) - Action buttons and accents
- **Background**: `--cream` (#faf9f5) - Main background
- **Text**: `--ink` (#18312e) - Primary text
- **Muted**: `--muted` (#667a76) - Secondary text
- **Accent**: `--peach` (#f6e5d9) - Warnings and special UI
- **Secondary Background**: `--mint` (#e5f3ee) - Hover states

### Typography
- **Serif Font**: DM Serif Display (headings)
- **Sans Font**: Manrope (body & UI text)

## 📱 Component Architecture

### State Management
All state is managed at the root level in `page.tsx`.

### Component Props
All components receive props via function parameters with TypeScript interfaces.

## 🛠️ Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4 + Custom CSS
- **UI**: React 19 with client components

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Build & Run
```bash
npm run build
npm start
```

---

**Ready to run?** Start with `npm install && npm run dev`
