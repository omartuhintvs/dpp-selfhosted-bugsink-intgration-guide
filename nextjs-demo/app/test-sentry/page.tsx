"use client";

import * as Sentry from "@sentry/nextjs";

export default function TestSentryPage() {
  const throwError = () => {
    throw new Error("Client-side test error from button click!");
  };

  const sendServerError = async () => {
    try {
      const response = await fetch("/api/test-error");
      const data = await response.json();
      console.log("Server error response:", data);
    } catch (error) {
      console.error("Failed to send server error:", error);
    }
  };

  const captureManualError = () => {
    Sentry.captureException(new Error("Manually captured error from Sentry.captureException"));
  };

  const throwRandomError = () => {
    const errorTypes = [
      { type: "TypeError", message: "Cannot read property 'undefined' of null" },
      { type: "ReferenceError", message: "Variable is not defined" },
      { type: "RangeError", message: "Array length is invalid" },
      { type: "NetworkError", message: "Failed to fetch data from API" },
      { type: "ValidationError", message: "Invalid user input detected" },
      { type: "AuthError", message: "Unauthorized access attempt" },
      { type: "DatabaseError", message: "Connection to database failed" },
      { type: "TimeoutError", message: "Request timeout exceeded" },
      { type: "ParseError", message: "Failed to parse JSON response" },
      { type: "PermissionError", message: "Insufficient permissions to perform action" },
    ];

    const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const error = new Error(randomError.message);
    error.name = randomError.type;

    // Add some random context
    Sentry.setContext("random_error_context", {
      timestamp: new Date().toISOString(),
      errorType: randomError.type,
      randomId: Math.random().toString(36).substring(7),
    });

    throw error;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sentry Error Testing</h1>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Error Types</h2>

            <div className="space-y-3">
              <button
                onClick={throwError}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Throw Client-Side Error
              </button>

              <button
                onClick={sendServerError}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Trigger Server-Side Error (API Route)
              </button>

              <button
                onClick={captureManualError}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Capture Manual Error
              </button>

              <button
                onClick={throwRandomError}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Throw Random Error
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Sentry Configuration</h2>
            <p className="text-gray-600 text-sm">
              DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Configured ✓' : 'Not configured - set NEXT_PUBLIC_SENTRY_DSN'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Sample Rate: {process.env.NODE_ENV === 'production' ? '10%' : '100% (dev)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
