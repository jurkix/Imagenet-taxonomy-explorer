import { useSuspenseQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { SEARCH_MIN_QUERY_LENGTH, SEARCH_PAGE_SIZE } from "@/constants";
import type { ApiTreeNode, SearchResult, PaginatedResponse } from "@lib/types";

export function useRoots() {
  return useSuspenseQuery({
    queryKey: ["tree", "roots"],
    queryFn: ({ signal }) => apiFetch<{ data: ApiTreeNode[] }>("/api/tree/roots", signal),
  });
}

export function useSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam = 0, signal }) =>
      apiFetch<PaginatedResponse<SearchResult>>(
        `/api/search?q=${encodeURIComponent(query)}&limit=${SEARCH_PAGE_SIZE}&offset=${pageParam}`,
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    enabled: query.length >= SEARCH_MIN_QUERY_LENGTH,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
