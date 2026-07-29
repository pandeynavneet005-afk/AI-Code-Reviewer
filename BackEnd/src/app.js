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

// Render runs behind a reverse proxy
app.set('trust proxy', 1);

// =========================================================
// CORS
// =========================================================

const allowedOrigin =
  'https://ai-code-reviewer-eight-tan.vercel.app';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle browser preflight request immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Also use the cors package for normal requests
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);

// =========================================================
// SECURITY
// =========================================================

app.use(helmet());
app.use(compression());

// =========================================================
// BODY PARSING
// =========================================================

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

// =========================================================
// REQUEST LOGGING
// =========================================================

app.use(
  morgan(config.isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) => {
        if (logger.http) {
          logger.http(message.trim());
        } else {
          logger.info(message.trim());
        }
      },
    },
  })
);

// =========================================================
// HEALTH
// =========================================================

app.use('/health', healthRoutes);

// =========================================================
// ROOT API
// =========================================================

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

// =========================================================
// AUTHENTICATION
// =========================================================

app.use('/api/auth', authRoutes);

// =========================================================
// USERS
// =========================================================

app.use('/api/users', userRoutes);

// =========================================================
// REVIEWS
// =========================================================

app.use('/api/reviews', reviewRoutes);

// =========================================================
// AI REVIEW
// =========================================================

app.use('/ai', aiRoutes);

// =========================================================
// 404
// =========================================================

app.use(notFound);

// =========================================================
// ERROR HANDLER
// =========================================================

app.use(errorHandler);

module.exports = app;
