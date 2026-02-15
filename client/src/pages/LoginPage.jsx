import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../utils/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const data = await api.login(email, password);
            login(data.token, data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) handleSubmit(e);
    };

    return (
        <div className="auth-page">
            <div className="bg-orbs" />
            <div className="auth-card glass-card fade-in">
                <div className="auth-header">
                    <span className="auth-icon">🔐</span>
                    <h1 className="page-title">Welcome to NexRound</h1>
                    <p className="page-subtitle">Sign in to continue your interview practice</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary start-btn"
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
                </div>
            </div>
        </div>
    );
}
