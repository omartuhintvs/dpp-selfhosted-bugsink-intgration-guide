import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 0.1 (10%) for production to reduce overhead
  // Use 1.0 in development for full visibility
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

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
            .replace(/authorization:\s*bearer\s+\S+/gi, 'authorization: bearer ***REDACTED***');
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

    return event;
  },
});
