import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f851a3a441b45ddb1b24bfe54d25ec3@bugsink.digiprodpass.com/1",

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
