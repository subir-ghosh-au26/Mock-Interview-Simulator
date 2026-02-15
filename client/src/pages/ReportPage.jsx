import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreGauge from '../components/ScoreGauge';

export default function ReportPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { report, config } = location.state || {};

    useEffect(() => {
        if (!report) navigate('/');
    }, [report, navigate]);

    if (!report) return null;

    const getScoreClass = (score) => {
        if (score >= 7) return 'score-high';
        if (score >= 4) return 'score-mid';
        return 'score-low';
    };

    const getScoreColor = (score) => {
        if (score >= 7) return 'high';
        if (score >= 4) return 'mid';
        return 'low';
    };

    const getGradeLabel = (pct) => {
        if (pct >= 90) return { label: 'Outstanding', color: '#10b981' };
        if (pct >= 75) return { label: 'Excellent', color: '#10b981' };
        if (pct >= 60) return { label: 'Good', color: '#3b82f6' };
        if (pct >= 40) return { label: 'Needs Improvement', color: '#f59e0b' };
        return { label: 'Requires Practice', color: '#ef4444' };
    };

    const grade = getGradeLabel(report.percentageScore);

    return (
        <div className="report-page">
            <div className="bg-orbs" />
            <div className="report-container container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }} className="fade-in">
                    <h1 className="page-title">Performance Report</h1>
                    <p className="page-subtitle">
                        {config?.role} • {config?.difficulty} • {config?.interviewType}
                    </p>
                </div>

                {/* Score Section */}
                <div className="score-section fade-in fade-in-delay-1">
                    <div className="score-ring-wrapper">
                        <ScoreGauge score={report.percentageScore} maxScore={100} size={200} />
                    </div>
                    <div className="score-meta">
                        <p className="score-label">
                            Overall: <strong>{report.overallScore}/10</strong>
                        </p>
                        <p className="score-grade" style={{ color: grade.color }}>
                            {grade.label}
                        </p>
                    </div>
                </div>

                {/* Strengths & Improvements Grid */}
                <div className="report-grid fade-in fade-in-delay-2">
                    <div className="glass-card report-section">
                        <h3 className="section-title">
                            <span className="icon">💪</span> Strengths
                        </h3>
                        <ul className="report-list">
                            {report.strengths?.map((s, i) => (
                                <li key={i}>
                                    <span className="bullet bullet-green">✓</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card report-section">
                        <h3 className="section-title">
                            <span className="icon">🎯</span> Areas to Improve
                        </h3>
                        <ul className="report-list">
                            {report.improvements?.map((imp, i) => (
                                <li key={i}>
                                    <span className="bullet bullet-yellow">△</span>
                                    <span>{imp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sample Answers */}
                {report.sampleAnswers?.length > 0 && (
                    <div className="fade-in fade-in-delay-3">
                        <h3 className="section-title" style={{ marginBottom: '1rem' }}>
                            <span className="icon">📝</span> Improved Sample Answers
                        </h3>
                        {report.sampleAnswers.map((sa, i) => (
                            <div key={i} className="glass-card sample-answer-card">
                                <p className="sample-question">Q: {sa.question}</p>
                                <div className="answer-comparison">
                                    <div className="answer-box original">
                                        <div className="answer-box-label">Your Answer</div>
                                        {sa.originalAnswer}
                                    </div>
                                    <div className="answer-box improved">
                                        <div className="answer-box-label">Improved Answer</div>
                                        {sa.improvedAnswer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Suggested Topics */}
                {report.suggestedTopics?.length > 0 && (
                    <div className="glass-card fade-in fade-in-delay-4" style={{ marginTop: '1.5rem' }}>
                        <h3 className="section-title">
                            <span className="icon">📚</span> Suggested Practice Topics
                        </h3>
                        <div className="topics-grid">
                            {report.suggestedTopics.map((topic, i) => (
                                <span key={i} className="topic-chip">{topic}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Questions Breakdown */}
                {report.questions?.length > 0 && (
                    <div className="breakdown-section fade-in fade-in-delay-4">
                        <h3 className="section-title" style={{ marginBottom: '1rem' }}>
                            <span className="icon">📊</span> Question-by-Question Breakdown
                        </h3>
                        {report.questions.map((q, i) => (
                            <div key={i} className={`glass-card breakdown-card ${getScoreClass(q.score)}`}>
                                <div className="breakdown-header">
                                    <span className="breakdown-q">
                                        {q.isFollowUp ? '↳ Follow-up: ' : `Q${i + 1}: `}
                                        {q.question}
                                    </span>
                                    <span className={`breakdown-score feedback-score ${getScoreColor(q.score)}`}>
                                        {q.score}/10
                                    </span>
                                </div>
                                {q.answer && (
                                    <p className="breakdown-answer">
                                        <strong>Your answer:</strong> {q.answer}
                                    </p>
                                )}
                                {q.feedback && (
                                    <p className="breakdown-feedback">{q.feedback}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="report-actions fade-in">
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                        🔄 New Interview
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={() => navigate('/history')}>
                        📋 View History
                    </button>
                </div>
            </div>
        </div>
    );
}
