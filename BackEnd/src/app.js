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

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Required when deployed behind a reverse proxy (Render, Vercel, etc.)
// so that req.ip / rate limiting see the real client IP.
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(
  morgan(config.isProduction ? 'combined' : 'dev', {
    stream: { write: (message) => logger.http?.(message.trim()) ?? logger.info(message.trim()) },
  })
);

// CORS: only allow explicitly configured origins in production.
// If CORS_ORIGIN is left empty, all origins are allowed (useful for local dev).
const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = config.cors.origins;

    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new AppError(`Origin "${origin}" is not allowed by CORS policy.`, 403));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Code Reviewer API',
    version: '2.0.0',
    docs: '/health for status, POST /ai/get-review for reviews',
  });
});

app.use('/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
