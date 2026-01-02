# Express + Sentry/Bugsink Demo Application

A simple demonstration Express.js application with Sentry/Bugsink error tracking integration.

## Features

- Complete Sentry/Bugsink integration with error tracking
- Performance monitoring with transactions and spans
- Multiple test endpoints for different error scenarios
- Simple API example
- Breadcrumb tracking for debugging
- User context and custom tags
- Environment-based configuration

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation

1. **Navigate to the project directory:**

```bash
cd express-sentry-demo
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables (optional):**

The demo works out of the box with an example DSN. To use your own:

Edit `.env` and update your Sentry DSN:

```env
NODE_ENV=development
PORT=3000
SENTRY_DSN=https://your-key@bugsink.digiprodpass.com/your-project-id
```

> Get your DSN from your Bugsink dashboard at https://bugsink.digiprodpass.com/

## Running the Application

Start the Express server with all test endpoints:

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### General

- `GET /` - API documentation and available endpoints
- `GET /health` - Health check endpoint

### Sentry Test Endpoints

Test different Sentry error scenarios:

| Endpoint | Description |
|----------|-------------|
| `GET /test-sentry` | List all test endpoints |
| `GET /test-sentry/error` | Throws an unhandled error |
| `GET /test-sentry/capture-exception` | Manually captures an exception |
| `GET /test-sentry/capture-message` | Sends a message to Sentry |
| `GET /test-sentry/error-with-context` | Error with user context and tags |
| `GET /test-sentry/async-error` | Async error example |
| `GET /test-sentry/breadcrumbs` | Error with breadcrumb trail |
| `GET /test-sentry/random-error` | Random error type |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/users` | GET | Get all users |
| `GET /api/users/:id` | GET | Get user by ID |

## Testing Sentry Integration

Start the server:

```bash
npm start
```

Then test the endpoints using curl or your browser:

```bash
# Test basic error
curl http://localhost:3000/test-sentry/error

# Test manual exception capture
curl http://localhost:3000/test-sentry/capture-exception

# Test message capture
curl http://localhost:3000/test-sentry/capture-message

# Test with context
curl http://localhost:3000/test-sentry/error-with-context

# Test breadcrumbs
curl http://localhost:3000/test-sentry/breadcrumbs

# Test random error
curl http://localhost:3000/test-sentry/random-error

# Test API
curl http://localhost:3000/api/users
```

### 3. Verify in Bugsink

1. Visit your Bugsink dashboard: https://bugsink.digiprodpass.com/
2. Check for the errors you just triggered
3. Inspect error details, breadcrumbs, and context
4. Review performance transactions (if enabled)

## Project Structure

```
express-sentry-demo/
├── app.js           # Main Express application with Sentry setup
├── package.json     # Dependencies and scripts
├── .env            # Environment variables (optional)
└── README.md       # This file
```

## Key Implementation Details

### Sentry Initialization Order

**CRITICAL:** Sentry must be initialized **before** importing other modules:

```javascript
// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Initialize Sentry SECOND (before other imports)
const Sentry = require("@sentry/node");
Sentry.init({ /* config */ });

// 3. Import other modules AFTER Sentry
const express = require("express");
```

### Middleware Order

Proper middleware ordering is crucial (see `app.js`):

```javascript
// 1. Basic middleware
app.use(express.json());

// 2. Sentry request handler (FIRST)
app.use(Sentry.Handlers.requestHandler());

// 3. Sentry tracing handler (SECOND)
app.use(Sentry.Handlers.tracingHandler());

// 4. Your routes
app.get('/test-sentry/error', ...);

// 5. Sentry error handler (AFTER all routes)
app.use(Sentry.Handlers.errorHandler());

// 6. Custom error handler (LAST)
app.use((err, req, res, next) => { /* ... */ });
```

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `SENTRY_DSN` | Sentry/Bugsink DSN | Example DSN |
| `SENTRY_TRACES_SAMPLE_RATE` | Transaction sampling (0.0-1.0) | `1.0` |
| `SENTRY_PROFILES_SAMPLE_RATE` | Profile sampling (0.0-1.0) | `1.0` |

### Production Recommendations

For production, adjust these settings in your `.env`:

```env
NODE_ENV=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% of profiles
```

## Features Demonstrated

### 1. Error Tracking
- Unhandled exceptions
- Manual exception capture
- Async error handling
- Different error types

### 2. Context & Tags
- User context
- Custom context objects
- Tags for filtering
- Breadcrumbs for debugging

### 3. Performance Monitoring
- Transaction tracking
- Custom spans
- Database query timing
- API call monitoring

### 4. Best Practices
- Environment-based configuration
- Proper middleware ordering
- Graceful error handling
- Security (filtering sensitive data)

## Troubleshooting

### Errors not appearing in Bugsink

1. Check your DSN in `.env` is correct
2. Verify Sentry initialization happens first
3. Check server console for Sentry messages
4. Enable debug mode: set `debug: true` in Sentry.init()

### Server won't start

1. Check if port 3000 is already in use
2. Verify all dependencies are installed: `npm install`
3. Check `.env` file exists and is valid

### TypeScript errors (if using TypeScript)

Install type definitions:
```bash
npm install --save-dev @types/express @types/node
```

## Documentation

For more details, see:
- [Sentry Node.js Documentation](https://docs.sentry.io/platforms/node/)
- [Sentry Express Guide](https://docs.sentry.io/platforms/node/guides/express/)
- [SENTRY_INTEGRATION_EXPRESS.md](../SENTRY_INTEGRATION_EXPRESS.md) - Full integration guide

## License

MIT

## Support

For issues or questions:
- Check the [Sentry documentation](https://docs.sentry.io)
- Visit your Bugsink dashboard: https://bugsink.digiprodpass.com/
- Review the integration guide in the parent directory
