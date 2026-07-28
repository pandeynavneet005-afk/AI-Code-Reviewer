import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import ScoreRing from './ScoreRing';
import { parseScore } from '../utils/parseScore';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently.
    }
  }

  return (
    <button type="button" className="btn btn-ghost btn-small" onClick={handleCopy} disabled={!text}>
      {copied ? 'Copied ✓' : 'Copy review'}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="skeleton-group" aria-hidden="true">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-block" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">
        ⟡
      </span>
      <p>Your review will appear here.</p>
      <p className="empty-state-hint">Write or paste some code, then click "Review code".</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state-icon" aria-hidden="true">
        ⚠
      </span>
      <p>{message}</p>
    </div>
  );
}

export default function ReviewPanel({ review, isLoading, error }) {
  const score = parseScore(review);

  return (
    <div className="panel review-panel">
      <div className="panel-header">
        <span className="panel-title">Review</span>
        <div className="panel-header-actions">
          {score !== null && <ScoreRing score={score} />}
          <CopyButton text={review} />
        </div>
      </div>

      <div className="review-scroll">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && error && <ErrorState message={error} />}
        {!isLoading && !error && !review && <EmptyState />}
        {!isLoading && !error && review && (
          <div className="markdown-body">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
