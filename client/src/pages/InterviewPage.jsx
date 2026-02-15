import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import api from '../utils/api';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';

export default function InterviewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const { session, config } = location.state || {};

    const [currentQuestion, setCurrentQuestion] = useState(session?.question || '');
    const [questionNumber, setQuestionNumber] = useState(session?.questionNumber || 1);
    const [totalQuestions, setTotalQuestions] = useState(session?.totalQuestions || 8);
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [sessionId] = useState(session?.sessionId);
    const [timerRunning, setTimerRunning] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Redirect if no session
    useEffect(() => {
        if (!session) navigate('/');
    }, [session, navigate]);

    // Prevent accidental navigation away
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isComplete) {
                e.preventDefault();
                e.returnValue = 'Interview in progress. Are you sure you want to leave?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isComplete]);

    // Ctrl+Enter keyboard shortcut
    useEffect(() => {
        const handleKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && answer.trim() && !loading) {
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [answer, loading]);

    const handleSubmit = useCallback(async () => {
        if (!answer.trim() || loading) return;
        setLoading(true);
        setFeedback(null);
        setLoadingMessage('AI is evaluating your answer...');

        try {
            const data = await api.evaluateAnswer(sessionId, answer);

            // Show feedback
            setFeedback(data.evaluation);

            if (data.isComplete) {
                setIsComplete(true);
                setTimerRunning(false);
                setTimeout(() => handleGenerateReport(), 2000);
            } else {
                // Show next question after a delay
                setTimeout(() => {
                    setCurrentQuestion(data.nextQuestion);
                    setQuestionNumber(data.questionNumber);
                    setTotalQuestions(data.totalQuestions);
                    setIsFollowUp(data.isFollowUp);
                    setAnswer('');
                    setFeedback(null);
                    setLoading(false);
                }, 2500);
            }
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    }, [answer, loading, sessionId]);

    const handleTimeUp = () => {
        setTimerRunning(false);
        setIsComplete(true);
        toast.info('Time is up! Generating your report...');
        handleGenerateReport();
    };

    const handleGenerateReport = async () => {
        setLoading(true);
        setLoadingMessage('Generating your comprehensive performance report...');
        try {
            const data = await api.generateReport(sessionId);
            navigate('/report', { state: { report: data, config } });
        } catch (err) {
            toast.error('Failed to generate report: ' + err.message);
            setLoading(false);
        }
    };

    if (!session) return null;

    const getScoreClass = (score) => {
        if (score >= 7) return 'high';
        if (score >= 4) return 'mid';
        return 'low';
    };

    return (
        <div className="interview-page">
            <div className="bg-orbs" />

            {/* Header */}
            <div className="interview-header container">
                <div className="interview-meta">
                    <span className="meta-badge">👤 {config?.role}</span>
                    <span className="meta-badge">📊 {config?.difficulty}</span>
                    <span className="meta-badge">📝 {config?.interviewType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <ProgressBar current={questionNumber} total={totalQuestions} />
                    <Timer
                        totalSeconds={(session?.duration || 15) * 60}
                        onTimeUp={handleTimeUp}
                        isRunning={timerRunning}
                    />
                </div>
            </div>

            {/* Question Area */}
            <div className="question-area">
                {/* Feedback Toast */}
                {feedback && (
                    <div className={`glass-card feedback-toast fade-in score-${getScoreClass(feedback.score)}`}>
                        <div className="feedback-header">
                            <span className={`feedback-score ${getScoreClass(feedback.score)}`}>
                                {feedback.score}/10
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                {feedback.score >= 7 ? '🎉 Excellent!' : feedback.score >= 4 ? '💡 Good effort!' : '📚 Keep practicing!'}
                            </span>
                        </div>
                        <p className="feedback-text">{feedback.feedback}</p>
                    </div>
                )}

                {/* Loading state */}
                {loading && !feedback ? (
                    <div className="glass-card ai-thinking fade-in">
                        <div className="thinking-dots">
                            <span /><span /><span />
                        </div>
                        <p className="thinking-text">{loadingMessage}</p>
                    </div>
                ) : !isComplete ? (
                    <>
                        {/* Question Card */}
                        <div className="glass-card question-card fade-in">
                            <div className="question-label">
                                <span>Question {questionNumber}</span>
                                {isFollowUp && <span className="follow-up-badge">Follow-up</span>}
                            </div>
                            <p className="question-text typing-text">{currentQuestion}</p>
                        </div>

                        {/* Answer Area */}
                        <div className="answer-section fade-in fade-in-delay-1">
                            <textarea
                                className="form-textarea"
                                placeholder="Type your answer here... Be clear, structured, and provide examples when possible."
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                disabled={loading}
                                rows={6}
                                autoFocus
                            />
                            <div className="answer-actions">
                                <span className="char-count">
                                    {answer.length} characters
                                    {answer.trim() && <span className="shortcut-hint"> • Ctrl+Enter to submit</span>}
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!answer.trim() || loading}
                                >
                                    {loading ? 'Evaluating...' : 'Submit Answer →'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}

                {/* Complete state while generating report */}
                {isComplete && !loading && (
                    <div className="glass-card ai-thinking fade-in">
                        <div style={{ fontSize: '3rem' }}>✅</div>
                        <p className="thinking-text">Interview complete! Generating your report...</p>
                        <div className="thinking-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
