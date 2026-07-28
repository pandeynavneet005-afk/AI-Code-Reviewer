export default function Toolbar({ onReview, onClear, isLoading, disabled }) {
  return (
    <div className="toolbar">
      <button type="button" className="btn btn-ghost" onClick={onClear} disabled={isLoading}>
        Clear
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
            Reviewing…
          </>
        ) : (
          <>Review code ▶</>
        )}
      </button>
    </div>
  );
}
