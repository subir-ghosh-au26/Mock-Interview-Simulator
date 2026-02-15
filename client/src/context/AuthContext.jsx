import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount, verify stored token
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        api.getMe()
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setLoading(false);
            });
    }, [token]);

    const login = useCallback((tokenValue, userData) => {
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    }), [user, token, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
