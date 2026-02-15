# 🎯 AI-Powered Adaptive Mock Interview Simulator

A full-stack, real-time AI-driven mock interview platform for technical roles. Practice with adaptive questioning, intelligent follow-ups, and comprehensive performance reports — powered by Google Gemini AI.

---

## ✨ Features

- **Adaptive AI Questioning** — Questions dynamically adjust based on your answer quality
- **Role-Based Interviews** — Frontend, Backend, Fullstack, DevOps, Data Science, ML/AI
- **Multiple Interview Types** — Technical, Behavioral, System Design, Mixed
- **Intelligent Follow-ups** — AI probes deeper with context-aware follow-up questions
- **Live Timer & Progress** — Real interview pressure with countdown and question tracking
- **Comprehensive Reports** — Score (0–100), strengths, improvements, sample answers, suggested topics
- **Session History** — All interviews stored in MongoDB for review
- **Production-Ready** — Security headers, rate limiting, error boundaries, toast notifications

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 |
| Styling | Vanilla CSS (Glassmorphism, Dark Theme) |
| Backend | Express.js 4 |
| Database | MongoDB (Mongoose ODM) |
| AI Engine | Google Gemini 2.0 Flash |
| Security | Helmet, express-rate-limit |

---

## 📦 Installation

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local instance or [MongoDB Atlas](https://cloud.mongodb.com/) free tier)
- **Google Gemini API Key** ([Get one free](https://aistudio.google.com/apikey))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/AI-Powered-Adaptive-Mock-Interview-Simulator.git
cd AI-Powered-Adaptive-Mock-Interview-Simulator

# 2. Install all dependencies (root + server + client)
npm run install:all

# 3. Configure environment variables
#    Edit the .env file in the project root:
```

**.env** file (in project root):
```env
MONGODB_URI=mongodb://localhost:27017/mock-interview
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

> Replace `GEMINI_API_KEY` with your actual key.  
> For MongoDB Atlas, use your connection string as `MONGODB_URI`.

```bash
# 4. Start development servers (frontend + backend)
npm run dev
```

The app will be running at: **http://localhost:5173**

### Production Build

```bash
# Build optimized client bundle
npm run build

# Start production server (serves API + static client)
npm start
```

---

## 🗄️ Database Schema

The application uses a single MongoDB collection: `sessions`

### Session Document

```json
{
  "sessionId": "uuid-string (unique)",
  "role": "Frontend Developer | Backend Developer | ...",
  "difficulty": "Junior | Mid | Senior | Lead",
  "interviewType": "Technical | Behavioral | System Design | Mixed",
  "duration": 15,
  "totalQuestions": 6,
  "questions": [
    {
      "question": "Explain the virtual DOM in React...",
      "answer": "The virtual DOM is...",
      "score": 7,
      "feedback": "Good explanation, could mention...",
      "isFollowUp": false,
      "parentQuestionIndex": null
    }
  ],
  "overallScore": 7.0,
  "percentageScore": 70,
  "strengths": ["Clear communication", "Solid fundamentals", "Good examples"],
  "improvements": ["Deeper technical detail", "Edge cases", "Complexity analysis"],
  "sampleAnswers": [
    {
      "question": "Explain the virtual DOM...",
      "originalAnswer": "The virtual DOM is...",
      "improvedAnswer": "The virtual DOM is a lightweight..."
    }
  ],
  "suggestedTopics": ["React Fiber", "Reconciliation", "Performance Optimization"],
  "status": "in-progress | completed | abandoned",
  "startedAt": "2026-02-15T10:00:00Z",
  "completedAt": "2026-02-15T10:15:00Z"
}
```

### Mongoose Schema Definition

📂 [`server/models/Session.js`](server/models/Session.js)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/start` | Start a new interview session |
| `POST` | `/api/interview/evaluate` | Submit answer, get evaluation + next question |
| `POST` | `/api/interview/report` | Generate final performance report |
| `GET` | `/api/sessions` | List all completed sessions |
| `GET` | `/api/sessions/:id` | Get a specific session's details |
| `GET` | `/api/health` | Server health check |

---

## 📁 Project Structure

```
AI-Powered-Adaptive-Mock-Interview-Simulator/
├── .env                          # Environment variables
├── package.json                  # Root scripts (dev, build, start)
├── server/
│   ├── package.json
│   ├── server.js                 # Express server with helmet, rate limiter
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Session.js            # Mongoose session schema
│   ├── routes/
│   │   ├── interview.js          # Interview flow (start/evaluate/report)
│   │   └── sessions.js           # Session history
│   └── services/
│       └── aiService.js          # Gemini AI wrapper with retry logic
├── client/
│   ├── index.html                # HTML with SEO metadata
│   ├── vite.config.js            # Vite config with API proxy
│   └── src/
│       ├── App.jsx               # Root component
│       ├── main.jsx              # React entry point
│       ├── index.css             # Complete design system
│       ├── utils/
│       │   └── api.js            # Centralized API client
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation bar
│       │   ├── Timer.jsx         # Countdown timer with ring
│       │   ├── ProgressBar.jsx   # Question progress indicator
│       │   ├── ScoreGauge.jsx    # Circular score visualization
│       │   ├── Toast.jsx         # Toast notification system
│       │   └── ErrorBoundary.jsx # Error boundary
│       └── pages/
│           ├── ConfigPage.jsx    # Interview configuration
│           ├── InterviewPage.jsx # Live interview session
│           ├── ReportPage.jsx    # Performance report
│           └── HistoryPage.jsx   # Session history
```

---

## 🎮 How to Use

1. **Configure** — Select your role, difficulty level, interview type, and duration
2. **Interview** — Answer AI-generated questions one by one (use Ctrl+Enter to submit)
3. **Get Feedback** — Receive real-time scoring and feedback after each answer
4. **Review Report** — See your overall score, strengths, improvements, and sample answers
5. **Track Progress** — Review past interviews in the History section

---

## 📝 License

This project is for educational and demonstration purposes.
