import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import api from '../utils/api';

const ROLES = [
    { value: 'Frontend Developer', icon: '🎨', desc: 'React, CSS, UI/UX' },
    { value: 'Backend Developer', icon: '⚙️', desc: 'APIs, Databases, Auth' },
    { value: 'Fullstack Developer', icon: '🔗', desc: 'End-to-end development' },
    { value: 'DevOps Engineer', icon: '🚀', desc: 'CI/CD, Cloud, Infra' },
    { value: 'Data Scientist', icon: '📊', desc: 'ML, Statistics, Python' },
    { value: 'ML/AI Engineer', icon: '🤖', desc: 'Deep Learning, NLP, CV' }
];

const DIFFICULTIES = [
    { value: 'Junior', icon: '🌱', color: '#10b981' },
    { value: 'Mid', icon: '🌿', color: '#3b82f6' },
    { value: 'Senior', icon: '🌳', color: '#f59e0b' },
    { value: 'Lead', icon: '🏔️', color: '#ef4444' }
];

const TYPES = [
    { value: 'Technical', icon: '💻' },
    { value: 'Behavioral', icon: '🗣️' },
    { value: 'System Design', icon: '🏗️' },
    { value: 'Mixed', icon: '🔀' }
];

const DURATIONS = [
    { value: 10, label: '10 min', icon: '⚡', desc: '~4 questions' },
    { value: 15, label: '15 min', icon: '⏱️', desc: '~6 questions' },
    { value: 20, label: '20 min', icon: '🕐', desc: '~8 questions' },
    { value: 30, label: '30 min', icon: '📋', desc: '~12 questions' }
];

const FEATURES = [
    { icon: '🧠', title: 'Adaptive AI', desc: 'Questions adjust based on your performance' },
    { icon: '⏱️', title: 'Timed Sessions', desc: 'Real interview pressure with live countdown' },
    { icon: '💬', title: 'Follow-ups', desc: 'AI probes deeper with intelligent follow-ups' },
    { icon: '📊', title: 'Detailed Reports', desc: 'Scores, strengths, improvements & sample answers' }
];

export default function ConfigPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [config, setConfig] = useState({
        role: '',
        difficulty: '',
        interviewType: '',
        duration: ''
    });
    const [loading, setLoading] = useState(false);

    const isValid = config.role && config.difficulty && config.interviewType && config.duration;

    // Enter key shortcut
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Enter' && isValid && !loading) handleStart();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isValid, loading, config]);

    const handleStart = async () => {
        if (!isValid || loading) return;
        setLoading(true);

        try {
            const data = await api.startInterview({
                role: config.role,
                difficulty: config.difficulty,
                interviewType: config.interviewType,
                duration: parseInt(config.duration)
            });
            navigate('/interview', { state: { session: data, config } });
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="config-page">
            <div className="bg-orbs" />

            <div className="config-layout">
                {/* Main Config Card */}
                <div className="glass-card config-card fade-in">
                    <div className="config-header">
                        <div className="config-icon-wrapper">
                            <span className="config-icon-lg">🎯</span>
                        </div>
                        <h1 className="page-title">Mock Interview</h1>
                        <p className="page-subtitle">Configure your AI-powered practice session</p>
                    </div>

                    <div className="config-grid">
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                value={config.role}
                                onChange={e => setConfig(p => ({ ...p, role: e.target.value }))}
                            >
                                <option value="">Select role...</option>
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value}>{r.icon} {r.value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Difficulty</label>
                            <select
                                className="form-select"
                                value={config.difficulty}
                                onChange={e => setConfig(p => ({ ...p, difficulty: e.target.value }))}
                            >
                                <option value="">Select level...</option>
                                {DIFFICULTIES.map(d => (
                                    <option key={d.value} value={d.value}>{d.icon} {d.value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Interview Type</label>
                            <select
                                className="form-select"
                                value={config.interviewType}
                                onChange={e => setConfig(p => ({ ...p, interviewType: e.target.value }))}
                            >
                                <option value="">Select type...</option>
                                {TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.icon} {t.value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Duration</label>
                            <select
                                className="form-select"
                                value={config.duration}
                                onChange={e => setConfig(p => ({ ...p, duration: e.target.value }))}
                            >
                                <option value="">Select duration...</option>
                                {DURATIONS.map(d => (
                                    <option key={d.value} value={d.value}>{d.icon} {d.label} — {d.desc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="start-section">
                        <button
                            className="btn btn-primary btn-lg start-btn"
                            disabled={!isValid || loading}
                            onClick={handleStart}
                        >
                            {loading ? (
                                <>
                                    <span className="thinking-dots" style={{ display: 'inline-flex' }}>
                                        <span /><span /><span />
                                    </span>
                                    Preparing Interview...
                                </>
                            ) : (
                                <>
                                    <span className="btn-shimmer" />
                                    🚀 Start Interview
                                </>
                            )}
                        </button>
                        {isValid && !loading && (
                            <p className="start-hint fade-in">Press <kbd>Enter</kbd> to start</p>
                        )}
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="features-strip fade-in fade-in-delay-2">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="feature-chip">
                            <span className="feature-chip-icon">{f.icon}</span>
                            <div>
                                <div className="feature-chip-title">{f.title}</div>
                                <div className="feature-chip-desc">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
