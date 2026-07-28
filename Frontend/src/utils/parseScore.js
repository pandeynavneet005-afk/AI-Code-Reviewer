/**
 * Extracts a "Score: X/10" style rating from the AI-generated review text.
 * Returns a number between 0-10, or null if no score is found.
 */
export function parseScore(reviewText) {
  if (!reviewText) return null;

  const match = reviewText.match(/score[:\s]*\**\s*(\d{1,2}(?:\.\d)?)\s*\/\s*10/i);
  if (!match) return null;

  const value = Number(match[1]);
  if (Number.isNaN(value)) return null;

  return Math.min(10, Math.max(0, value));
}
