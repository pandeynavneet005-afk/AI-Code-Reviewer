import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import ScoreRing from './ScoreRing';
import { parseScore } from '../utils/parseScore';

function ReviewIcon() {
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
        d="M9 11l2 2 4-4M12 3a9 9 0 1 0 9 9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 4h4v4"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard API unavailable.
    }
  }

  return (
    <button
      type="button"
      className={`btn btn-ghost btn-small copy-button ${
        copied ? 'copy-success' : ''
      }`}
      onClick={handleCopy}
      disabled={!text}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? 'Copied' : 'Copy Review'}</span>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="review-loading">
      <div className="loading-heading">
        <span className="spinner" aria-hidden="true" />

        <div>
          <strong>Analyzing your code</strong>
          <span>Gemini is preparing a detailed review...</span>
        </div>
      </div>

      <div className="skeleton-group" aria-hidden="true">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-block" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-visual" aria-hidden="true">
        <span className="empty-state-icon">{'</>'}</span>
        <span className="empty-sparkle empty-sparkle-one">✦</span>
        <span className="empty-sparkle empty-sparkle-two">✦</span>
      </div>

      <h3>Ready to review your code</h3>

      <p>
        Paste or write your code in the editor and let AI analyze it for
        potential issues and improvements.
      </p>

      <div className="empty-features">
        <span>✓ Bug detection</span>
        <span>✓ Code quality</span>
        <span>✓ Best practices</span>
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-icon" aria-hidden="true">
        !
      </div>

      <div>
        <strong>Review failed</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default function ReviewPanel({ review, isLoading, error }) {
  const score = parseScore(review);

  return (
    <div className="panel review-panel">
      <div className="panel-header review-header">
        <div className="panel-heading">
          <div className="panel-icon">
            <ReviewIcon />
          </div>

          <div>
            <span className="panel-title">AI Review</span>
            <span className="panel-subtitle">
              Detailed analysis and recommendations
            </span>
          </div>
        </div>

        <div className="panel-header-actions">
          {score !== null && (
            <div className="score-wrapper">
              <span className="score-label">Quality Score</span>
              <ScoreRing score={score} />
            </div>
          )}

          <CopyButton text={review} />
        </div>
      </div>

      <div className="review-scroll">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <ErrorState message={error} />
        )}

        {!isLoading && !error && !review && <EmptyState />}

        {!isLoading && !error && review && (
          <div className="review-result">
            <div className="review-result-status">
              <span className="review-success-dot" aria-hidden="true" />
              <span>Analysis complete</span>
            </div>

            <div className="markdown-body">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}