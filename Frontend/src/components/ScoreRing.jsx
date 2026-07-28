const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score) {
  if (score >= 8) return 'var(--score-good)';
  if (score >= 5) return 'var(--score-mid)';
  return 'var(--score-low)';
}

export default function ScoreRing({ score }) {
  if (score === null || score === undefined) return null;

  const progress = (score / 10) * CIRCUMFERENCE;
  const color = scoreColor(score);

  return (
    <div className="score-ring" role="img" aria-label={`Review score: ${score} out of 10`}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={RADIUS} className="score-ring-track" fill="none" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
          transform="rotate(-90 28 28)"
        />
      </svg>
      <span className="score-ring-value">{score}</span>
    </div>
  );
}
