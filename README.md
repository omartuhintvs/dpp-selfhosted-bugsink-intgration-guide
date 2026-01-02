# Bugsink Self-Hosted Integration Guide

<div align="center">

[![Bugsink](https://img.shields.io/badge/Bugsink-Compatible-success)](https://bugsink.digiprodpass.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org)
[![Sentry](https://img.shields.io/badge/Sentry-10.32.1-purple)](https://sentry.io)

A comprehensive guide and demo repository for integrating [Bugsink](https://bugsink.digiprodpass.com/) (Sentry-compatible error tracking) into Next.js and Express.js applications.

[Quick Start](#-quick-start) • [Integration Guides](#-integration-guides) • [Demos](#-project-structure) • [Documentation](#-additional-documentation)

</div>

---

## 📖 About This Repository

This repository provides everything you need to integrate Bugsink error tracking into your applications:

- ✅ **Complete Integration Guides** - Step-by-step documentation for Next.js and Express.js
- ✅ **Working Demo Applications** - Real implementations you can run and test immediately
- ✅ **Best Practices** - Production-ready configuration examples
- ✅ **Testing Tools** - Built-in test endpoints to verify your integration
- ✅ **TypeScript & JavaScript** - Examples for both languages
- ✅ **44+ Integrations** - Database, AI, Framework integrations included

## 🌟 About Bugsink

Bugsink is a self-hosted, Sentry-compatible error tracking platform. It uses the same SDK and API as Sentry, making it a drop-in replacement for your error monitoring needs.

- **Bugsink Instance:** https://bugsink.digiprodpass.com/
- **Example Project ID:** 1
- **Compatibility:** 100% Sentry SDK compatible

## 🎯 Why Sentry (Bugsink)?

### The Problem Without Error Tracking

**Production errors are invisible:**
- Users encounter errors, but you don't know what happened
- `console.log()` doesn't work in production
- Reproducing user issues is nearly impossible
- Critical bugs go unnoticed until customers complain
- No context: What user? What browser? What actions led to the error?

### What Sentry/Bugsink Solves

**Real-time error monitoring:**
- ✅ Capture every error automatically (client & server)
- ✅ Full stack traces with source maps
- ✅ User context (who experienced the error)
- ✅ Breadcrumbs (what they did before the error)
- ✅ Environment details (browser, OS, device)
- ✅ Release tracking (which version introduced the bug)

**Performance insights:**
- 📊 Transaction monitoring
- 📊 Slow query detection
- 📊 API response times
- 📊 Frontend performance metrics

**Developer productivity:**
- 🚀 Fix bugs before users report them
- 🚀 Prioritize by impact (how many users affected)
- 🚀 Group similar errors together
- 🚀 See trends over time
- 🚀 Integration with issue trackers (Jira, GitHub)

### Why Bugsink (Self-Hosted)?

**Bugsink gives you all of Sentry's power, plus:**

| Feature | Bugsink (Self-Hosted) | Sentry Cloud |
|---------|----------------------|--------------|
| **Data Control** | ✅ Your infrastructure | ❌ Third-party servers |
| **Privacy** | ✅ Sensitive data stays internal | ⚠️ Data sent to Sentry |
| **Cost** | ✅ Unlimited events | ❌ Pay per event |
| **Customization** | ✅ Full control | ⚠️ Limited |
| **Compliance** | ✅ Meet data residency requirements | ⚠️ May not comply |
| **SDK Compatibility** | ✅ 100% Sentry SDK compatible | ✅ Native |

**Perfect for:**
- 🏢 Enterprise applications with compliance requirements
- 💰 High-traffic apps (avoid per-event costs)
- 🔒 Applications handling sensitive data
- 🌍 Companies with data residency restrictions
- 🛠️ Teams wanting full control over their monitoring stack

## 📁 Project Structure

```
dpp-selfhosted-bugsink-setup-guide/
├── README.md                           # This file
├── SENTRY_INTEGRATION_NEXTJS.md       # Complete Next.js integration guide
├── SENTRY_INTEGRATION_EXPRESS.md      # Complete Express.js integration guide
├── nextjs-demo/                       # Next.js 16 with App Router + Sentry
│   ├── app/                          # Next.js app directory
│   │   ├── test-sentry/              # Error testing page
│   │   └── api/                      # API routes with error tracking
│   ├── public/                       # Static assets
│   ├── sentry.client.config.ts       # Client-side Sentry config
│   ├── sentry.server.config.ts       # Server-side Sentry config
│   ├── instrumentation.ts            # Sentry instrumentation hook
│   └── INTEGRATION_VERIFICATION.md   # Verification report
└── express-sentry-demo/              # Express.js + Sentry demo
    ├── test-sentry.js                # Express server with test routes
    └── README.md                     # Express demo documentation
```

## 🚀 Quick Start

### Option 1: Next.js Demo

```bash
cd nextjs-demo
npm install
npm run dev
```

Visit:
- **Main App:** http://localhost:3000
- **Sentry Test Page:** http://localhost:3000/test-sentry
- **Integration Check:** http://localhost:3000/api/check-integrations

### Option 2: Express.js Demo

```bash
cd express-sentry-demo
node test-sentry.js
```

Test endpoints:
```bash
# Trigger errors
curl http://localhost:3000/test-sentry/error
curl http://localhost:3000/test-sentry/capture-exception
curl http://localhost:3000/test-sentry/error-with-context
```

## 📚 Integration Guides

Before integrating into your own project, read the comprehensive guides:

- **[Next.js Integration Guide](./SENTRY_INTEGRATION_NEXTJS.md)** - Complete setup for Next.js applications
  - Client & server configuration
  - Instrumentation hooks
  - Error boundaries
  - Production optimization

- **[Express.js Integration Guide](./SENTRY_INTEGRATION_EXPRESS.md)** - Complete setup for Express.js applications
  - Server initialization
  - Middleware setup
  - TypeScript configuration
  - Database & logger integration

## 🔧 Technology Stack

### Next.js Demo
- **Framework:** Next.js 16.1.1 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Error Tracking:** @sentry/nextjs 10.32.1
- **Platform:** Bugsink (Sentry-compatible)

### Express.js Demo
- **Framework:** Express.js
- **Language:** JavaScript (TypeScript examples in guide)
- **Error Tracking:** @sentry/node + @sentry/profiling-node
- **Platform:** Bugsink (Sentry-compatible)

## 🐛 Bugsink Integration

All errors are tracked and sent to:
- **Dashboard:** https://bugsink.digiprodpass.com/
- **Project ID:** 1
- **DSN:** `https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1`

### Features
✓ Client-side error tracking
✓ Server-side error tracking (API routes)
✓ Performance monitoring (traces & spans)
✓ Session tracking
✓ Request/Response logging
✓ 44 integrations loaded (Express, Http, Database, AI, etc.)

## 📚 Additional Documentation

### Repository Root Guides
- [SENTRY_INTEGRATION_NEXTJS.md](./SENTRY_INTEGRATION_NEXTJS.md) - Comprehensive Next.js guide
- [SENTRY_INTEGRATION_EXPRESS.md](./SENTRY_INTEGRATION_EXPRESS.md) - Comprehensive Express.js guide

### Demo-Specific Documentation
- [nextjs-demo/README.md](./nextjs-demo/README.md) - Next.js demo documentation
- [nextjs-demo/INTEGRATION_VERIFICATION.md](./nextjs-demo/INTEGRATION_VERIFICATION.md) - Verification report
- [express-sentry-demo/README.md](./express-sentry-demo/README.md) - Express demo documentation

## 🧪 Testing Error Tracking

### Interactive Test Page

Visit http://localhost:3000/test-sentry to access buttons for testing:

1. **Throw Client-Side Error** - Tests browser error tracking
2. **Trigger Server-Side Error** - Tests API route error tracking
3. **Capture Manual Error** - Tests manual Sentry.captureException
4. **Throw Random Error** - Generates random error types with context

### API Endpoints

```bash
# Trigger a test error
curl http://localhost:3000/api/test-error

# Check active integrations
curl http://localhost:3000/api/check-integrations | jq .
```

### Manual Testing

```typescript
import * as Sentry from "@sentry/nextjs";

// Capture an exception
try {
  throw new Error("Something went wrong!");
} catch (error) {
  Sentry.captureException(error);
}

// Capture a message
Sentry.captureMessage("User completed action", "info");

// Set user context
Sentry.setUser({
  id: "123",
  email: "user@example.com"
});

// Add custom context
Sentry.setContext("order", {
  orderId: "ABC123",
  total: 99.99
});
```

## 🔍 Verifying Integration

### Check Server Logs
Look for these indicators:
```
✓ SDK successfully initialized
✓ Integration installed: Http
✓ Integration installed: Express
✓ Captured error event `<error message>`
✓ SpanExporter exported N spans
```

### Check Bugsink Dashboard
1. Visit https://bugsink.digiprodpass.com/
2. Navigate to Project #1
3. Verify errors appear within seconds of being triggered

### Integration Status
Run the integration check endpoint:
```bash
curl http://localhost:3000/api/check-integrations | jq '.integrations[] | select(.name | contains("Http") or contains("Express"))'
```

## 📋 Available Scripts

### Next.js Demo

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 🏗️ Project Setup from Scratch

### Clone This Repository
```bash
# Clone the repository
git clone git@github.com:omartuhintvs/dpp-selfhosted-bugsink-setup-guide.git
cd dpp-selfhosted-bugsink-setup-guide

# Option 1: Setup Next.js demo
cd nextjs-demo
npm install
npm run dev

# Option 2: Setup Express.js demo
cd express-sentry-demo
node test-sentry.js
```

### Integrate Into Your Own Project

#### For Next.js Projects

1. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   ```

2. Create configuration files (see [SENTRY_INTEGRATION_NEXTJS.md](./SENTRY_INTEGRATION_NEXTJS.md)):
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `instrumentation.ts`
   - Update `next.config.ts`

#### For Express.js Projects

1. Install Sentry SDK:
   ```bash
   npm install @sentry/node @sentry/profiling-node
   ```

2. Initialize Sentry (see [SENTRY_INTEGRATION_EXPRESS.md](./SENTRY_INTEGRATION_EXPRESS.md)):
   - Add Sentry.init() before other imports
   - Add request and error handlers
   - Configure DSN and options

### Getting Your DSN

Your Sentry DSN (Data Source Name) format:
```
https://<public_key>@<host>/<project_id>
```

**Example DSN:**
```
https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1
```

Get your actual DSN from your [Bugsink project settings](https://bugsink.digiprodpass.com/).

### Environment Variables (Recommended)

**For Next.js** - Create `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@bugsink.digiprodpass.com/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
NODE_ENV=development
```

**For Express.js** - Create `.env`:
```env
SENTRY_DSN=https://your-key@bugsink.digiprodpass.com/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
NODE_ENV=development
PORT=3000
```

> **Important:** Replace with your actual DSN from Bugsink dashboard and add `.env` / `.env.local` to `.gitignore`

## 🔐 Configuration Examples

### Next.js Configuration

**Client-side** (`sentry.client.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
});
```

**Server-side** (`sentry.server.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
});
```

**Instrumentation** (`instrumentation.ts`):
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
}
```

**Next.js Config** (`next.config.ts`):
```typescript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = { /* your config */ };

export default withSentryConfig(nextConfig, {
  silent: true,
});
```

### Express.js Configuration

**App initialization** (`app.js` or `server.js`):
```javascript
// IMPORTANT: Initialize Sentry FIRST
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  integrations: [nodeProfilingIntegration()],
});

// Now import other modules
const express = require("express");
const app = express();

// Sentry request handler MUST be first
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Your routes here
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Sentry error handler MUST be before other error handlers
app.use(Sentry.Handlers.errorHandler());

app.listen(3000);
```

## 🎯 Features Demonstrated

### Error Tracking
- [x] Client-side exceptions
- [x] Server-side exceptions (API routes)
- [x] Unhandled promise rejections
- [x] Manual error capture
- [x] Error boundaries

### Context & Metadata
- [x] User information tracking
- [x] Custom context data
- [x] Tags for categorization
- [x] Breadcrumbs for event trails

### Performance Monitoring
- [x] Transaction tracking
- [x] Span creation
- [x] Request/response timing
- [x] Database query tracking (when applicable)

### Integrations
- [x] Http integration (active)
- [x] Express integration (available)
- [x] Database integrations (Postgres, MySQL, MongoDB, Redis)
- [x] AI integrations (OpenAI, Anthropic, LangChain)
- [x] Framework integrations (Fastify, Hono, Koa, Hapi)

## 🐞 Troubleshooting

### Errors Not Appearing

1. **Check DSN is correct:**
   ```bash
   grep -r "6f851a3a441b45ddb1b24bfe54d25ec3" nextjs-demo/
   ```

2. **Enable debug mode:**
   Set `debug: true` in Sentry configs

3. **Check server logs:**
   Look for "SDK successfully initialized"

4. **Verify network requests:**
   Open browser DevTools → Network tab → Filter for "bugsink"

### Port Already in Use

If port 3000 is in use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

### Build Errors

```bash
# Clean build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📖 Additional Resources

### Official Documentation
- **Bugsink Dashboard:** https://bugsink.digiprodpass.com/
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Node.js Documentation](https://docs.sentry.io/platforms/node/)
- [Sentry Express Documentation](https://docs.sentry.io/platforms/node/guides/express/)
- [Next.js Documentation](https://nextjs.org/docs)

### This Repository's Guides
- [SENTRY_INTEGRATION_NEXTJS.md](./SENTRY_INTEGRATION_NEXTJS.md) - 440 lines of comprehensive Next.js guide
- [SENTRY_INTEGRATION_EXPRESS.md](./SENTRY_INTEGRATION_EXPRESS.md) - 757 lines of comprehensive Express.js guide
- [nextjs-demo/INTEGRATION_VERIFICATION.md](./nextjs-demo/INTEGRATION_VERIFICATION.md) - Verification report

### Sentry Best Practices
- [Error Tracking Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Release Tracking](https://docs.sentry.io/product/releases/)

## 🤝 Contributing

Contributions are welcome! When adding new features or fixes:

1. Test error tracking still works
2. Update relevant documentation
3. Run `npm run lint` before committing
4. Verify in Bugsink dashboard
5. Follow existing code patterns
6. Add examples if introducing new features

## 📝 License

This project is provided as-is for demonstration and documentation purposes.

## 💡 What's Next?

After setting up:

1. **Customize for Production** - Adjust sample rates, add filters, configure releases
2. **Add Error Boundaries** - Implement React error boundaries for better UX
3. **Set Up Alerts** - Configure notifications in Bugsink for critical errors
4. **Monitor Performance** - Use transaction tracking to identify bottlenecks
5. **Filter Sensitive Data** - Implement `beforeSend` hooks to scrub PII
6. **Track Releases** - Use release tracking to correlate errors with deployments

## 🙋 Support

For issues related to:
- **This repository:** Open an issue on GitHub
- **Bugsink platform:** Contact your Bugsink administrator
- **Sentry SDK:** Refer to [official Sentry documentation](https://docs.sentry.io/)

## 🔗 Quick Links

- **Repository:** https://github.com/omartuhintvs/dpp-selfhosted-bugsink-setup-guide
- **Bugsink Dashboard:** https://bugsink.digiprodpass.com/
- **Next.js:** https://nextjs.org
- **Sentry Docs:** https://docs.sentry.io

---

<div align="center">

**Last Updated:** January 2, 2026
**Next.js Version:** 16.1.1 | **Sentry SDK:** 10.32.1

Made with ❤️ for the DigiProdPass Team

[Report Issue](https://github.com/omartuhintvs/dpp-selfhosted-bugsink-setup-guide/issues) • [View on GitHub](https://github.com/omartuhintvs/dpp-selfhosted-bugsink-setup-guide)

</div>
