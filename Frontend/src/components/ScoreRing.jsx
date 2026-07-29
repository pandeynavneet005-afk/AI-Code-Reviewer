const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score) {
  if (score >= 8) return 'var(--score-good)';
  if (score >= 5) return 'var(--score-mid)';
  return 'var(--score-low)';
}

export default function ScoreRing({ score }) {
  if (score === null || score === undefined) return null;

  const normalizedScore = Math.max(0, Math.min(10, score));
  const progress = (normalizedScore / 10) * CIRCUMFERENCE;
  const color = scoreColor(normalizedScore);

  return (
    <div
      className="score-ring"
      role="img"
      aria-label={`Review score: ${normalizedScore} out of 10`}
      title={`${normalizedScore}/10 code quality score`}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          className="score-ring-track"
          fill="none"
          strokeWidth="5"
        />

        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          className="score-ring-progress"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
          transform="rotate(-90 28 28)"
        />
      </svg>

      <div className="score-ring-content">
        <span className="score-ring-value">{normalizedScore}</span>
        <span className="score-ring-max">/10</span>
      </div>
    </div>
  );
}