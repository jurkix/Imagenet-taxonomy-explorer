import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { SearchResult, ApiTreeNode } from "@lib/types";

const SEARCH_ROW_HEIGHT = 52;
const SEARCH_OVERSCAN = 10;
const INFINITE_SCROLL_THRESHOLD = 5;

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  isStale: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onSelect: (node: ApiTreeNode) => void;
}

export function SearchResults({
  results,
  total,
  isLoading,
  isStale,
  isError,
  error,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onSelect,
}: SearchResultsProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => SEARCH_ROW_HEIGHT,
    overscan: SEARCH_OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems.at(-1)?.index;

  useEffect(() => {
    if (
      lastIndex != null &&
      lastIndex >= results.length - INFINITE_SCROLL_THRESHOLD &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      onFetchNextPage();
    }
  }, [
    lastIndex,
    results.length,
    hasNextPage,
    isFetchingNextPage,
    onFetchNextPage,
  ]);

  if (isError) {
    return (
      <div className="card card-bordered border-border bg-card shadow-(--shadow-elevated)">
        <div className="card-body p-3">
          <div
            role="alert"
            className="alert alert-error bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <div>
              <h3 className="font-bold text-sm">Search failed</h3>
              <p className="text-xs">
                {error?.message ?? "An unexpected error occurred."}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button className="btn btn-sm btn-outline gap-1" onClick={onRetry}>
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && results.length === 0) {
    return (
      <div
        className="card card-bordered border-border bg-card shadow-(--shadow-elevated)"
        role="status"
        aria-live="polite"
      >
        <div className="card-body p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="loading loading-spinner loading-xs" />
            Searching...
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="card card-bordered border-border bg-card shadow-(--shadow-elevated)">
        <div className="card-body p-4 text-sm text-muted-foreground">
          No results found.
        </div>
      </div>
    );
  }

  return (
    <div className="card card-bordered border-border bg-card shadow-(--shadow-elevated) overflow-hidden relative">
      {isStale && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end p-2">
          <span className="loading loading-spinner loading-xs text-primary" />
        </div>
      )}
      <div
        className={`border-b border-border bg-card px-4 py-2 ${isStale ? "opacity-60" : ""}`}
      >
        <span className="badge badge-sm bg-muted text-muted-foreground border-0">
          {total} results
        </span>
      </div>
      <div
        ref={parentRef}
        className={`max-h-72 overflow-auto ${isStale ? "opacity-60" : ""}`}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((vr) => {
            const result = results[vr.index];
            return (
              <button
                key={result.id}
                onClick={() => onSelect(result)}
                aria-label={`${result.name} — ${result.breadcrumbs.join(" > ")}`}
                className="group absolute left-0 top-0 flex w-full cursor-pointer flex-col justify-center gap-0.5 px-4 text-left transition-colors hover:bg-tree-hover"
                style={{
                  height: vr.size,
                  transform: `translateY(${vr.start}px)`,
                }}
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary">
                  {result.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {result.breadcrumbs.join(" > ")}
                </span>
              </button>
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-3">
            <span className="loading loading-spinner loading-xs text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
