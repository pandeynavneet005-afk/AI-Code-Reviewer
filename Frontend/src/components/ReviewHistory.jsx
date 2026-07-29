import { useEffect, useState } from 'react';
import { getReviewHistory } from '../services/api';

function ReviewHistory({ onBack }) {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // -------------------------------------------------------
  // Load review history
  // -------------------------------------------------------

  useEffect(() => {
    async function loadHistory() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getReviewHistory();

        setReviews(data);
      } catch (err) {
        setError(
          err.message || 'Unable to load review history.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, []);

  // -------------------------------------------------------
  // Format date
  // -------------------------------------------------------

  function formatDate(date) {
    if (!date) return 'Unknown date';

    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // -------------------------------------------------------
  // Format language
  // -------------------------------------------------------

  function formatLanguage(language) {
    if (!language) return 'Unknown';

    const names = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      csharp: 'C#',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      swift: 'Swift',
      kotlin: 'Kotlin',
    };

    return names[language.toLowerCase()] || language;
  }

  // -------------------------------------------------------
  // Score styling
  // -------------------------------------------------------

  function getScoreClass(score) {
    const numericScore = Number(score);

    if (numericScore >= 8) {
      return 'good';
    }

    if (numericScore >= 5) {
      return 'medium';
    }

    return 'low';
  }

  // -------------------------------------------------------
  // Short code preview
  // -------------------------------------------------------

  function getCodePreview(code) {
    if (!code) return 'No code available.';

    const lines = code.split('\n');

    // Only show first 8 lines in history card
    const preview = lines.slice(0, 8).join('\n');

    if (lines.length > 8) {
      return `${preview}\n\n...`;
    }

    return preview;
  }

  // -------------------------------------------------------
  // SELECTED REVIEW / FULL DETAILS
  // -------------------------------------------------------

  if (selectedReview) {
    return (
      <main className="review-history-page">
        <div className="history-header">
          <div className="history-heading">
            <span className="history-eyebrow">
              Saved Review
            </span>

            <h1>
              {formatLanguage(selectedReview.language)} Review
            </h1>

            <p>
              View the submitted code and complete AI analysis.
            </p>
          </div>

          <button
            type="button"
            className="history-back-button"
            onClick={() => setSelectedReview(null)}
          >
            ← Back to History
          </button>
        </div>

        {/* Review information */}

        <div className="history-summary">
          <div className="history-count">
            <span className="history-count-dot" />

            <span>
              <strong>
                {formatLanguage(selectedReview.language)}
              </strong>
              {' • '}
              {formatDate(selectedReview.createdAt)}
            </span>
          </div>

          {selectedReview.score !== null &&
            selectedReview.score !== undefined && (
              <div
                className={`history-score ${getScoreClass(
                  selectedReview.score
                )}`}
              >
                {selectedReview.score}/10
              </div>
            )}
        </div>

        {/* Full review */}

        <div className="history-grid">
          {/* Submitted code */}

          <article className="history-card">
            <div className="history-card-header">
              <div className="history-card-meta">
                <span className="history-language">
                  {formatLanguage(selectedReview.language)}
                </span>

                <span className="history-date">
                  Submitted Code
                </span>
              </div>
            </div>

            <div className="history-code-wrapper">
              <div className="history-code-label">
                <span>Source Code</span>

                <span>
                  {selectedReview.code?.length || 0} characters
                </span>
              </div>

              <pre
                className="history-code"
                style={{ maxHeight: '520px' }}
              >
                <code>
                  {selectedReview.code ||
                    'No code available.'}
                </code>
              </pre>
            </div>
          </article>

          {/* AI Review */}

          <article className="history-card">
            <div className="history-card-header">
              <div className="history-card-meta">
                <span className="history-language">
                  AI Analysis
                </span>

                <span className="history-date">
                  Complete Review
                </span>
              </div>

              {selectedReview.score !== null &&
                selectedReview.score !== undefined && (
                  <div
                    className={`history-score ${getScoreClass(
                      selectedReview.score
                    )}`}
                  >
                    {selectedReview.score}/10
                  </div>
                )}
            </div>

            <div className="history-code-wrapper">
              <div className="history-code-label">
                <span>AI Review</span>

                <span>Gemini AI</span>
              </div>

              <div
                className="history-code"
                style={{
                  maxHeight: '520px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedReview.review ||
                  'No review available.'}
              </div>
            </div>
          </article>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------
  // HISTORY LIST
  // -------------------------------------------------------

  return (
    <main className="review-history-page">
      {/* Page heading */}

      <div className="history-header">
        <div className="history-heading">
          <span className="history-eyebrow">
            Your Activity
          </span>

          <h1>Review History</h1>

          <p>
            View and reopen your previously generated AI code
            reviews.
          </p>
        </div>

        <button
          type="button"
          className="history-back-button"
          onClick={onBack}
        >
          ← Back to Reviewer
        </button>
      </div>

      {/* Loading */}

      {isLoading && (
        <div className="history-loading">
          <div className="loader" />

          <span>Loading your review history...</span>
        </div>
      )}

      {/* Error */}

      {!isLoading && error && (
        <div className="history-error">
          {error}
        </div>
      )}

      {/* Empty history */}

      {!isLoading &&
        !error &&
        reviews.length === 0 && (
          <div className="history-empty">
            <div className="history-empty-icon">
              &lt;/&gt;
            </div>

            <h2>No reviews yet</h2>

            <p>
              Your AI code reviews will automatically appear
              here after you submit code for analysis.
            </p>

            <button
              type="button"
              className="history-back-button"
              onClick={onBack}
            >
              Review Some Code
            </button>
          </div>
        )}

      {/* Reviews */}

      {!isLoading &&
        !error &&
        reviews.length > 0 && (
          <>
            {/* Number of reviews */}

            <div className="history-summary">
              <div className="history-count">
                <span className="history-count-dot" />

                <span>
                  <strong>{reviews.length}</strong>{' '}
                  {reviews.length === 1
                    ? 'saved review'
                    : 'saved reviews'}
                </span>
              </div>
            </div>

            {/* Review cards */}

            <div className="history-grid">
              {reviews.map((item) => (
                <article
                  className="history-card"
                  key={item._id}
                >
                  {/* Card header */}

                  <div className="history-card-header">
                    <div className="history-card-meta">
                      <span className="history-language">
                        {formatLanguage(item.language)}
                      </span>

                      <span className="history-date">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {item.score !== null &&
                      item.score !== undefined && (
                        <div
                          className={`history-score ${getScoreClass(
                            item.score
                          )}`}
                        >
                          {item.score}/10
                        </div>
                      )}
                  </div>

                  {/* Code preview */}

                  <div className="history-code-wrapper">
                    <div className="history-code-label">
                      <span>Code Preview</span>

                      <span>
                        {item.code?.length || 0} characters
                      </span>
                    </div>

                    <pre className="history-code">
                      <code>
                        {getCodePreview(item.code)}
                      </code>
                    </pre>
                  </div>

                  {/* Card footer */}

                  <div className="history-card-footer">
                    <span className="history-card-id">
                      Review #{item._id?.slice(-6)}
                    </span>

                    <button
                      type="button"
                      className="history-view-button"
                      onClick={() =>
                        setSelectedReview(item)
                      }
                    >
                      View Full Review →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
    </main>
  );
}

export default ReviewHistory;