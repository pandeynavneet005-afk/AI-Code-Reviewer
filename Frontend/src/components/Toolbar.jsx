function ClearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
      />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 3 14 9-14 9V3Z"
      />
    </svg>
  );
}

export default function Toolbar({
  onReview,
  onClear,
  isLoading,
  disabled,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-info">
        <span className="toolbar-status-dot" aria-hidden="true" />
        <span>Ready for analysis</span>
      </div>

      <div className="toolbar-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onClear}
          disabled={isLoading}
        >
          <ClearIcon />
          <span>Clear</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onReview}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Analyzing code...</span>
            </>
          ) : (
            <>
              <ReviewIcon />
              <span>Review Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}