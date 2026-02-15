# NexRound: AI-Powered Adaptive Mock Interview Simulator
## Development Documentation

---

## 1. Project Overview

**NexRound** is a real-time AI-powered mock interview platform for technical roles. The application features adaptive questioning, intelligent follow-ups, answer evaluation, comprehensive performance reports, and session history — all powered by Google Gemini AI.

> [!TIP]
> **Open Documentation**: For a deep dive into the AI logic and prompt engineering, see [The Prompt Blueprint](file:///d:/Subir/AI-Powered%20Adaptive%20Mock%20Interview%20Simulator/PROMPT_BLUEPRINT.md).

---

## 2. Tools & Technologies Used

| Category | Tool/Technology | Purpose |
|---|---|---|
| AI Coding Assistant | Google Gemini (Antigravity Agent) | AI pair-programming for code generation, debugging, and architecture |
| AI Model | Google Gemini 2.0 Flash | Question generation, evaluation, follow-ups, reports |
| Frontend | React 19 + Vite 7 | UI framework and build tool |
| Styling | Vanilla CSS | Custom dark theme with glassmorphism effects (NexRound Design System) |
| Backend | Express.js 4 (Node.js) | REST API server |
| Database | MongoDB + Mongoose | Session storage and schema management |
| Security | Helmet, express-rate-limit | HTTP security headers and API rate limiting |
| Authentication | JWT + Bcrypt.js | Secure user login and role-based access |

---

## 3. Database Schema

For detailed schema definitions, relationships, and validation rules, see [SCHEMA.md](file:///d:/Subir/AI-Powered%20Adaptive%20Mock%20Interview%20Simulator/SCHEMA.md).

### Core Collections:
- **Users**: Manages user profiles, credentials, and roles (user/admin).
- **Sessions**: Records interview details, questions asked, user answers, and AI-generated reports.

---

## 4. API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user and receive JWT.

### Interview Flow
- `POST /api/interview/start`: Initialize a new adaptive interview session.
- `POST /api/interview/evaluate`: Submit an answer for evaluation and get the next question.
- `GET /api/interview/report/:sessionId`: Generate and retrieve the final performance report.

### Sessions & History
- `GET /api/sessions`: List all sessions for the authenticated user.
- `GET /api/sessions/:sessionId`: Get full details of a specific session.

### Admin Tools
- `GET /api/admin/users`: (Admin only) List all registered users and their activity stats.
- `GET /api/admin/sessions`: (Admin only) View all interview sessions across the platform.

---

## 5. Development Method

### AI-Assisted Development (Agentic Coding)

The entire application was built through AI pair-programming using the Google Gemini Antigravity Agent. The development followed a structured workflow:

1. **Planning Phase** — The agent analyzed requirements, designed the architecture, and created a detailed implementation plan.
2. **Execution Phase** — Code was generated iteratively (Backend first, then Frontend, then Integration).
3. **Refinement** — Rebranded to **NexRound**, implemented Glassmorphism design system, and added production-grade security.

---

*Document prepared as part of the NexRound project submission.*
