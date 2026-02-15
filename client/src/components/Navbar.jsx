import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    // Hide navbar during active interview
    if (location.pathname === '/interview') return null;

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand">
                    <span className="brand-icon">🎯</span>
                    <span className="brand-text">InterviewAI</span>
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
                </div>
            </div>
        </nav>
    );
}
