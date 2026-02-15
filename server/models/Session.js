const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    isFollowUp: { type: Boolean, default: false },
    parentQuestionIndex: { type: Number, default: null }
});

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    interviewType: { type: String, required: true },
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, default: 0 },
    questions: [questionSchema],
    overallScore: { type: Number, default: 0 },
    percentageScore: { type: Number, default: 0 },
    strengths: [String],
    improvements: [String],
    sampleAnswers: [{
        question: String,
        originalAnswer: String,
        improvedAnswer: String
    }],
    suggestedTopics: [String],
    status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Session', sessionSchema);
