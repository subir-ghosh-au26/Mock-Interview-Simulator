# NexRound: The Prompt Blueprint 🚀

This document reveals the "brain" of NexRound. It details the precise prompt engineering and logical flows that power our AI-driven interview experience using Google Gemini 2.0 Flash.

---

## 1. The Core Philosophy
NexRound uses **Instructional Roleplay** and **Context Injection**. The AI is never just "chatting"; it is strictly bound to the persona of a *Senior Technical Interviewer* with specific rules for brevity, technical depth, and adaptive difficulty.

---

## 2. Blueprint 1: Dynamic Question Generation
Used to start the interview and generate subsequent questions based on performance.

### Logic:
- **Context Injection**: Role, Level (Junior-Lead), and Interview Type (Technical/Behavioral).
- **History Awareness**: Injects previous questions and their scores to ensure no rotation and appropriate complexity scaling.

### The Template:
```text
You are a senior technical interviewer conducting a {interviewType} interview for a {difficulty}-level {role} position.

{Previous questions and scores if any...}

Generate a NEW question that hasn't been asked yet. Adjust complexity based on candidate performance.

Rules:
- For {difficulty} level, ask appropriately challenging questions
- Question should be relevant to {role} and {interviewType}
- Be specific and practical, not overly abstract
- Question should be answerable in 1-3 minutes

Respond with ONLY the question text, nothing else.
```

---

## 3. Blueprint 2: Intelligent Deep-Dive (Follow-up)
Triggered when a candidate provides an answer that warrants further probing.

### Logic:
- **Proximity Analysis**: Focuses specifically on the *last* answer provided.
- **Surface-Level Breakout**: Explicitly instructed to test understanding "beyond surface-level knowledge."

### The Template:
```text
The candidate was asked: "{originalQuestion}"
Their answer was: "{answer}"

Generate ONE intelligent follow-up question that:
- Probes deeper into their answer
- Tests understanding beyond surface-level knowledge
- Is directly related to what they said
- Can be answered in 1-2 minutes

Respond with ONLY the follow-up question text.
```

---

## 4. Blueprint 3: Rigorous Evaluation
The scoring engine that determines the candidate's trajectory.

### Logic:
- **JSON Enforcement**: Forces the AI to return a machine-readable JSON object for seamless UI integration.
- **Standardized Rubric**: Provides a 0-10 scale with clear descriptors for each range.

### The Template:
```text
Question: "{question}"
Candidate's Answer: "{answer}"

Evaluate the answer and respond in EXACTLY this JSON format:
{
  "score": <number 0-10>,
  "feedback": "<brief 1-2 sentence constructive feedback>"
}

Scoring guidelines:
- 0-2: Completely wrong/irrelevant
- 5-6: Adequate but missing details
- 9-10: Excellent and comprehensive
```

---

## 5. Blueprint 4: The Performance Report
The final synthesis of the entire session.

### Logic:
- **Global Analysis**: Analyzes the average score, strengths, and areas for improvement.
- **Actionable Growth**: Generates "Improved Sample Answers" based on the candidate's actual weak points.

### The Template (Partial):
```text
Generate a report in EXACTLY this JSON format:
{
  "overallScore": <number 0-10>,
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "sampleAnswers": [
    {
      "question": "...",
      "originalAnswer": "...",
      "improvedAnswer": "..."
    }
  ],
  "suggestedTopics": [...]
}
```

---

## 6. Prompt Engineering Best Practices Used
- **Persona Setting**: "You are a senior technical interviewer..."
- **Output Formatting**: "Respond with ONLY...", "EXACTLY this JSON format..."
- **Constraint Satisfaction**: "No markdown, no code fences", "Answerable in 1-2 minutes."
- **Feedback Loops**: Adaptive difficulty logic (Score >= 8 → ⬆️, Score <= 4 → ⬇️).

---
*Accessible to all developers and AI enthusiasts. Part of the NexRound Open Documentation initiative.*
