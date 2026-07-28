require('dotenv').config();

/**
 * Centralized, validated application configuration.
 * All environment variable access should go through this module so that
 * misconfiguration fails fast, at startup, with a clear error message.
 */

function parseOrigins(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function requireEnv(name, { fallback, required = false } = {}) {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    if (required) {
      throw new Error(
        `Missing required environment variable: "${name}". ` +
          'Copy .env.example to .env and provide a value.'
      );
    }
    return fallback;
  }

  return value;
}

const NODE_ENV = requireEnv('NODE_ENV', { fallback: 'development' });
const isProduction = NODE_ENV === 'production';

const config = Object.freeze({
  nodeEnv: NODE_ENV,
  isProduction,
  port: Number(requireEnv('PORT', { fallback: '3000' })),

  gemini: Object.freeze({
    apiKey: requireEnv('GOOGLE_GEMINI_KEY', { required: true }),
    model: requireEnv('GEMINI_MODEL', { fallback: 'gemini-2.0-flash' }),
  }),

  cors: Object.freeze({
    origins: parseOrigins(requireEnv('CORS_ORIGIN', { fallback: '' })),
  }),

  rateLimit: Object.freeze({
    windowMs: Number(requireEnv('RATE_LIMIT_WINDOW_MS', { fallback: '900000' })),
    max: Number(requireEnv('RATE_LIMIT_MAX_REQUESTS', { fallback: '60' })),
  }),

  review: Object.freeze({
    maxCodeLength: Number(requireEnv('MAX_CODE_LENGTH', { fallback: '20000' })),
  }),

  logLevel: requireEnv('LOG_LEVEL', { fallback: 'info' }),
});

module.exports = config;
