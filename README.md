# 🎯 NexRound: AI-Powered Adaptive Mock Interview Simulator

NexRound is a full-stack, real-time AI-driven mock interview platform for technical roles. Practice with adaptive questioning, intelligent follow-ups, and comprehensive performance reports — powered by Google Gemini AI.

---

## ✨ Features

- **Secure Authentication** — JWT-based login and registration system.
- **Adaptive AI Questioning** — Questions dynamically adjust based on your answer quality.
- **Role-Based Interviews** — Frontend, Backend, Fullstack, DevOps, Data Science, ML/AI.
- **Multiple Interview Types** — Technical, Behavioral, System Design, Mixed.
- **Intelligent Follow-ups** — AI probes deeper with context-aware follow-up questions.
- **Live Timer & Progress** — Real interview pressure with countdown and question tracking.
- **Comprehensive Reports** — Score (0–100), strengths, improvements, sample answers, suggested topics.
- **Admin Dashboard** — Admins (Users view) can see all users, their interview stats, and full interview history.
- **Session History** — Users can review their own past interviews.
- **Production-Ready** — Security headers (Helmet), rate limiting, error boundaries, glassmorphism UI.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 |
| Auth | JWT (JSON Web Tokens) + LocalStorage |
| Styling | Vanilla CSS (Glassmorphism, Dark Theme) |
| Backend | Express.js 4 |
| Database | MongoDB (Mongoose ODM) |
| AI Engine | Google Gemini 2.0 Flash |
| Security | Helmet, express-rate-limit, Bcrypt.js |

---

## 📦 Installation

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local instance or [MongoDB Atlas](https://cloud.mongodb.com/) free tier)
- **Google Gemini API Key** ([Get one free](https://aistudio.google.com/apikey))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/subir-ghosh-au26/Mock-Interview-Simulator.git
cd Mock-Interview-Simulator

# 2. Install all dependencies (root + server + client)
npm run install:all

# 3. Configure environment variables
#    Create a .env file in the project root:
```

**.env** file (in project root):
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

```bash
# 4. Start development servers
npm run dev
```

The app will be running at: **http://localhost:5173**

---

## 🗄️ Database Schema

### User Model
Stored in `users` collection.
- `name`: Full name
- `email`: Unique email
- `password`: Hashed password (Bcrypt)
- `role`: 'user' | 'admin'
- `createdAt`: Timestamp

### Session Model
Stored in `sessions` collection.
- `sessionId`: UUIDv4
- `userId`: Reference to User model
- `role`: Target job role
- `difficulty`: Junior | Mid | Senior | Lead
- `interviewType`: Technical | Behavioral | etc.
- `questions`: Array of question-answer pairs with AI feedback
- `overallScore`: 0–10 (average)
- `percentageScore`: 0–100
- `status`: 'in-progress' | 'completed'
- `completedAt`: Timestamp

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in & get token
- `GET /api/auth/me` — Get current user info

### Interview
- `POST /api/interview/start` — Start session
- `POST /api/interview/evaluate` — Submit answer
- `POST /api/interview/report` — Finalize & score

### Admin (Restricted)
- `GET /api/admin/users` — List all users + stats
- `GET /api/admin/users/:id/sessions` — Get a user's full history

---

## 🎮 How to Use

1. **Register/Login** — Create an account to save your progress.
2. **Configure** — Select your role and difficulty level.
3. **Interview** — Answer AI-generated questions (Use **Ctrl+Enter** to submit).
4. **Review Report** — See your strengths and improvements.
5. **History/Admin** — Track your growth or monitor all users (if Admin).

---

## 📝 License

This project is for educational and demonstration purposes.
