# Next.js + Sentry/Bugsink Demo

A Next.js 16 application demonstrating comprehensive Sentry error tracking integration with Bugsink (self-hosted Sentry-compatible platform).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## 🧪 Test Error Tracking

### Interactive Test Page
http://localhost:3000/test-sentry

Features four test buttons:
1. **Throw Client-Side Error** - Browser error tracking
2. **Trigger Server-Side Error** - API route error tracking
3. **Capture Manual Error** - Manual Sentry.captureException
4. **Throw Random Error** - Random error types with context

### API Endpoints

```bash
# Trigger test error
curl http://localhost:3000/api/test-error

# Check active integrations
curl http://localhost:3000/api/check-integrations
```

## 📚 Documentation

For complete integration guides, see the root directory:
- **[SENTRY_INTEGRATION_NEXTJS.md](../SENTRY_INTEGRATION_NEXTJS.md)** - Complete Next.js setup guide
- **[Main README](../README.md)** - Repository overview and quick start

## 🔧 Tech Stack

- **Next.js:** 16.1.1 (App Router, Turbopack)
- **React:** 19.x
- **TypeScript:** 5.x
- **Tailwind CSS:** 3.x
- **Sentry SDK:** 10.32.1
- **Error Platform:** Bugsink

## 🐛 Bugsink Configuration

**Dashboard:** https://bugsink.digiprodpass.com/
**Project ID:** 1
**DSN:** `https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1`

### Active Integrations (44 total)
✓ Http (handling requests)
✓ Express (available)
✓ NodeFetch
✓ Database integrations (Postgres, MySQL, MongoDB, Redis, Prisma)
✓ AI integrations (OpenAI, Anthropic, LangChain, Google GenAI)
✓ Framework integrations (Fastify, Hono, Koa, Hapi)

## 📁 Project Structure

```
nextjs-demo/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── test-error/          # Error test endpoint
│   │   └── check-integrations/  # Integration check endpoint
│   ├── test-sentry/             # Test page for error tracking
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                       # Static assets
├── sentry.client.config.ts       # Client-side Sentry config
├── sentry.server.config.ts       # Server-side Sentry config
├── instrumentation.ts            # Sentry initialization
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS config
└── package.json                  # Dependencies & scripts
```

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🔍 Verification

### Check Integration Status
```bash
curl http://localhost:3000/api/check-integrations | jq .
```

Expected response:
```json
{
  "sdkVersion": "10.32.1",
  "dsn": "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1",
  "environment": "development",
  "totalIntegrations": 44,
  "serverType": {
    "isNextJs": true,
    "usesExpress": true,
    "usesHttp": true
  }
}
```

### Server Logs to Look For
```
✓ SDK successfully initialized
✓ Integration installed: Http
✓ Integration installed: Express
✓ Captured error event `<error message>`
✓ Ready in XXXms
```

## 💻 Usage Examples

### Capture Exception
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  throw new Error("Something went wrong!");
} catch (error) {
  Sentry.captureException(error);
}
```

### Capture Message
```typescript
Sentry.captureMessage("User completed checkout", "info");
```

### Set User Context
```typescript
Sentry.setUser({
  id: "user123",
  email: "user@example.com",
  username: "john_doe"
});
```

### Add Custom Context
```typescript
Sentry.setContext("order_details", {
  orderId: "ABC123",
  total: 99.99,
  items: 3
});

Sentry.setTag("page", "checkout");
Sentry.setTag("feature", "payment");
```

### Error Boundary (React)
```typescript
import * as Sentry from "@sentry/nextjs";
import { Component, ErrorInfo } from "react";

class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  // ... rest of component
}
```

## 🎨 Test Page Features

The `/test-sentry` page demonstrates:

### Random Error Generation
Generates 10 different error types:
- TypeError
- ReferenceError
- RangeError
- NetworkError
- ValidationError
- AuthError
- DatabaseError
- TimeoutError
- ParseError
- PermissionError

Each error includes:
- Custom error name
- Descriptive message
- Random context data (timestamp, errorType, randomId)

### Visual Design
- Clean, modern UI with Tailwind CSS
- Color-coded buttons for different error types
- Responsive layout
- Configuration information display

## 🔧 Configuration Files

### `sentry.client.config.ts`
Client-side Sentry initialization:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1",
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
});
```

### `sentry.server.config.ts`
Server-side Sentry initialization (same as client config).

### `instrumentation.ts`
Registers Sentry for Node.js and Edge runtimes:
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

### `next.config.ts`
Next.js configuration with Sentry:
```typescript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Your config here
};

export default withSentryConfig(nextConfig, {
  silent: true, // Suppress webpack plugin logs
});
```

## 🌍 Environment Variables (Optional)

Create `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1
SENTRY_AUTH_TOKEN=your-auth-token
NODE_ENV=development
```

Then update configs to use:
```typescript
dsn: process.env.NEXT_PUBLIC_SENTRY_DSN
```

## 🐞 Troubleshooting

### Errors Not Appearing in Bugsink

1. **Verify DSN:** Check all config files have correct DSN
2. **Enable debug mode:** Set `debug: true` in Sentry configs
3. **Check server logs:** Look for "SDK successfully initialized"
4. **Network tab:** Verify requests to `bugsink.digiprodpass.com`
5. **Dashboard access:** Ensure https://bugsink.digiprodpass.com/ is accessible

### Build Errors

```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📖 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Learn Next.js](https://nextjs.org/learn)

### Sentry Resources
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Tracking Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)

### Bugsink
- [Dashboard](https://bugsink.digiprodpass.com/)

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Production Configuration
Update Sentry configs for production:
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // Lower in production
  sampleRate: 1.0,
  debug: false,
  environment: 'production',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
});
```

### Deploy on Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN` (for source maps)

## ✅ What's Working

- [x] Client-side error tracking
- [x] Server-side error tracking (API routes)
- [x] Performance monitoring (transactions & spans)
- [x] Session tracking
- [x] Request/response logging
- [x] Custom context & tags
- [x] User tracking
- [x] 44 integrations loaded
- [x] Http integration active
- [x] Express integration available
- [x] Database integrations ready
- [x] AI integrations ready

## 📝 Notes

- Next.js 13+ uses its own HTTP server (not Express)
- Http integration handles all Next.js requests
- Express integration is available but dormant
- All errors sent to Bugsink at `bugsink.digiprodpass.com`
- Source maps can be uploaded with `SENTRY_AUTH_TOKEN`

---

**Built with Next.js 16.1.1 + Sentry SDK 10.32.1**
**Error Tracking: Bugsink (Sentry-compatible)**
