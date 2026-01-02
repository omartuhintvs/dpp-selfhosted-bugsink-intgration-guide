import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = Sentry.getClient();

    if (!client) {
      return NextResponse.json({ error: "Sentry client not found" }, { status: 500 });
    }

    const options = client.getOptions();

    // Get integration names
    const integrations = options.integrations?.map((integration: any) => ({
      name: integration.name || 'Unknown',
      setupOnce: !!integration.setupOnce,
    })) || [];

    // Check for specific integrations
    const expressIntegration = integrations.find((i: any) => i.name === 'Express');
    const httpIntegration = integrations.find((i: any) => i.name === 'Http');

    return NextResponse.json({
      sdkVersion: options._metadata?.sdk?.version || 'Unknown',
      dsn: options.dsn || 'Not configured',
      environment: options.environment || 'Not set',
      totalIntegrations: integrations.length,
      integrations: integrations,
      serverType: {
        isNextJs: true,
        usesExpress: !!expressIntegration,
        usesHttp: !!httpIntegration,
        note: "Next.js 13+ uses its own server, not Express. The Http integration handles requests."
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check integrations",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
