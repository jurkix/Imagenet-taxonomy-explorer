import { memo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";
import { SEARCH_ROW_HEIGHT, SEARCH_OVERSCAN, INFINITE_SCROLL_THRESHOLD } from "@/constants";
import type { SearchResult, ApiTreeNode } from "@lib/types";

const numberFmt = new Intl.NumberFormat();

interface SearchResultRowProps {
  result: SearchResult;
  onSelect: (node: ApiTreeNode) => void;
}

const SearchResultRow = memo(function SearchResultRow({ result, onSelect }: SearchResultRowProps) {
  return (
    <button
      onClick={() => onSelect(result)}
      aria-label={`${result.name} — ${result.breadcrumbs.join(" > ")}`}
      className="group flex h-full w-full cursor-pointer flex-col justify-center gap-0.5 px-4 text-left transition-colors hover:bg-tree-hover"
    >
      <span className="text-sm font-medium text-foreground group-hover:text-primary">
        {result.name}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {result.breadcrumbs.join(" > ")}
      </span>
    </button>
  );
});

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onSelect: (node: ApiTreeNode) => void;
}

export function SearchResults({
  results,
  total,
  isLoading,
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
    if (lastIndex != null && lastIndex >= results.length - INFINITE_SCROLL_THRESHOLD && hasNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  }, [lastIndex, results.length, hasNextPage, isFetchingNextPage, onFetchNextPage]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-(--shadow-elevated)" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching...
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-(--shadow-elevated)">
        No results found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-(--shadow-elevated)">
      <div className="border-b border-border bg-card px-4 py-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {numberFmt.format(total)} results
        </span>
      </div>
      <div ref={parentRef} className="max-h-72 overflow-auto">
        <div style={{ height: virtualizer.getTotalSize(), width: "100%", position: "relative" }}>
          {virtualItems.map((vr) => {
            const result = results[vr.index];
            return (
              <div
                key={result.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: vr.size,
                  transform: `translateY(${vr.start}px)`,
                }}
              >
                <SearchResultRow result={result} onSelect={onSelect} />
              </div>
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
