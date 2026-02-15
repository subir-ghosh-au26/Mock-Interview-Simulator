import { useState, useEffect } from 'react';

export default function ScoreGauge({ score, maxScore = 100, size = 180 }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = animatedScore / maxScore;
    const dashOffset = circumference * (1 - progress);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 200);
        return () => clearTimeout(timer);
    }, [score]);

    const getColor = () => {
        const pct = score / maxScore;
        if (pct >= 0.7) return '#10b981';
        if (pct >= 0.4) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="score-gauge" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="gauge-bg"
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth="10"
                />
                <circle
                    className="gauge-progress"
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth="10"
                    stroke={getColor()}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                />
            </svg>
            <div className="gauge-text">
                <span className="gauge-value" style={{ color: getColor() }}>
                    {Math.round(animatedScore)}
                </span>
                <span className="gauge-out-of">/ {maxScore}</span>
            </div>
        </div>
    );
}
