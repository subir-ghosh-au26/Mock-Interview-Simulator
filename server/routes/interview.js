const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const { generateQuestion, generateFollowUp, evaluateAnswer, generateReport } = require('../services/aiService');

// In-memory store for active sessions (for fast access during interview)
const activeSessions = new Map();

/**
 * POST /api/interview/start
 * Start a new interview session
 */
router.post('/start', async (req, res) => {
    try {
        const { role, difficulty, interviewType, duration } = req.body;

        if (!role || !difficulty || !interviewType || !duration) {
            return res.status(400).json({ error: 'Missing required fields: role, difficulty, interviewType, duration' });
        }

        // Calculate total questions based on duration (roughly 1 question per 2-3 min)
        const totalQuestions = Math.max(4, Math.min(12, Math.floor(duration / 2.5)));
        const sessionId = uuidv4();

        // Generate first question
        const firstQuestion = await generateQuestion(role, difficulty, interviewType);

        // Create session in DB
        const session = new Session({
            sessionId,
            role,
            difficulty,
            interviewType,
            duration,
            totalQuestions,
            questions: [{ question: firstQuestion, isFollowUp: false }],
            status: 'in-progress'
        });
        await session.save();

        // Store active session state
        activeSessions.set(sessionId, {
            currentQuestionIndex: 0,
            followUpUsed: false,
            followUpTriggered: false,
            answeredCount: 0,
            mainQuestionsAsked: 1,
            adjustedDifficulty: null
        });

        res.json({
            sessionId,
            question: firstQuestion,
            questionNumber: 1,
            totalQuestions,
            isFollowUp: false,
            duration
        });
    } catch (error) {
        console.error('Start interview error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to start interview' });
    }
});

/**
 * POST /api/interview/evaluate
 * Evaluate an answer and return next question or follow-up
 */
router.post('/evaluate', async (req, res) => {
    try {
        const { sessionId, answer } = req.body;

        if (!sessionId || answer === undefined) {
            return res.status(400).json({ error: 'Missing sessionId or answer' });
        }

        const session = await Session.findOne({ sessionId });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        const state = activeSessions.get(sessionId);
        if (!state) return res.status(400).json({ error: 'Session not active' });

        const currentQ = session.questions[state.currentQuestionIndex];

        // Evaluate the answer
        const evaluation = await evaluateAnswer(
            currentQ.question,
            answer,
            session.role,
            session.difficulty
        );

        // Update current question with answer and evaluation
        session.questions[state.currentQuestionIndex].answer = answer;
        session.questions[state.currentQuestionIndex].score = evaluation.score;
        session.questions[state.currentQuestionIndex].feedback = evaluation.feedback;
        state.answeredCount++;

        // Adaptive difficulty adjustment
        if (evaluation.score >= 8) {
            state.adjustedDifficulty = getHigherDifficulty(session.difficulty);
        } else if (evaluation.score <= 4) {
            state.adjustedDifficulty = getLowerDifficulty(session.difficulty);
        } else {
            state.adjustedDifficulty = null;
        }

        // Decide: follow-up or next question?
        const shouldFollowUp = !state.followUpTriggered && (
            (evaluation.score >= 4 && evaluation.score <= 7 && state.answeredCount >= 2) ||
            (state.mainQuestionsAsked >= 3 && !state.followUpTriggered)
        );

        // Check if interview is complete
        const totalAnswered = session.questions.filter(q => q.answer).length;
        const isLastQuestion = state.mainQuestionsAsked >= session.totalQuestions && !shouldFollowUp;

        if (isLastQuestion && !shouldFollowUp) {
            await session.save();
            return res.json({
                evaluation,
                isComplete: true,
                questionNumber: totalAnswered,
                totalQuestions: session.totalQuestions
            });
        }

        let nextQuestion;
        let isFollowUp = false;

        if (shouldFollowUp) {
            // Generate follow-up
            nextQuestion = await generateFollowUp(
                currentQ.question,
                answer,
                session.role,
                session.difficulty
            );
            isFollowUp = true;
            state.followUpTriggered = true;
            state.followUpUsed = true;
        } else {
            // Generate next main question
            const history = session.questions.filter(q => q.answer).map(q => ({
                question: q.question,
                score: q.score
            }));

            nextQuestion = await generateQuestion(
                session.role,
                session.difficulty,
                session.interviewType,
                history,
                state.adjustedDifficulty
            );
            state.mainQuestionsAsked++;
        }

        // Add new question to session
        session.questions.push({
            question: nextQuestion,
            isFollowUp,
            parentQuestionIndex: isFollowUp ? state.currentQuestionIndex : null
        });
        state.currentQuestionIndex = session.questions.length - 1;

        await session.save();

        const displayNumber = isFollowUp
            ? `${state.mainQuestionsAsked} (Follow-up)`
            : state.mainQuestionsAsked;

        res.json({
            evaluation,
            nextQuestion,
            questionNumber: state.mainQuestionsAsked,
            totalQuestions: session.totalQuestions,
            isFollowUp,
            isComplete: false,
            displayNumber
        });
    } catch (error) {
        console.error('Evaluate error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to evaluate answer' });
    }
});

/**
 * POST /api/interview/report
 * Generate final performance report
 */
router.post('/report', async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await Session.findOne({ sessionId });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Generate comprehensive report
        const report = await generateReport({
            role: session.role,
            difficulty: session.difficulty,
            interviewType: session.interviewType,
            questions: session.questions
        });

        // Update session with report data
        session.overallScore = report.overallScore;
        session.percentageScore = report.percentageScore;
        session.strengths = report.strengths;
        session.improvements = report.improvements;
        session.sampleAnswers = report.sampleAnswers;
        session.suggestedTopics = report.suggestedTopics;
        session.status = 'completed';
        session.completedAt = new Date();

        await session.save();

        // Clean up active session
        activeSessions.delete(sessionId);

        res.json({
            ...report,
            questions: session.questions,
            role: session.role,
            difficulty: session.difficulty,
            interviewType: session.interviewType,
            duration: session.duration,
            completedAt: session.completedAt
        });
    } catch (error) {
        console.error('Report generation error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to generate report' });
    }
});

// Helper functions for adaptive difficulty
function getHigherDifficulty(current) {
    const levels = ['Junior', 'Mid', 'Senior', 'Lead'];
    const idx = levels.indexOf(current);
    return idx < levels.length - 1 ? levels[idx + 1] : current;
}

function getLowerDifficulty(current) {
    const levels = ['Junior', 'Mid', 'Senior', 'Lead'];
    const idx = levels.indexOf(current);
    return idx > 0 ? levels[idx - 1] : current;
}

module.exports = router;
