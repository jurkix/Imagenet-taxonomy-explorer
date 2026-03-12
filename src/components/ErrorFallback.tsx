import { AlertCircle } from "lucide-react";

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="mx-auto max-w-md p-8">
      <div role="alert" className="alert alert-error">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h3 className="font-bold">Something went wrong</h3>
          <p className="text-xs">{message}</p>
        </div>
        <button onClick={resetErrorBoundary} className="btn btn-sm">
          Try again
        </button>
      </div>
    </div>
  );
}
