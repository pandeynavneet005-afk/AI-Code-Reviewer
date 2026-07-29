import { useCallback, useState } from 'react';
import { requestCodeReview } from '../services/api';

const DEFAULT_CODE = `function sum(a, b) {
  return a + b
}`;

export function useCodeReview(language = 'javascript') {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const runReview = useCallback(async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await requestCodeReview(code, language);
      setReview(result);
    } catch (err) {
      setError(
        err.message || 'Failed to get a review. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [code, language, isLoading]);

  const clearAll = useCallback(() => {
    setCode('');
    setReview('');
    setError('');
  }, []);

  return {
    code,
    setCode,
    review,
    isLoading,
    error,
    runReview,
    clearAll,
  };
}