const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/env');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');

const healthRoutes = require('./routes/health.routes');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Required when deployed behind a reverse proxy (Render, Vercel, etc.)
// so that req.ip / rate limiting see the real client IP.
app.set('trust proxy', 1);

// Security and request middleware
app.use(helmet());
app.use(compression());

app.use(express.json({ limit: '1mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

// Request logging
app.use(
  morgan(config.isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) =>
        logger.http?.(message.trim()) ??
        logger.info(message.trim()),
    },
  })
);

// CORS configuration
const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = config.cors.origins;

    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(
      new AppError(
        `Origin "${origin}" is not allowed by CORS policy.`,
        403
      )
    );
  },

  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));

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