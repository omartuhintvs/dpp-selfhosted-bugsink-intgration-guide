# Security Hardening Guide

This document describes the security measures implemented in the Bugsink integration demos.

## ✅ Security Measures Implemented

### 1. Credential Management

**Problem:** Hardcoded DSN credentials in source code
**Solution:** Environment variable configuration

- ✅ All DSN values moved to environment variables
- ✅ `.env.example` files provided with placeholders
- ✅ `.gitignore` configured to prevent `.env` files from being committed
- ✅ No credentials in git history (for new repositories)

**Setup:**
```bash
# Next.js
cp nextjs-demo/.env.local.example nextjs-demo/.env.local
# Edit .env.local and add your actual DSN

# Express
cp express-sentry-demo/.env.example express-sentry-demo/.env
# Edit .env and add your actual DSN
```

### 2. Sensitive Data Filtering

**Problem:** Passwords, tokens, and secrets could be logged in error messages
**Solution:** `beforeSend` hooks filter sensitive patterns

**What gets filtered:**
- Passwords (`password=***REDACTED***`)
- API keys (`api_key=***REDACTED***`)
- Auth tokens (`token=***REDACTED***`)
- Bearer tokens (`authorization: bearer ***REDACTED***`)
- Database connection strings (credentials redacted)
- Authorization headers (removed)
- Cookies (removed)
- Sensitive query parameters (redacted)

**Implementation:**
- `nextjs-demo/sentry.client.config.ts` - Client-side filtering
- `nextjs-demo/sentry.server.config.ts` - Server-side filtering
- `express-sentry-demo/app.js` - Express filtering

### 3. Sample Rate Optimization

**Problem:** 100% sampling creates unnecessary load and storage
**Solution:** Smart sample rate defaults

**Configuration:**
- **Development:** 100% sample rate for full visibility
- **Production:** 10% sample rate to reduce overhead

**Override if needed:**
```bash
# .env or .env.local
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

### 4. Data Minimization

**Removed from error reports:**
- Cookies (often contain session tokens)
- Authorization headers
- Custom API key headers
- Sensitive query parameters

## 🔒 Production Deployment Checklist

Before deploying to production:

- [ ] Set `SENTRY_DSN` environment variable (do not hardcode)
- [ ] Set `NODE_ENV=production`
- [ ] Verify `.env` files are in `.gitignore`
- [ ] Configure appropriate sample rates (recommend 0.1-0.2)
- [ ] Test `beforeSend` filtering with sample errors
- [ ] Document Bugsink instance location (internal wiki)
- [ ] Set up DSN rotation procedure
- [ ] Review what data is being sent to Bugsink

## 🛡️ Internal Self-Hosted Considerations

Since Bugsink is self-hosted internally:

✅ **Advantages:**
- Data stays within your infrastructure
- No third-party data processors
- Full control over data retention
- Simplified compliance requirements

⚠️ **Still Important:**
- Filter secrets/credentials from error logs
- Use environment variables for all config
- Apply principle of least privilege
- Monitor Bugsink instance security

## 🔐 Credential Rotation

If DSN is compromised:

1. **Generate new DSN** in Bugsink dashboard:
   - Settings > Projects > [Your Project] > Client Keys
   - Create new key or regenerate existing

2. **Update environment variables:**
   ```bash
   # Update .env or .env.local
   SENTRY_DSN=https://NEW_KEY@your-bugsink-domain.com/PROJECT_ID
   ```

3. **Restart application** to pick up new DSN

4. **Revoke old DSN** in Bugsink dashboard

## 📋 Security Pattern Reference

### beforeSend Filter Pattern

```javascript
beforeSend(event, hint) {
  // Filter error messages
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
}
```

## 🧪 Testing Security Filters

Test that sensitive data is properly redacted:

```javascript
// Should result in: "Error: password=***REDACTED***"
throw new Error('Database error: password=secret123');

// Should result in: "Error: token=***REDACTED***"
throw new Error('Auth failed: token=abc123xyz');
```

Check Bugsink dashboard to verify redaction is working.

## 📚 Additional Resources

- [Sentry Data Filtering Docs](https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/)
- [Bugsink Documentation](https://bugsink.com/docs)
- Internal security policies (consult your security team)

---

**Last Updated:** 2026-01-02
**Reviewed By:** Automated Security Hardening
