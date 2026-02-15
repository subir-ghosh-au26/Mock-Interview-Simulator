export default function ProgressBar({ current, total }) {
    return (
        <div className="progress-wrapper">
            <div className="progress-steps">
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className={`progress-step ${i < current - 1 ? 'completed' : i === current - 1 ? 'current' : ''
                            }`}
                    />
                ))}
            </div>
            <span className="progress-label">
                Question {current} of {total}
            </span>
        </div>
    );
}
