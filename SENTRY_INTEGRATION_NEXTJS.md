# Sentry Integration Guide (Bugsink)

This document explains how to integrate Sentry error tracking into a Next.js application using Bugsink.

## About Bugsink

Bugsink is a Sentry-compatible error tracking platform hosted at **https://bugsink.digiprodpass.com/**. It uses the same SDK and API as Sentry, making it a drop-in replacement.

**Example Project DSN:**
```
https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1
```

> **Note:** This is an example DSN. Replace it with your actual project DSN from your Bugsink dashboard.

## Installation

Install the Sentry SDK for Next.js:

```bash
npm install @sentry/nextjs
```

## Configuration Files

### 1. Client-Side Configuration (`sentry.client.config.ts`)

Create this file in the root of your project:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Lower this in production to reduce costs
  tracesSampleRate: 1.0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
```

### 2. Server-Side Configuration (`sentry.server.config.ts`)

Create this file in the root of your project:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1", // Replace with your actual DSN

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
```

### 3. Instrumentation Hook (`instrumentation.ts`)

Create this file in the root of your project (Next.js 13+ automatically loads this):

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.server.config');
  }
}
```

### 4. Next.js Configuration (`next.config.ts`)

Update your Next.js config to include Sentry:

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Your existing config here
};

export default withSentryConfig(nextConfig, {
  // Sentry Webpack Plugin options (not SDK options!)
  silent: true, // Suppresses Sentry webpack plugin logs

  // Uncomment for source map upload to Bugsink (requires SENTRY_AUTH_TOKEN):
  // widenClientFileUpload: true,
  // hideSourceMaps: true,
});
```

**Important Notes:**
- The second parameter to `withSentryConfig` accepts **webpack plugin options**, not SDK initialization options
- SDK options like `dsn`, `tracesSampleRate`, and `integrations` belong in `sentry.client.config.ts` and `sentry.server.config.ts` only
- In Next.js 15+, you don't need to set `experimental.instrumentationHook: true` as `instrumentation.ts` is loaded automatically

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

1. Create `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@bugsink.digiprodpass.com/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
```

Replace with your actual DSN from Bugsink dashboard.

2. Update config files to use the environment variable:

```typescript
dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
```

3. Add `.env.local` to `.gitignore` (should be there by default)

## Usage Examples

### Client-Side Error Tracking

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";

export default function MyComponent() {
  const handleClick = () => {
    try {
      // Your code that might throw an error
      throw new Error("Something went wrong!");
    } catch (error) {
      // Capture the error
      Sentry.captureException(error);
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Server-Side Error Tracking (API Routes)

```typescript
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Your API logic
    throw new Error("Server error!");
  } catch (error) {
    // Capture the error
    Sentry.captureException(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Adding Context to Errors

Add additional context to help debug errors:

```typescript
Sentry.setContext("user_info", {
  userId: "123",
  username: "john_doe",
  email: "john@example.com"
});

Sentry.setTag("page", "checkout");
Sentry.setTag("feature", "payment");

// Then capture the error
Sentry.captureException(new Error("Payment failed"));
```

### Setting User Information

```typescript
Sentry.setUser({
  id: "user123",
  email: "user@example.com",
  username: "john_doe"
});
```

### Capturing Messages

For non-error events:

```typescript
Sentry.captureMessage("User completed checkout", "info");
```

### Manual Error Boundaries (React)

```typescript
import * as Sentry from "@sentry/nextjs";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Testing Your Integration

### 1. Test API Route

Create `app/api/test-error/route.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Test error from API route!");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Test error sent to Sentry" },
      { status: 500 }
    );
  }
}
```

Test it:
```bash
curl http://localhost:3000/api/test-error
```

### 2. Test Page

Create `app/test-sentry/page.tsx` with test buttons (see included example).

Visit `http://localhost:3000/test-sentry` to test different error types.

## Production Configuration

For production, adjust these settings:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sample rate in production to reduce costs
  tracesSampleRate: 0.1, // 10% of transactions

  // Sample error events
  sampleRate: 1.0, // 100% of errors

  // Disable debug mode
  debug: false,

  // Set environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
  ],

  // Filter sensitive data
  beforeSend(event, hint) {
    // Don't send events with certain patterns
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message && error.message.match(/database/i)) {
        // Modify or filter the event
        return null; // Return null to drop the event
      }
    }
    return event;
  },
});
```

## Verifying Integration

1. **Check server logs**: Look for "SDK successfully initialized"
2. **Trigger test errors**: Use the test endpoints/buttons
3. **Check Bugsink dashboard**: Visit https://bugsink.digiprodpass.com/ - Errors should appear within seconds
4. **Look for "Captured error event" in logs**: Confirms errors are being sent

## Troubleshooting

### Errors not appearing in Bugsink

- Verify DSN is correct (get it from your Bugsink project settings)
- Check network tab for outgoing requests to `bugsink.digiprodpass.com`
- Enable debug mode: `debug: true`
- Check server logs for Sentry initialization messages
- Verify Bugsink instance is accessible at https://bugsink.digiprodpass.com/

### Next.js build errors

- Ensure all Sentry config files are in the root directory
- Check that `@sentry/nextjs` is installed
- Verify Next.js version compatibility

### Source maps not working

1. Set up authentication token in `.env.local`:
```env
SENTRY_AUTH_TOKEN=your-auth-token-here
```

2. Update `next.config.ts`:
```typescript
export default withSentryConfig(nextConfig, {
  silent: true,
  // Upload source maps
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
```

**Note:** For Bugsink, you may need to generate an auth token from your Bugsink dashboard if source map upload is supported.

## Best Practices

1. **Use environment variables** for DSN and sensitive data
2. **Set appropriate sample rates** in production to control costs
3. **Add context** to errors for better debugging
4. **Filter sensitive data** before sending to Sentry
5. **Set release tracking** to correlate errors with deployments
6. **Use tags** to categorize and filter errors
7. **Implement error boundaries** in React components
8. **Test in development** before deploying to production

## Bugsink-Specific Notes

### Dashboard Access
- URL: https://bugsink.digiprodpass.com/
- Project ID: 1
- All errors from this integration will appear in your Bugsink dashboard

### Network Requests
All error data is sent to `bugsink.digiprodpass.com` instead of `sentry.io`. You can verify this in your browser's network tab when errors are triggered.

### Compatibility
Bugsink is fully compatible with the Sentry SDK, so all Sentry features and documentation apply:
- Error tracking
- Performance monitoring
- Release tracking
- User feedback
- Source maps

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Error Tracking Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- **Bugsink Dashboard**: https://bugsink.digiprodpass.com/
