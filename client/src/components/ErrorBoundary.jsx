import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="bg-orbs" />
                    <div className="glass-card error-card">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h2 className="page-title" style={{ fontSize: '1.8rem' }}>Something went wrong</h2>
                        <p className="page-subtitle">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                        >
                            🏠 Return Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
