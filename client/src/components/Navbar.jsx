import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    // Hide navbar during active interview and on auth pages
    if (location.pathname === '/interview') return null;
    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand">
                    <span className="brand-icon">🎯</span>
                    <span className="brand-text">NexRound</span>
                </NavLink>

                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        end
                    >
                        <span className="nav-icon">⚡</span>
                        <span>New Interview</span>
                    </NavLink>
                    <NavLink
                        to="/history"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📋</span>
                        <span>History</span>
                    </NavLink>

                    {user?.role === 'admin' && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">👤</span>
                            <span>Users</span>
                        </NavLink>
                    )}

                    <div className="nav-user">
                        <span className="nav-user-name">
                            {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
                            {user?.name}
                        </span>
                        <button onClick={handleLogout} className="nav-link logout-btn">
                            <span className="nav-icon">🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
