import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Sentry Webpack Plugin options
  silent: true, // Suppresses Sentry webpack plugin logs

  // Uncomment for source map upload (requires SENTRY_AUTH_TOKEN):
  // widenClientFileUpload: true,
  // hideSourceMaps: true,
});
