import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);

if (!API_URL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[config] VITE_API_URL is not set. Create a .env file from .env.example, ' +
      'otherwise API requests will fail.'
  );
}

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Normalizes any axios error into a plain, user-safe message string.
 */
function toErrorMessage(error) {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }
  if (!error.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;

  if (data?.message) return data.message;
  if (status === 429) return 'Too many requests. Please slow down and try again shortly.';
  if (status >= 500) return 'The server ran into a problem. Please try again later.';
  return 'Something went wrong while processing your request.';
}

/**
 * Requests an AI-generated code review for the given source code.
 * @param {string} code
 * @returns {Promise<string>} the review, in Markdown
 */
export async function requestCodeReview(code) {
  try {
    const response = await apiClient.post('/ai/get-review', { code });
    return response.data?.data?.review ?? '';
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export default apiClient;
