# AI-Powered Adaptive Mock Interview Simulator
## Development Documentation

---

## 1. Project Overview

This document outlines the development of a real-time AI-powered mock interview platform for technical roles. The application features adaptive questioning, intelligent follow-ups, answer evaluation, comprehensive performance reports, and session history — all powered by Google Gemini AI.

---

## 2. Tools & Technologies Used

| Category | Tool/Technology | Purpose |
|---|---|---|
| AI Coding Assistant | Google Gemini (Antigravity Agent) | AI pair-programming for code generation, debugging, and architecture |
| AI Model | Google Gemini 2.0 Flash | Question generation, evaluation, follow-ups, reports |
| Frontend | React 19 + Vite 7 | UI framework and build tool |
| Styling | Vanilla CSS | Custom dark theme with glassmorphism effects |
| Backend | Express.js 4 (Node.js) | REST API server |
| Database | MongoDB + Mongoose | Session storage and schema management |
| Security | Helmet, express-rate-limit | HTTP security headers and API rate limiting |
| Version Control | Git + GitHub | Source code management |

---

## 3. Development Method

### AI-Assisted Development (Agentic Coding)

The entire application was built through AI pair-programming using the Google Gemini Antigravity Agent. The development followed a structured workflow:

1. **Planning Phase** — The agent analyzed requirements, designed the architecture, and created a detailed implementation plan that was reviewed and approved before coding began.

2. **Execution Phase** — Code was generated iteratively:
   - Backend first (Express server, MongoDB models, AI service, API routes)
   - Frontend scaffolding (Vite + React)
   - UI components and pages
   - Integration and styling

3. **Debugging Phase** — The agent identified and fixed issues including:
   - Gemini API rate limiting (429 errors) → Added exponential backoff retry logic
   - Vite interactive prompts during scaffolding → Resolved with manual input
   - Production build errors (terser dependency) → Switched to esbuild minifier

4. **Production Hardening** — Upgraded the MVP to production quality:
   - Added security middleware (helmet, rate limiting)
   - Replaced all alert() calls with toast notification system
   - Added error boundaries, keyboard shortcuts, loading states
   - Centralized API client to eliminate hardcoded URLs
   - Added SEO metadata and production build optimization

---

## 4. Prompts Used

### Prompt 1 — Initial Build Request
```
Build a real-time AI-driven mock interview platform for technical roles.

Users select Role, Difficulty, Interview Type, and Duration before starting.

AI conducts a timed, adaptive interview session (question-by-question).

Questions dynamically adjust based on answer quality + difficulty level.

AI asks at least one intelligent follow-up during the session.

Include live timer + progress tracking (e.g., Question 3 of 8).

At completion, generate a structured performance report including:
- Overall Score (0–10 / 0–100)
- 3 Strengths
- 3 Improvement Areas
- 2 Improved Sample Answers
- Suggested Next Practice Topics

Store interview session history in database.

AI must handle:
- Question generation
- Follow-up logic
- Answer evaluation
- Feedback + scoring
```

**Result:** The agent created a complete implementation plan, then built the full-stack application from scratch — Express backend with MongoDB, React frontend with Vite, Gemini AI integration with adaptive questioning and report generation.

### Prompt 2 — Debugging Rate Limits
```
[Screenshot showing 500 Internal Server Error on POST /api/interview/start]
```

**Result:** The agent identified Gemini API 429 rate limiting as the root cause, added callWithRetry() wrapper with exponential backoff to all four AI service calls, and increased retry delays to match Gemini's cooldown period.

### Prompt 3 — Production Upgrade
```
make it real production ready web app
```

**Result:** Comprehensive upgrade including Vite API proxy, centralized API client, helmet security headers, express-rate-limit, Navbar component, Toast notification system, ErrorBoundary, keyboard shortcuts, feature highlights, grade labels, and production build with vendor chunk splitting.

---

## 5. Steps Followed

### Step 1: Requirements Analysis & Planning
- Analyzed all requirements from the initial prompt
- Designed full-stack architecture (React + Express + MongoDB + Gemini)
- Created detailed implementation plan with file-by-file changes
- Got user approval before proceeding

### Step 2: Backend Development
- Created Express.js server with CORS support
- Defined MongoDB/Mongoose schema for interview sessions
- Built AI service wrapper for Google Gemini API with:
  - Question generation with role/difficulty context
  - Follow-up question generation based on previous answers
  - Answer evaluation with scoring (0-10) and feedback
  - Comprehensive report generation (strengths, improvements, sample answers)
- Implemented interview routes with adaptive difficulty logic:
  - Score >= 8 → increase difficulty
  - Score <= 4 → decrease difficulty
  - Follow-up triggered after 2+ answers with mid-range scores

### Step 3: Frontend Development
- Scaffolded React app with Vite (React template)
- Built 4 pages:
  - **ConfigPage** — Role, difficulty, type, duration selection
  - **InterviewPage** — Live interview with timer, progress, answer input
  - **ReportPage** — Score gauge, strengths/improvements, sample answers, topics
  - **HistoryPage** — Past session cards with scores and details
- Built reusable components: Timer (SVG ring), ProgressBar (step indicators), ScoreGauge (circular)
- Implemented complete CSS design system with dark theme and glassmorphism

### Step 4: Debugging & Error Handling
- Diagnosed Gemini API 429 rate limiting errors
- Implemented retry logic with exponential backoff
- Added user-friendly error messages throughout

### Step 5: Production Hardening
- Added Vite API proxy (eliminates CORS issues)
- Created centralized API client
- Added Navbar with active state navigation
- Built Toast notification system (replaced all alert() calls)
- Added ErrorBoundary for crash prevention
- Added keyboard shortcuts (Enter, Ctrl+Enter)
- Added helmet security headers and API rate limiting
- Configured production build with esbuild minification and vendor chunking
- Added SEO metadata, Open Graph tags, and emoji favicon

### Step 6: Build Verification
- Ran production build: 52 modules, 595ms, clean output
- Verified dev servers start correctly
- Confirmed MongoDB connection and API health endpoint

---

## 6. Database Schema

**Collection:** `sessions`

| Field | Type | Description |
|---|---|---|
| sessionId | String (UUID) | Unique session identifier |
| role | String | Target job role |
| difficulty | String | Junior / Mid / Senior / Lead |
| interviewType | String | Technical / Behavioral / System Design / Mixed |
| duration | Number | Interview duration in minutes |
| totalQuestions | Number | Expected number of questions |
| questions | Array | Array of question objects (see below) |
| overallScore | Number | Final score (0-10) |
| percentageScore | Number | Final score (0-100) |
| strengths | Array[String] | 3 identified strengths |
| improvements | Array[String] | 3 areas for improvement |
| sampleAnswers | Array[Object] | 2 improved sample answers |
| suggestedTopics | Array[String] | Recommended practice topics |
| status | String | in-progress / completed / abandoned |
| startedAt | Date | Session start timestamp |
| completedAt | Date | Session completion timestamp |

**Question Sub-document:**

| Field | Type | Description |
|---|---|---|
| question | String | The interview question |
| answer | String | User's answer |
| score | Number | AI evaluation score (0-10) |
| feedback | String | AI feedback on the answer |
| isFollowUp | Boolean | Whether this is a follow-up question |
| parentQuestionIndex | Number | Index of parent question (for follow-ups) |

---

## 7. Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                │
│   ConfigPage → InterviewPage → ReportPage → HistoryPage  │
│                 ↓ API calls via /api proxy ↓              │
├─────────────────────────────────────────────────────────┤
│                    BACKEND (Express.js)                    │
│   Routes: /interview/start, /evaluate, /report            │
│   Security: Helmet, Rate Limiter, CORS                   │
│           ↓                         ↓                     │
│   ┌───────────────┐    ┌──────────────────────┐         │
│   │   MongoDB      │    │   Google Gemini AI    │         │
│   │   (Sessions)   │    │   (Question Gen,      │         │
│   │                │    │    Evaluation,         │         │
│   │                │    │    Reports)            │         │
│   └───────────────┘    └──────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

*Document prepared as part of the AI-Powered Adaptive Mock Interview Simulator project submission.*
