import { useState, useEffect, useRef } from 'react';

export default function Timer({ totalSeconds, onTimeUp, isRunning }) {
    const [remaining, setRemaining] = useState(totalSeconds);
    const intervalRef = useRef(null);

    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const progress = remaining / totalSeconds;
    const dashOffset = circumference * (1 - progress);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    onTimeUp?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const getColor = () => {
        if (progress > 0.5) return '#10b981';
        if (progress > 0.2) return '#f59e0b';
        return '#ef4444';
    };

    const getClass = () => {
        if (progress > 0.5) return '';
        if (progress > 0.2) return 'warning';
        return 'danger';
    };

    return (
        <div className="timer-wrapper">
            <div className="timer-ring">
                <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle className="ring-bg" cx="26" cy="26" r={radius} strokeWidth="4" />
                    <circle
                        className="ring-progress"
                        cx="26" cy="26" r={radius}
                        strokeWidth="4"
                        stroke={getColor()}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
            </div>
            <span className={`timer-text ${getClass()}`}>{timeStr}</span>
        </div>
    );
}
