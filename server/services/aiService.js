const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Retry wrapper with exponential backoff for rate-limited API calls
 */
async function callWithRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error?.status === 429 ||
                error?.message?.includes('429') ||
                error?.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < maxRetries) {
                // Try to extract Gemini's suggested delay, otherwise use exponential backoff
                let delay = (attempt + 1) * 20000; // 20s, 40s, 60s
                const retryMatch = error?.message?.match(/retryDelay.*?(\d+)s/);
                if (retryMatch) {
                    delay = Math.max(parseInt(retryMatch[1]) * 1000, delay);
                }
                console.log(`Rate limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, delay));
            } else if (isRateLimit) {
                throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
            } else {
                throw error;
            }
        }
    }
}

/**
 * Generate a technical interview question
 */
async function generateQuestion(role, difficulty, interviewType, history = [], adjustedDifficulty = null) {
    const effectiveDifficulty = adjustedDifficulty || difficulty;

    const previousQuestions = history.map((q, i) =>
        `Q${i + 1}: "${q.question}" (Score: ${q.score}/10)`
    ).join('\n');

    const prompt = `You are a senior technical interviewer conducting a ${interviewType} interview for a ${effectiveDifficulty}-level ${role} position.

${previousQuestions ? `Previous questions and scores in this session:\n${previousQuestions}\n\nGenerate a NEW question that hasn't been asked yet. Adjust complexity based on candidate performance.` : 'Generate the first question for this interview.'}

Rules:
- For ${effectiveDifficulty} level, ask appropriately challenging questions
- Question should be relevant to ${role} and ${interviewType} interview type
- Be specific and practical, not overly abstract
- Question should be answerable in 1-3 minutes

Respond with ONLY the question text, nothing else. No numbering, no prefix.`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    return result.response.text().trim();
}

/**
 * Generate an intelligent follow-up question based on the answer
 */
async function generateFollowUp(originalQuestion, answer, role, difficulty) {
    const prompt = `You are a senior technical interviewer for a ${difficulty}-level ${role} position.

The candidate was asked: "${originalQuestion}"
Their answer was: "${answer}"

Generate ONE intelligent follow-up question that:
- Probes deeper into their answer
- Tests understanding beyond surface-level knowledge
- Is directly related to what they said
- Can be answered in 1-2 minutes

Respond with ONLY the follow-up question text, nothing else.`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    return result.response.text().trim();
}

/**
 * Evaluate an answer and provide score + feedback
 */
async function evaluateAnswer(question, answer, role, difficulty) {
    const prompt = `You are a senior technical interviewer evaluating an answer for a ${difficulty}-level ${role} position.

Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer and respond in EXACTLY this JSON format (no markdown, no code fences):
{
  "score": <number 0-10>,
  "feedback": "<brief 1-2 sentence constructive feedback>"
}

Scoring guidelines:
- 0-2: Completely wrong or irrelevant
- 3-4: Shows some awareness but significant gaps
- 5-6: Adequate understanding, missing key details
- 7-8: Good answer with solid understanding
- 9-10: Excellent, comprehensive answer

Be fair but rigorous for a ${difficulty}-level candidate.`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const text = result.response.text().trim();

    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        return { score: 5, feedback: 'Answer received and noted.' };
    }
}

/**
 * Generate a comprehensive performance report
 */
async function generateReport(sessionData) {
    const questionsDetail = sessionData.questions.map((q, i) =>
        `Q${i + 1}${q.isFollowUp ? ' (Follow-up)' : ''}: "${q.question}"\nAnswer: "${q.answer}"\nScore: ${q.score}/10\nFeedback: ${q.feedback}`
    ).join('\n\n');

    const avgScore = sessionData.questions.reduce((sum, q) => sum + q.score, 0) / sessionData.questions.length;

    const prompt = `You are a senior technical interviewer generating a comprehensive performance report for a ${sessionData.difficulty}-level ${sessionData.role} candidate who just completed a ${sessionData.interviewType} interview.

Session Details:
- Role: ${sessionData.role}
- Difficulty: ${sessionData.difficulty}
- Interview Type: ${sessionData.interviewType}
- Average Score: ${avgScore.toFixed(1)}/10

Questions and Answers:
${questionsDetail}

Generate a report in EXACTLY this JSON format (no markdown, no code fences):
{
  "overallScore": <number 0-10 with one decimal>,
  "percentageScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement area 1>", "<improvement area 2>", "<improvement area 3>"],
  "sampleAnswers": [
    {
      "question": "<question that had a weak answer>",
      "originalAnswer": "<what the candidate said>",
      "improvedAnswer": "<a better, more complete answer>"
    },
    {
      "question": "<another question that could be improved>",
      "originalAnswer": "<what the candidate said>",
      "improvedAnswer": "<a better, more complete answer>"
    }
  ],
  "suggestedTopics": ["<topic 1>", "<topic 2>", "<topic 3>", "<topic 4>"]
}

Be specific and actionable in your feedback. Reference actual answers when possible.`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const text = result.response.text().trim();

    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        return {
            overallScore: Math.round(avgScore * 10) / 10,
            percentageScore: Math.round(avgScore * 10),
            strengths: ['Completed the interview', 'Showed willingness to engage', 'Attempted all questions'],
            improvements: ['Provide more detailed answers', 'Include practical examples', 'Structure responses better'],
            sampleAnswers: [],
            suggestedTopics: ['Core fundamentals', 'System design basics', 'Problem-solving patterns', 'Communication skills']
        };
    }
}

module.exports = {
    generateQuestion,
    generateFollowUp,
    evaluateAnswer,
    generateReport
};
