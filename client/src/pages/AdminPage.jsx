import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function AdminPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userSessions, setUserSessions] = useState({});
    const [loadingSessions, setLoadingSessions] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            const data = await api.getAdminUsers();
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }
        setExpandedUser(userId);

        // Fetch full session history if not already loaded
        if (!userSessions[userId]) {
            setLoadingSessions(userId);
            try {
                const sessions = await api.getUserSessions(userId);
                setUserSessions(prev => ({ ...prev, [userId]: sessions }));
            } catch (err) {
                toast.error('Failed to load interview history');
            } finally {
                setLoadingSessions(null);
            }
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
        return new Date(dateStr).toLocaleDateString('en-US', {
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
                        <h1 className="page-title">👑 Admin Dashboard</h1>
                        <p className="page-subtitle">
                            All registered users and their interview performance
                        </p>
                    </div>
                    <div className="admin-stats-bar">
                        <div className="admin-stat-chip">
                            <span className="admin-stat-value">{users.length}</span>
                            <span className="admin-stat-label">Users</span>
                        </div>
                        <div className="admin-stat-chip">
                            <span className="admin-stat-value">
                                {users.reduce((sum, u) => sum + u.totalInterviews, 0)}
                            </span>
                            <span className="admin-stat-label">Interviews</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="glass-card ai-thinking">
                        <div className="thinking-dots"><span /><span /><span /></div>
                        <p className="thinking-text">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="glass-card empty-state fade-in">
                        <div className="icon">👤</div>
                        <p>No users registered yet</p>
                    </div>
                ) : (
                    <div className="admin-users-list">
                        {users.map((user, i) => (
                            <div
                                key={user._id}
                                className="glass-card admin-user-card fade-in"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div
                                    className="admin-user-header"
                                    onClick={() => toggleExpand(user._id)}
                                >
                                    <div className="admin-user-info">
                                        <div className="admin-user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="admin-user-name">
                                                {user.name}
                                                {user.role === 'admin' && (
                                                    <span className="admin-badge">Admin</span>
                                                )}
                                            </div>
                                            <div className="admin-user-email">{user.email}</div>
                                            <div className="admin-user-joined">
                                                Joined {formatDate(user.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-user-stats">
                                        <div className="admin-user-stat">
                                            <span className="admin-user-stat-val">{user.totalInterviews}</span>
                                            <span className="admin-user-stat-lbl">Interviews</span>
                                        </div>
                                        <div className="admin-user-stat">
                                            <span
                                                className="admin-user-stat-val"
                                                style={{ color: user.totalInterviews > 0 ? getScoreColor(user.averageScore) : 'var(--text-muted)' }}
                                            >
                                                {user.totalInterviews > 0 ? user.averageScore : '—'}
                                            </span>
                                            <span className="admin-user-stat-lbl">Avg Score</span>
                                        </div>
                                        <span className={`admin-expand-arrow ${expandedUser === user._id ? 'expanded' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {expandedUser === user._id && (
                                    <div className="admin-user-sessions">
                                        <div className="admin-sessions-header">
                                            <span>📋 Interview History — {user.name}</span>
                                            <span className="admin-sessions-count">
                                                {userSessions[user._id]?.length || user.totalInterviews} sessions
                                            </span>
                                        </div>
                                        {loadingSessions === user._id ? (
                                            <div className="admin-no-sessions">
                                                <div className="thinking-dots" style={{ justifyContent: 'center' }}>
                                                    <span /><span /><span />
                                                </div>
                                                Loading history...
                                            </div>
                                        ) : (userSessions[user._id] || []).length === 0 ? (
                                            <div className="admin-no-sessions">No interviews yet</div>
                                        ) : (
                                            (userSessions[user._id] || []).map((s) => (
                                                <div
                                                    key={s.sessionId}
                                                    className="admin-session-row"
                                                    onClick={() => handleViewSession(s.sessionId)}
                                                >
                                                    <div className="admin-session-info">
                                                        <span className="admin-session-role">{s.role}</span>
                                                        <span className="admin-session-detail">📊 {s.difficulty}</span>
                                                        <span className="admin-session-detail">📝 {s.interviewType}</span>
                                                        <span className="admin-session-detail">⏱ {s.duration} min</span>
                                                        <span className="admin-session-detail">🗓 {formatDate(s.completedAt)}</span>
                                                    </div>
                                                    <div
                                                        className="admin-session-score"
                                                        style={{ color: getScoreColor(s.percentageScore) }}
                                                    >
                                                        {s.percentageScore || 0}%
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
