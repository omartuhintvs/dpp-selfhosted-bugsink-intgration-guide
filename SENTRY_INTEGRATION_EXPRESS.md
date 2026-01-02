# Sentry Integration Guide for Express.js (Bugsink)

This document explains how to integrate Sentry error tracking into an Express.js application using Bugsink.

## About Bugsink

Bugsink is a Sentry-compatible error tracking platform hosted at **https://bugsink.digiprodpass.com/**. It uses the same SDK and API as Sentry, making it a drop-in replacement.

**Example Project DSN:**
```
https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1
```

> **Note:** This is an example DSN. Replace it with your actual project DSN from your Bugsink dashboard.

## Installation

Install the Sentry SDK for Node.js:

```bash
npm install @sentry/node @sentry/profiling-node
```

## Basic Configuration

### 1. Initialize Sentry in Your Express App

Create a file `config/sentry.js` (or integrate directly in your main app file):

```javascript
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

function initSentry(app) {
  Sentry.init({
    dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // Lower this in production to reduce costs
    tracesSampleRate: 1.0,

    // Set profilesSampleRate to profile 100% of sampled transactions.
    profilesSampleRate: 1.0,

    // Set environment
    environment: process.env.NODE_ENV || 'development',

    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Performance Monitoring integrations
    integrations: [
      nodeProfilingIntegration(),
    ],
  });

  // RequestHandler creates a separate execution context, so that all transactions/spans/breadcrumbs
  // are isolated across requests
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

module.exports = { initSentry, Sentry };
```

### 2. Update Your Express App (`app.js` or `server.js`)

**IMPORTANT:** Sentry must be initialized **before** you require any other modules!

```javascript
// Import Sentry FIRST, before any other modules
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

// Initialize Sentry
Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    nodeProfilingIntegration(),
  ],
});

// Now import other modules
const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sentry request handler must be the first middleware
app.use(Sentry.Handlers.requestHandler());

// Sentry tracing handler must come after request handler
app.use(Sentry.Handlers.tracingHandler());

// Your routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Import routes after Sentry initialization
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Sentry error handler must be registered before any other error middleware
// and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallback error handler
app.use((err, req, res, next) => {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.status(err.status || 500).json({
    error: err.message,
    sentryErrorId: res.sentry,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

## TypeScript Configuration

For TypeScript projects:

### 1. Install TypeScript types

```bash
npm install --save-dev @types/express
```

### 2. Create `config/sentry.ts`

```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { Express } from "express";

export function initSentry(app: Express): void {
  Sentry.init({
    dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.NODE_ENV === 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

export { Sentry };
```

### 3. Update `app.ts` or `server.ts`

```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express, { Request, Response, NextFunction } from "express";

// Initialize Sentry FIRST
Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    nodeProfilingIntegration(),
  ],
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sentry handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

// Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// Optional fallback error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: err.message,
    sentryErrorId: (res as any).sentry,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

## DSN Configuration

Your Sentry DSN (Data Source Name) format:

```
https://<public_key>@<host>/<project_id>
```

**Example DSN:**
```
https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1
```

Where:
- `6f851a3a441b45ddb1b24bfe54d25ec3` = Your project's public key
- `bugsink.digiprodpass.com` = Bugsink host
- `1` = Your project ID

> **Important:** Replace the example DSN throughout this guide with your actual DSN from your Bugsink project settings.

### Using Environment Variables (Recommended)

Instead of hardcoding the DSN, use environment variables:

1. Create `.env`:

```env
NODE_ENV=development
SENTRY_DSN=https://your-key@bugsink.digiprodpass.com/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
PORT=3000
```

2. Install dotenv:

```bash
npm install dotenv
```

3. Load environment variables at the top of your app:

```javascript
require('dotenv').config();
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // ... other options
});
```

4. Add `.env` to `.gitignore`:

```
.env
.env.local
```

## Usage Examples

### Capturing Exceptions

```javascript
const Sentry = require("@sentry/node");

app.get("/error-example", (req, res) => {
  try {
    // Your code that might throw an error
    throw new Error("Something went wrong!");
  } catch (error) {
    // Capture the error
    Sentry.captureException(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### Capturing Messages

```javascript
app.post("/user/signup", (req, res) => {
  // Capture informational message
  Sentry.captureMessage("New user signed up", "info");

  res.json({ success: true });
});
```

### Adding Context to Errors

```javascript
app.post("/payment", async (req, res) => {
  try {
    // Set user context
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    });

    // Set custom context
    Sentry.setContext("payment_info", {
      amount: req.body.amount,
      currency: req.body.currency,
      payment_method: req.body.method,
    });

    // Add tags for filtering
    Sentry.setTag("payment_method", req.body.method);
    Sentry.setTag("currency", req.body.currency);

    // Your payment logic here
    const result = await processPayment(req.body);

    res.json({ success: true, result });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Payment failed" });
  }
});
```

### Using Middleware for Context

```javascript
// Middleware to set user context for all requests
app.use((req, res, next) => {
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      ip_address: req.ip,
    });
  }
  next();
});
```

### Adding Breadcrumbs

```javascript
app.post("/checkout", async (req, res) => {
  // Add breadcrumb to track user actions
  Sentry.addBreadcrumb({
    category: "checkout",
    message: "User initiated checkout",
    level: "info",
    data: {
      cart_items: req.body.items.length,
      total: req.body.total,
    },
  });

  try {
    const order = await createOrder(req.body);

    Sentry.addBreadcrumb({
      category: "checkout",
      message: "Order created successfully",
      level: "info",
      data: { order_id: order.id },
    });

    res.json({ success: true, order });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Checkout failed" });
  }
});
```

### Creating Custom Transactions

```javascript
app.get("/complex-operation", async (req, res) => {
  const transaction = Sentry.startTransaction({
    op: "complex-operation",
    name: "Complex Data Processing",
  });

  try {
    // Start a span for database query
    const dbSpan = transaction.startChild({
      op: "db.query",
      description: "Fetch user data",
    });
    const userData = await fetchUserData();
    dbSpan.finish();

    // Start a span for external API call
    const apiSpan = transaction.startChild({
      op: "http.client",
      description: "Call external API",
    });
    const apiData = await callExternalAPI();
    apiSpan.finish();

    transaction.finish();
    res.json({ userData, apiData });
  } catch (error) {
    transaction.finish();
    Sentry.captureException(error);
    res.status(500).json({ error: "Operation failed" });
  }
});
```

### Async Error Handling

```javascript
// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    Sentry.captureException(error);
    next(error);
  });
};

// Use with async routes
app.get("/async-route", asyncHandler(async (req, res) => {
  const data = await someAsyncOperation();
  res.json(data);
}));
```

## Testing Your Integration

### 1. Create Test Routes

Create `routes/test-sentry.js`:

```javascript
const express = require("express");
const Sentry = require("@sentry/node");
const router = express.Router();

// Test 1: Throw an error
router.get("/error", (req, res) => {
  throw new Error("Test error from Express route!");
});

// Test 2: Capture exception manually
router.get("/capture-exception", (req, res) => {
  try {
    throw new Error("Manually captured test error!");
  } catch (error) {
    Sentry.captureException(error);
    res.json({ message: "Error captured and sent to Sentry" });
  }
});

// Test 3: Capture message
router.get("/capture-message", (req, res) => {
  Sentry.captureMessage("Test message from Express", "info");
  res.json({ message: "Message sent to Sentry" });
});

// Test 4: Error with context
router.get("/error-with-context", (req, res) => {
  Sentry.setUser({
    id: "test-user-123",
    email: "test@example.com",
  });

  Sentry.setContext("test_context", {
    testValue: "sample data",
    timestamp: new Date().toISOString(),
  });

  Sentry.setTag("test", "true");

  throw new Error("Test error with context!");
});

// Test 5: Async error
router.get("/async-error", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error("Test async error!");
});

module.exports = router;
```

Add to your `app.js`:

```javascript
const testSentryRoutes = require("./routes/test-sentry");
app.use("/test-sentry", testSentryRoutes);
```

### 2. Test Endpoints

```bash
# Test throwing an error
curl http://localhost:3000/test-sentry/error

# Test capturing an exception
curl http://localhost:3000/test-sentry/capture-exception

# Test capturing a message
curl http://localhost:3000/test-sentry/capture-message

# Test error with context
curl http://localhost:3000/test-sentry/error-with-context

# Test async error
curl http://localhost:3000/test-sentry/async-error
```

## Production Configuration

For production, adjust these settings:

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Lower sample rate in production to reduce costs
  tracesSampleRate: 0.1, // 10% of transactions
  profilesSampleRate: 0.1, // 10% of transactions

  // Sample error events
  sampleRate: 1.0, // 100% of errors

  // Disable debug mode
  debug: false,

  // Set environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.RELEASE_VERSION || process.env.HEROKU_SLUG_COMMIT,

  // Ignore certain errors
  ignoreErrors: [
    // Browser-specific errors that might appear in logs
    'Non-Error exception captured',
    'Non-Error promise rejection captured',
  ],

  // Filter sensitive data
  beforeSend(event, hint) {
    // Don't send events with certain patterns
    const error = hint.originalException;

    if (error && error.message) {
      // Filter out errors containing sensitive keywords
      if (error.message.match(/password|token|secret/i)) {
        return null; // Don't send to Sentry
      }
    }

    // Remove sensitive data from request
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }

    return event;
  },

  // Custom integrations
  integrations: [
    nodeProfilingIntegration(),
    // Add more integrations as needed
  ],
});
```

## Advanced Features

### Request Data

By default, Sentry captures request data. You can customize this:

```javascript
app.use(Sentry.Handlers.requestHandler({
  // What data to include in events
  request: ['cookies', 'data', 'headers', 'method', 'query_string', 'url'],
  // Include user information from req.user
  user: ['id', 'username', 'email'],
}));
```

### Custom Error Handler

```javascript
app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all 4xx and 5xx errors
    if (error.status >= 400) {
      return true;
    }
    return false;
  },
}));
```

### Database Integration (Prisma Example)

```javascript
const { PrismaClient } = require('@prisma/client');
const Sentry = require('@sentry/node');

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

// Log database errors to Sentry
prisma.$on('error', (e) => {
  Sentry.captureException(new Error(`Database error: ${e.message}`), {
    contexts: {
      database: {
        target: e.target,
        timestamp: e.timestamp,
      },
    },
  });
});
```

### Winston Logger Integration

```javascript
const winston = require('winston');
const Sentry = require('@sentry/node');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Add Sentry transport for errors
logger.add({
  log(info, callback) {
    setImmediate(() => {
      if (info.level === 'error') {
        Sentry.captureException(new Error(info.message), {
          extra: info,
        });
      }
    });
    callback();
  },
});

module.exports = logger;
```

## Verifying Integration

1. **Check server logs**: Look for "Sentry SDK initialized"
2. **Trigger test errors**: Use the test endpoints
3. **Check Bugsink dashboard**: Visit https://bugsink.digiprodpass.com/ - Errors should appear within seconds
4. **Check network traffic**: Look for requests to `bugsink.digiprodpass.com` in server logs

## Troubleshooting

### Errors not appearing in Bugsink

- Verify DSN is correct (get it from your Bugsink project settings)
- Ensure Sentry is initialized **before** any other modules are required
- Check that error handler middleware is placed **after** all routes
- Enable debug mode: `debug: true`
- Check server logs for Sentry initialization messages
- Verify Bugsink instance is accessible at https://bugsink.digiprodpass.com/

### Sentry handlers not working

- Ensure request handler is added **before** routes
- Ensure error handler is added **after** routes but **before** other error handlers
- Check middleware order in your Express app

### Missing request data

- Verify `requestHandler` is configured with the correct options
- Ensure body-parser or express.json() middleware is set up correctly

### Performance issues

- Lower `tracesSampleRate` in production
- Lower `profilesSampleRate` in production
- Disable profiling in development if not needed

## Best Practices

1. **Use environment variables** for DSN and sensitive data
2. **Initialize Sentry first** before importing other modules
3. **Set appropriate sample rates** in production to control costs
4. **Add context and tags** to errors for better debugging
5. **Filter sensitive data** before sending to Sentry (passwords, tokens, etc.)
6. **Set release tracking** to correlate errors with deployments
7. **Use breadcrumbs** to track user actions leading to errors
8. **Implement proper error handling** with async/await
9. **Test in development** before deploying to production
10. **Monitor Sentry quota** to avoid unexpected charges

## Bugsink-Specific Notes

### Dashboard Access
- URL: https://bugsink.digiprodpass.com/
- Project ID: 1
- All errors from this integration will appear in your Bugsink dashboard

### Network Requests
All error data is sent to `bugsink.digiprodpass.com` instead of `sentry.io`. You can verify this in your server logs when errors are triggered.

### Compatibility
Bugsink is fully compatible with the Sentry SDK, so all Sentry features and documentation apply:
- Error tracking
- Performance monitoring
- Release tracking
- User context
- Custom tags and context
- Breadcrumbs

## Additional Resources

- [Sentry Node.js Documentation](https://docs.sentry.io/platforms/node/)
- [Sentry Express Documentation](https://docs.sentry.io/platforms/node/guides/express/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- **Bugsink Dashboard**: https://bugsink.digiprodpass.com/
