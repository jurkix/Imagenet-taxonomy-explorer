import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import type { ReactNode } from "react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="mx-auto max-w-md p-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-1 text-red-500">{message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-3 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("ErrorBoundary caught:", error, info.componentStack);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
