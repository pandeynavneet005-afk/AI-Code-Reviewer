import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

console.log('API_URL =', API_URL);

if (!API_URL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[config] VITE_API_URL is not set. Create a .env file from .env.example, ' +
      'otherwise API requests will fail.'
  );
}

// ---------------------------------------------------------
// Axios client
// ---------------------------------------------------------

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------
// JWT interceptor
// ---------------------------------------------------------

/*
 * Automatically attach the logged-in user's JWT
 * to every request sent through this Axios client.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------
// Error handling
// ---------------------------------------------------------

/**
 * Normalizes axios errors into a user-safe message.
 */
function toErrorMessage(error) {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  if (!error.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;

  if (data?.message) {
    return data.message;
  }

  if (status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (status === 429) {
    return 'Too many requests. Please slow down and try again shortly.';
  }

  if (status >= 500) {
    return 'The server ran into a problem. Please try again later.';
  }

  return 'Something went wrong while processing your request.';
}

// ---------------------------------------------------------
// AI code review
// ---------------------------------------------------------

/**
 * Requests an AI-generated code review.
 *
 * JWT is automatically attached by the Axios interceptor.
 *
 * @param {string} code
 * @param {string} language
 * @returns {Promise<string>}
 */
export async function requestCodeReview(
  code,
  language = 'javascript'
) {
  try {
    const response = await apiClient.post(
      '/ai/get-review',
      {
        code,
        language,
      }
    );

    return response.data?.data?.review ?? '';
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

// ---------------------------------------------------------
// Review history
// ---------------------------------------------------------

/**
 * Gets all previous reviews belonging to
 * the currently logged-in user.
 *
 * GET /api/reviews
 *
 * JWT is automatically attached by the Axios interceptor.
 *
 * @returns {Promise<Array>}
 */
export async function getReviewHistory() {
  try {
    const response = await apiClient.get('/api/reviews');

    return response.data?.data?.reviews ?? [];
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

// ---------------------------------------------------------
// Axios client export
// ---------------------------------------------------------

export default apiClient;