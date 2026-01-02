#!/usr/bin/env node

/**
 * Express + Sentry/Bugsink Demo Application
 *
 * This demonstrates proper Sentry integration with an Express.js server.
 * CRITICAL: Sentry must be initialized BEFORE other imports.
 */

// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Initialize Sentry BEFORE other imports
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Use 10% sample rate in production, 100% in development
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) ||
    (process.env.NODE_ENV === 'production' ? 0.1 : 1.0),
  profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE) ||
    (process.env.NODE_ENV === 'production' ? 0.1 : 1.0),

  environment: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV === 'development',

  integrations: [
    nodeProfilingIntegration(),
  ],

  // Filter sensitive data before sending to Bugsink
  beforeSend(event, hint) {
    // Remove sensitive data from error messages and stack traces
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map(exception => {
        if (exception.value) {
          // Redact common sensitive patterns
          exception.value = exception.value
            .replace(/password["\s:=]+[^\s&"]*/gi, 'password=***REDACTED***')
            .replace(/token["\s:=]+[^\s&"]*/gi, 'token=***REDACTED***')
            .replace(/api[_-]?key["\s:=]+[^\s&"]*/gi, 'api_key=***REDACTED***')
            .replace(/secret["\s:=]+[^\s&"]*/gi, 'secret=***REDACTED***')
            .replace(/authorization:\s*bearer\s+\S+/gi, 'authorization: bearer ***REDACTED***')
            .replace(/mongodb:\/\/[^@]+@/gi, 'mongodb://***REDACTED***@')
            .replace(/postgres:\/\/[^@]+@/gi, 'postgres://***REDACTED***@')
            .replace(/mysql:\/\/[^@]+@/gi, 'mysql://***REDACTED***@');
        }
        return exception;
      });
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-api-key'];
    }

    // Remove cookies
    if (event.request?.cookies) {
      delete event.request.cookies;
    }

    // Remove sensitive query params
    if (event.request?.query_string) {
      const sensitiveParams = ['password', 'token', 'api_key', 'secret', 'key', 'auth'];
      let queryString = event.request.query_string;
      sensitiveParams.forEach(param => {
        const regex = new RegExp(`${param}=[^&]*`, 'gi');
        queryString = queryString.replace(regex, `${param}=***REDACTED***`);
      });
      event.request.query_string = queryString;
    }

    return event;
  },
});

// 3. NOW import other modules
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Routes ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sentry: 'enabled'
  });
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Express + Sentry/Bugsink Demo',
    endpoints: {
      health: 'GET /health',
      test_sentry: {
        list: 'GET /test-sentry',
        error: 'GET /test-sentry/error',
        capture_exception: 'GET /test-sentry/capture-exception',
        capture_message: 'GET /test-sentry/capture-message',
        error_with_context: 'GET /test-sentry/error-with-context',
        async_error: 'GET /test-sentry/async-error',
        breadcrumbs: 'GET /test-sentry/breadcrumbs',
        random_error: 'GET /test-sentry/random-error',
      },
      api: {
        users: 'GET /api/users',
      }
    },
    bugsink: 'https://bugsink.digiprodpass.com/'
  });
});

// ==================== Sentry Test Endpoints ====================

app.get('/test-sentry', (req, res) => {
  res.json({
    message: 'Sentry test endpoints',
    endpoints: [
      'GET /test-sentry/error - Throws unhandled error',
      'GET /test-sentry/capture-exception - Manual exception capture',
      'GET /test-sentry/capture-message - Send message to Sentry',
      'GET /test-sentry/error-with-context - Error with user context',
      'GET /test-sentry/async-error - Async error example',
      'GET /test-sentry/breadcrumbs - Error with breadcrumbs',
      'GET /test-sentry/random-error - Random error type',
    ]
  });
});

// Test 1: Unhandled error
app.get('/test-sentry/error', (req, res) => {
  throw new Error('Test error from Express endpoint!');
});

// Test 2: Manual exception capture
app.get('/test-sentry/capture-exception', (req, res) => {
  try {
    throw new Error('Manually captured exception from Express');
  } catch (error) {
    Sentry.captureException(error);
    res.json({
      message: 'Exception captured and sent to Sentry',
      error: error.message
    });
  }
});

// Test 3: Capture message
app.get('/test-sentry/capture-message', (req, res) => {
  Sentry.captureMessage('Test message from Express endpoint', 'info');
  res.json({ message: 'Message sent to Sentry' });
});

// Test 4: Error with context
app.get('/test-sentry/error-with-context', (req, res) => {
  // Set user context
  Sentry.setUser({
    id: '123',
    email: 'test@example.com',
    username: 'test_user'
  });

  // Add custom context
  Sentry.setContext('request_info', {
    endpoint: '/test-sentry/error-with-context',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });

  // Add tags
  Sentry.setTag('test', 'true');
  Sentry.setTag('endpoint', 'error-with-context');

  throw new Error('Error with full context from Express');
});

// Test 5: Async error
app.get('/test-sentry/async-error', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Async error from Express'));
      }, 100);
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Async error occurred',
      message: error.message
    });
  }
});

// Test 6: Error with breadcrumbs
app.get('/test-sentry/breadcrumbs', (req, res) => {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: 'User navigated to breadcrumbs test',
    level: 'info'
  });

  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Processing user data',
    level: 'info',
    data: { userId: 123 }
  });

  Sentry.addBreadcrumb({
    category: 'error',
    message: 'About to throw error',
    level: 'warning'
  });

  throw new Error('Error with breadcrumbs from Express');
});

// Test 7: Random error types
app.get('/test-sentry/random-error', (req, res) => {
  const errorTypes = [
    { type: 'TypeError', message: 'Cannot read property of undefined' },
    { type: 'ReferenceError', message: 'Variable is not defined' },
    { type: 'RangeError', message: 'Array length is invalid' },
    { type: 'ValidationError', message: 'Invalid user input' },
    { type: 'DatabaseError', message: 'Connection failed' },
  ];

  const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  const error = new Error(randomError.message);
  error.name = randomError.type;

  Sentry.setContext('error_info', {
    errorType: randomError.type,
    timestamp: new Date().toISOString(),
    randomId: Math.random().toString(36).substring(7)
  });

  throw error;
});

// ==================== API Routes ====================

// Simple users API
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

app.get('/api/users', (req, res) => {
  res.json({ users });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    const error = new Error('User not found');
    Sentry.captureException(error);
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// ==================== Sentry Error Handler ====================

// Setup Sentry error handler - this must be AFTER all routes
// This automatically catches and reports errors to Sentry
Sentry.setupExpressErrorHandler(app);

// Optional: Custom error handler after Sentry (for custom error responses)
app.use((err, _req, res, _next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    sentToSentry: true
  });
});

// ==================== Start Server ====================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Express + Sentry/Bugsink Demo Server                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Sentry DSN: ${process.env.SENTRY_DSN ? 'Configured from .env' : 'Using example DSN'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  GET  http://localhost:${PORT}/test-sentry`);
  console.log(`  GET  http://localhost:${PORT}/test-sentry/error`);
  console.log(`  GET  http://localhost:${PORT}/api/users`);
  console.log('\nBugsink Dashboard: https://bugsink.digiprodpass.com/');
  console.log('Press Ctrl+C to stop\n');
});
