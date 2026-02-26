import { useState, useMemo } from "react";
import { useSearch } from "@/api/hooks";
import { useDebounce } from "./useDebounce";
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_QUERY_LENGTH } from "@/constants";

export function useSearchState() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSearch(debouncedQuery);

  const results = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const isActive = debouncedQuery.length >= SEARCH_MIN_QUERY_LENGTH;

  return {
    query,
    setQuery,
    results,
    total,
    isLoading,
    isActive,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}
