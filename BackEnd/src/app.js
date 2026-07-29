const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/env');
const logger = require('./utils/logger');

const healthRoutes = require('./routes/health.routes');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Required when deployed behind Render / reverse proxy
app.set('trust proxy', 1);

// ---------------------------------------------------------
// CORS
// ---------------------------------------------------------

const corsOptions = {
  origin: 'https://ai-code-reviewer-eight-tan.vercel.app',

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};

// IMPORTANT: CORS should be registered before routes
app.use(cors(corsOptions));

// ---------------------------------------------------------
// Security and request middleware
// ---------------------------------------------------------

app.use(helmet());
app.use(compression());

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

// ---------------------------------------------------------
// Request logging
// ---------------------------------------------------------

app.use(
  morgan(config.isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) =>
        logger.http?.(message.trim()) ??
        logger.info(message.trim()),
    },
  })
);

// ---------------------------------------------------------
// Health route
// ---------------------------------------------------------

app.use('/health', healthRoutes);

// ---------------------------------------------------------
// API information
// ---------------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Code Reviewer API',
    version: '2.0.0',

    docs: {
      health: 'GET /health',
      review: 'POST /ai/get-review',
      reviewHistory: 'GET /api/reviews',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/users/me',
    },
  });
});

// ---------------------------------------------------------
// Authentication routes
// ---------------------------------------------------------

app.use('/api/auth', authRoutes);

// ---------------------------------------------------------
// User routes
// ---------------------------------------------------------

app.use('/api/users', userRoutes);

// ---------------------------------------------------------
// Review history routes
// ---------------------------------------------------------

app.use('/api/reviews', reviewRoutes);

// ---------------------------------------------------------
// AI review routes
// ---------------------------------------------------------

app.use('/ai', aiRoutes);

// ---------------------------------------------------------
// Error handling
// ---------------------------------------------------------

app.use(notFound);
app.use(errorHandler);

module.exports = app;
