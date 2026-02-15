let API_BASE = import.meta.env.VITE_API_URL || '/api';

// Ensure API_BASE always handles the /api prefix correctly for absolute URLs
if (API_BASE.startsWith('http') && !API_BASE.endsWith('/api')) {
    API_BASE = API_BASE.endsWith('/') ? `${API_BASE}api` : `${API_BASE}/api`;
}

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: getAuthHeaders(),
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        throw new ApiError(
            data.error || `Request failed (${res.status})`,
            res.status
        );
    }

    return data;
}

export const api = {
    // Auth endpoints
    register: (name, email, password) =>
        request('/auth/register', { method: 'POST', body: { name, email, password } }),

    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: { email, password } }),

    getMe: () => request('/auth/me'),

    // Interview endpoints
    startInterview: (config) =>
        request('/interview/start', { method: 'POST', body: config }),

    evaluateAnswer: (sessionId, answer) =>
        request('/interview/evaluate', { method: 'POST', body: { sessionId, answer } }),

    generateReport: (sessionId) =>
        request('/interview/report', { method: 'POST', body: { sessionId } }),

    // Session endpoints
    getSessions: () => request('/sessions'),

    getSession: (sessionId) => request(`/sessions/${sessionId}`),

    // Admin endpoints
    getAdminUsers: () => request('/admin/users'),

    getUserSessions: (userId) => request(`/admin/users/${userId}/sessions`),
};

export default api;
