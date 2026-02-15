import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import api from '../utils/api';

export default function HistoryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const data = await api.getSessions();
            setSessions(data);
        } catch (err) {
            toast.error('Failed to load interview history');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSession = async (sessionId) => {
        try {
            const data = await api.getSession(sessionId);

            navigate('/report', {
                state: {
                    report: {
                        overallScore: data.overallScore,
                        percentageScore: data.percentageScore,
                        strengths: data.strengths,
                        improvements: data.improvements,
                        sampleAnswers: data.sampleAnswers,
                        suggestedTopics: data.suggestedTopics,
                        questions: data.questions
                    },
                    config: {
                        role: data.role,
                        difficulty: data.difficulty,
                        interviewType: data.interviewType
                    }
                }
            });
        } catch (err) {
            toast.error('Failed to load session details');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'var(--accent-green)';
        if (score >= 40) return 'var(--accent-yellow)';
        return 'var(--accent-red)';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="history-page">
            <div className="bg-orbs" />
            <div className="history-container container">
                <div className="history-header fade-in">
                    <div>
                        <h1 className="page-title">Interview History</h1>
                        <p className="page-subtitle">Review your past interview sessions</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        + New Interview
                    </button>
                </div>

                {loading ? (
                    <div className="glass-card ai-thinking">
                        <div className="thinking-dots">
                            <span /><span /><span />
                        </div>
                        <p className="thinking-text">Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="glass-card empty-state fade-in">
                        <div className="icon">📭</div>
                        <p>No interview sessions yet</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Start Your First Interview
                        </button>
                    </div>
                ) : (
                    <div className="history-list">
                        {sessions.map((s, i) => (
                            <div
                                key={s.sessionId}
                                className="glass-card history-card fade-in"
                                style={{ animationDelay: `${i * 0.05}s` }}
                                onClick={() => handleViewSession(s.sessionId)}
                            >
                                <div className="history-info">
                                    <div className="history-role">{s.role}</div>
                                    <div className="history-details">
                                        <span className="history-detail">📊 {s.difficulty}</span>
                                        <span className="history-detail">📝 {s.interviewType}</span>
                                        <span className="history-detail">⏱ {s.duration} min</span>
                                        <span className="history-detail">🗓 {formatDate(s.completedAt)}</span>
                                    </div>
                                </div>
                                <div className="history-score">
                                    <div
                                        className="history-score-value"
                                        style={{ color: getScoreColor(s.percentageScore) }}
                                    >
                                        {s.percentageScore || 0}
                                    </div>
                                    <div className="history-score-label">Score</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
