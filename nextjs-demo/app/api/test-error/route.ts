import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Throw a test error
    throw new Error("This is a test error sent to Sentry!");
  } catch (error) {
    // Capture the error with Sentry
    Sentry.captureException(error);

    // Return error response
    return NextResponse.json(
      {
        error: "Test error thrown and sent to Sentry",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
