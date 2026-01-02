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
├── README.md                           # This file - Main documentation
├── SECURITY.md                         # 🔐 Security hardening guide
├── SENTRY_INTEGRATION_NEXTJS.md       # Complete Next.js integration guide
├── SENTRY_INTEGRATION_EXPRESS.md      # Complete Express.js integration guide
│
├── nextjs-demo/                       # Next.js 16 with App Router + Sentry
│   ├── app/                          # Next.js app directory
│   │   ├── test-sentry/              # Error testing page
│   │   │   └── page.tsx             # Interactive error testing UI
│   │   ├── api/                      # API routes with error tracking
│   │   │   ├── test-error/          # API error testing endpoint
│   │   │   └── check-integrations/  # Integration status endpoint
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Home page
│   │   └── global.css               # Global styles
│   ├── public/                       # Static assets
│   ├── sentry.client.config.ts       # 🔐 Client-side config (with beforeSend filtering)
│   ├── sentry.server.config.ts       # 🔐 Server-side config (with beforeSend filtering)
│   ├── instrumentation.ts            # Sentry instrumentation hook
│   ├── next.config.ts               # Next.js + Sentry webpack config
│   ├── .env.local.example           # 🔐 Environment variables template
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── INTEGRATION_VERIFICATION.md  # Verification report
│   └── README.md                    # Next.js demo documentation
│
└── express-sentry-demo/              # Express.js + Sentry demo
    ├── app.js                        # 🔐 Express server (with beforeSend filtering)
    ├── .env                          # 🔐 Environment variables (excluded from git)
    ├── .env.example                  # 🔐 Environment variables template
    ├── .gitignore                    # 🔐 Git ignore rules
    ├── package.json                  # Dependencies
    └── README.md                     # Express demo documentation

🔐 = Security hardened files (credentials filtered, environment-based config)
```

## 🚀 Quick Start

### Option 1: Next.js Demo

```bash
cd nextjs-demo

# 1. Install dependencies
npm install

# 2. Configure environment (copy template and add your DSN)
cp .env.local.example .env.local
# Edit .env.local and add your Bugsink DSN

# 3. Start development server
npm run dev
```

Visit:
- **Main App:** http://localhost:3000
- **Sentry Test Page:** http://localhost:3000/test-sentry
- **Integration Check:** http://localhost:3000/api/check-integrations

### Option 2: Express.js Demo

```bash
cd express-sentry-demo

# 1. Install dependencies
npm install

# 2. Configure environment (copy template and add your DSN)
cp .env.example .env
# Edit .env and add your Bugsink DSN

# 3. Start server
node app.js
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

All errors are tracked and sent to your configured Bugsink instance:
- **Dashboard:** https://bugsink.digiprodpass.com/ (or your self-hosted instance)
- **Configuration:** Set via environment variables (see `.env.example` files)
- **Security:** Credentials filtered automatically via `beforeSend` hooks

### Features
✓ Client-side error tracking
✓ Server-side error tracking (API routes)
✓ Performance monitoring (traces & spans)
✓ Session tracking
✓ Request/Response logging
✓ 🔐 Automatic credential filtering (passwords, tokens, API keys)
✓ 🔐 Optimized sample rates (10% prod, 100% dev)
✓ 44 integrations loaded (Express, Http, Database, AI, etc.)

## 📚 Additional Documentation

### Repository Root Guides
- **[SECURITY.md](./SECURITY.md)** - 🔐 Security hardening guide (credential management, data filtering, production checklist)
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

Get your actual DSN from your Bugsink dashboard:
1. Log into https://bugsink.digiprodpass.com/
2. Navigate to: Settings → Projects → [Your Project]
3. Click "Client Keys (DSN)"
4. Copy your DSN

### Environment Variables Setup

**For Next.js** - Copy template and configure:
```bash
cp nextjs-demo/.env.local.example nextjs-demo/.env.local
# Edit .env.local with your actual DSN
```

Template contents (`.env.local.example`):
```env
# REQUIRED: Get from Bugsink dashboard
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_PUBLIC_KEY@your-bugsink-domain.com/PROJECT_ID
SENTRY_DSN=https://YOUR_PUBLIC_KEY@your-bugsink-domain.com/PROJECT_ID

# Optional: Override sample rates (defaults: 10% prod, 100% dev)
# SENTRY_TRACES_SAMPLE_RATE=0.1
```

**For Express.js** - Copy template and configure:
```bash
cp express-sentry-demo/.env.example express-sentry-demo/.env
# Edit .env with your actual DSN
```

Template contents (`.env.example`):
```env
# Environment
NODE_ENV=development
PORT=3000

# REQUIRED: Get from Bugsink dashboard
SENTRY_DSN=https://YOUR_PUBLIC_KEY@your-bugsink-domain.com/PROJECT_ID

# Optional: Override sample rates
# SENTRY_TRACES_SAMPLE_RATE=0.1
# SENTRY_PROFILES_SAMPLE_RATE=0.1
```

> **Security:** `.env` and `.env.local` files are automatically excluded from git via `.gitignore`

## 🔐 Configuration Examples

### Next.js Configuration (Security Hardened)

**Client-side** (`sentry.client.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 10% sample rate in production, 100% in dev
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',

  // Filter sensitive data before sending
  beforeSend(event, hint) {
    // Redact passwords, tokens, API keys
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map(exception => {
        if (exception.value) {
          exception.value = exception.value
            .replace(/password["\s:=]+[^\s&"]*/gi, 'password=***REDACTED***')
            .replace(/token["\s:=]+[^\s&"]*/gi, 'token=***REDACTED***');
        }
        return exception;
      });
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }

    return event;
  },
});
```

**Server-side** (`sentry.server.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',

  // Same beforeSend filtering as client-side
  beforeSend(event, hint) {
    // See full implementation in actual files
    return event;
  },
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

### Express.js Configuration (Security Hardened)

**App initialization** (`app.js` or `server.js`):
```javascript
// IMPORTANT: Initialize Sentry FIRST
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 10% sample rate in production, 100% in dev
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  integrations: [nodeProfilingIntegration()],

  // Filter sensitive data before sending
  beforeSend(event, hint) {
    // Redact passwords, tokens, API keys from error messages
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map(exception => {
        if (exception.value) {
          exception.value = exception.value
            .replace(/password["\s:=]+[^\s&"]*/gi, 'password=***REDACTED***')
            .replace(/token["\s:=]+[^\s&"]*/gi, 'token=***REDACTED***')
            .replace(/mongodb:\/\/[^@]+@/gi, 'mongodb://***REDACTED***@');
        }
        return exception;
      });
    }

    // Remove sensitive headers and cookies
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    if (event.request?.cookies) {
      delete event.request.cookies;
    }

    return event;
  },
});

// Now import other modules
const express = require("express");
const app = express();

// Sentry error handler automatically catches errors
Sentry.setupExpressErrorHandler(app);

// Your routes here
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

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

1. **Check DSN is configured:**
   ```bash
   # Next.js - verify .env.local exists and has DSN
   cat nextjs-demo/.env.local | grep SENTRY_DSN

   # Express - verify .env exists and has DSN
   cat express-sentry-demo/.env | grep SENTRY_DSN
   ```

2. **Enable debug mode:**
   Set `debug: true` in Sentry configs or check server logs

3. **Check server logs:**
   Look for "SDK successfully initialized" message

4. **Verify network requests:**
   Open browser DevTools → Network tab → Filter for "bugsink"

5. **Test with simple error:**
   ```bash
   curl http://localhost:3000/test-sentry/error
   ```

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

1. **🔐 Review Security** - Read [SECURITY.md](./SECURITY.md) for production hardening checklist
2. **Configure Environment** - Set up `.env` files with your actual Bugsink DSN
3. **Test Filtering** - Verify sensitive data redaction is working (see SECURITY.md)
4. **Customize Sample Rates** - Adjust based on your traffic (default: 10% prod, 100% dev)
5. **Add Error Boundaries** - Implement React error boundaries for better UX
6. **Set Up Alerts** - Configure notifications in Bugsink for critical errors
7. **Monitor Performance** - Use transaction tracking to identify bottlenecks
8. **Track Releases** - Use release tracking to correlate errors with deployments

**Production Checklist:** See [SECURITY.md](./SECURITY.md#-production-deployment-checklist) for complete deployment guide.

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
