# NexRound: Development Report

## 1. Project Overview
**NexRound** is an AI-powered mock interview simulator designed to help job seekers practice technical and behavioral interviews in a realistic, adaptive environment. The platform uses Generative AI (Google Gemini) to dynamically generate questions based on the user's role and performance, providing instant feedback and detailed reports.

---

## 2. Steps Followed

### Phase 1: Foundation & Core Logic
- **Monorepo Setup:** Structured the project with separate `client/` and `server/` directories managed by a root `package.json`.
- **Database Integration:** Integrated MongoDB Atlas for persistent storage of interview sessions.
- **AI Service Implementation:** Built a dedicated `aiService.js` to handle communication with Google Gemini, including prompt engineering for adaptive follow-ups.
- **Interview Workflow:** Developed the logic for starting a session, evaluating answers, and generating comprehensive reports.

### Phase 2: UI/UX & Aesthetics
- **NexRound Design System:** Implemented a modern "Glassmorphism" theme using Vanilla CSS, featuring dark mode, blurred backgrounds, and neon accents.
- **Dynamic Visuals:** Created custom components like the **Score Gauge**, **Circular Timer**, and **Animated Progress Bar** to enhance the user experience.
- **Rebranding:** Renamed the project from "Mock-Interview-Simulator" to **NexRound** for a premium feel.

### Phase 3: Security & Performance
- **Production Hardening:** Added `helmet` for security headers and `express-rate-limit` to prevent API abuse.
- **Production Routing:** Integrated Vite's production build into the Express server to serve the entire app from a single port.
- **Error Handling:** Implemented a global Error Boundary and Toast notification system.

### Phase 4: Authentication & Admin Features
- **User Auth:** Built a JWT-based authentication system (Bcrypt.js for hashing, protected routes in React).
- **History Management:** Linked interview sessions to users so history is personal and secure.
- **Admin Users Dashboard:** Created a specialized "Users" view for admins to monitor all user activity, interview stats, and full drill-down history.

---

## 3. Prompts Used (Key Examples)

The development was guided by specific technical prompts to ensure high-quality AI behavior:

- **Initial Question Generation:** *"You are an expert interviewer. Generate a technical interview question for a [Role] at [Difficulty] level focused on [Topic]..."*
- **Adaptive Evaluation:** *"Analyze the following user answer. Score it (0-10) and provide specific feedback. Based on the quality, decide if the next question should be a deep-dive follow-up or a new topic..."*
- **Final Report Generation:** *"Summarize the entire interview session. Identify top 3 strengths, top 3 areas for improvement, and generate sample answers for the questions missed..."*

---

## 4. Tools & Technologies Used

### Frontend
- **React 19:** Functional components and hooks for state management.
- **Vite 7:** Fast development server and optimized build tool.
- **React Router:** SPA routing with authentication guards.

### Backend
- **Node.js & Express:** Scalable API layer.
- **Mongoose:** Object Data Modeling (ODM) for MongoDB.
- **JWT:** Secure token-based authentication.

### AI & DevOps
- **Google Gemini 2.0 Flash:** High-speed LLM for real-time interview interactions.
- **Git/GitHub:** Version control and repository management.
- **Concurrent.js:** Running dev servers simultaneously.

---

## 5. Development Method
The project followed an **Iterative AI-Assisted Development** approach:

1.  **AI Pairing:** Using advanced AI agents for code generation, refactoring, and complex logic orchestration.
2.  **Aesthetics-First UI:** Prioritizing visual excellence (Glassmorphism) to create a professional, engaging interface.
3.  **Security-by-Design:** Integrating middleware like Helmet and rate-limiters from the start.
4.  **Full-Stack Cohesion:** Ensuring tight integration between the MongoDB schema, Express API, and React state.

---

## 6. Database Schema Summary

The database uses MongoDB with two primary collections: `Users` and `Sessions`. For full technical specifications, field types, and entity relationship diagrams, please refer to the dedicated [SCHEMA.md](file:///d:/Subir/AI-Powered%20Adaptive%20Mock%20Interview%20Simulator/SCHEMA.md) file.

---
*Report Generated: February 15, 2026*
