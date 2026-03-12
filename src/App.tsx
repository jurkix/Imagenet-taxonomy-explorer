import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { TreeView } from "./components/TreeView";
import { TreeViewSkeleton } from "./components/TreeViewSkeleton";
import { DetailModal } from "./components/DetailModal";
import { useSearch, SEARCH_MIN_QUERY_LENGTH } from "./api/hooks";
import type { ApiTreeNode } from "@lib/types";

const SEARCH_DEBOUNCE_MS = 300;

export function App() {
  const [selectedNode, setSelectedNode] = useState<ApiTreeNode | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSearch(debouncedQuery);

  const results = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;
  const isActive = debouncedQuery.length >= SEARCH_MIN_QUERY_LENGTH;
  const isStale =
    query !== debouncedQuery && query.length >= SEARCH_MIN_QUERY_LENGTH;

  const handleSelect = useCallback((node: ApiTreeNode) => {
    setSelectedNode(node);
    setQuery("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              ImageNet Explorer
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and search the ImageNet taxonomy
            </p>
          </div>

          <div className="relative">
            <SearchBar value={query} onChange={setQuery} />
            {isActive && (
              <div className="absolute top-full right-0 left-0 z-50 mt-2">
                <SearchResults
                  results={results}
                  total={total}
                  isLoading={isLoading}
                  isStale={isStale}
                  isError={isError}
                  error={error}
                  onRetry={refetch}
                  hasNextPage={!!hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onFetchNextPage={fetchNextPage}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </div>

          <Suspense fallback={<TreeViewSkeleton />}>
            <TreeView onSelect={handleSelect} />
          </Suspense>
        </div>

        <DetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </main>
    </div>
  );
}
