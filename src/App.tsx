import { Suspense, useCallback, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./components/Layout/AppLayout";
import { SearchBar } from "./components/Search/SearchBar";
import { SearchResults } from "./components/Search/SearchResults";
import { TreeView } from "./components/TreeView/TreeView";
import { TreeViewSkeleton } from "./components/TreeView/TreeViewSkeleton";
import { DetailModal } from "./components/common/DetailModal";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { useSearchState } from "./hooks/useSearchState";
import type { ApiTreeNode } from "@lib/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const [selectedNode, setSelectedNode] = useState<ApiTreeNode | null>(null);
  const search = useSearchState();
  const { setQuery } = search;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleSelect = useCallback((node: ApiTreeNode) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setSelectedNode(node);
    setQuery("");
  }, [setQuery]);

  const handleCloseModal = useCallback(() => {
    setSelectedNode(null);
    requestAnimationFrame(() => {
      if (triggerRef.current?.isConnected) {
        triggerRef.current.focus();
      } else {
        searchInputRef.current?.focus();
      }
      triggerRef.current = null;
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ImageNet Explorer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and search the ImageNet taxonomy
          </p>
        </div>

        <div className="relative">
          <SearchBar
            ref={searchInputRef}
            value={search.query}
            onChange={search.setQuery}
          />
          {search.isActive && (
            <div className="absolute top-full right-0 left-0 z-50 mt-2">
              <SearchResults
                results={search.results}
                total={search.total}
                isLoading={search.isLoading}
                hasNextPage={search.hasNextPage}
                isFetchingNextPage={search.isFetchingNextPage}
                onFetchNextPage={search.fetchNextPage}
                onSelect={handleSelect}
              />
            </div>
          )}
        </div>

        <Suspense fallback={<TreeViewSkeleton />}>
          <TreeView onSelect={handleSelect} />
        </Suspense>
      </div>

      {selectedNode && (
        <DetailModal
          node={selectedNode}
          onClose={handleCloseModal}
        />
      )}
    </AppLayout>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
